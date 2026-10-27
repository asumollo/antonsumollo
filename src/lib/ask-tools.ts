import fs from "node:fs";
import path from "node:path";
import { site } from "@/site.config";
import { gear } from "@/gear.config";
import { getProjects } from "@/lib/projects";
import { plainText } from "@/components/rich-text";

/**
 * The Ask assistant's tools. Each one reads the same config the matching slash command shows
 * (/skills, /experience, /projects, /gear, /status), so the model looks things up instead of
 * getting everything pasted into its prompt, and every step the drawer shows is a real lookup.
 */

type ToolResult = {
  /** What the model reads. */
  content: string;
  /** The short result printed after the step's name, like "6 groups · 28 tools". */
  summary: string;
};

type Tool = {
  name: string;
  description: string;
  /** JSON Schema for the arguments, in the OpenAI-compatible tool format. */
  parameters: Record<string, unknown>;
  run: (args: Record<string, unknown>) => ToolResult;
};

const noArgs = { type: "object", properties: {}, additionalProperties: false };

/** A file from /content, without the HTML comment at its top (that's instructions for Anton, not facts). */
function readContent(...parts: string[]) {
  const file = path.join(process.cwd(), "content", ...parts);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8").replace(/<!--[\s\S]*?-->/g, "").trim() : "";
}

/** Anton's two resumes, one per kind of role he's applying for. Each is a file in /content/resume. */
const tracks = { cad: "CAD", fullstack: "full-stack" } as const;

const tools: Tool[] = [
  {
    name: "get_profile",
    description:
      "Who Anton is: bio, location, time zone, contact email, GitHub and LinkedIn links, and notes on work not " +
      "listed elsewhere, including his hands-on LLM and AI work. Check it for any question about his experience.",
    parameters: noArgs,
    run: () => {
      const about = readContent("about.md");
      return {
        content: [
          ...site.bio.map(plainText),
          `Location: ${site.location}`,
          `Email: ${site.email}`,
          `GitHub: ${site.links.github}`,
          `LinkedIn: ${site.links.linkedin}`,
          about,
        ].join("\n"),
        summary: "bio · links",
      };
    },
  },
  {
    name: "get_skills",
    description: "The languages, frameworks, databases, cloud, testing and PCB design tools Anton uses, by group.",
    parameters: noArgs,
    run: () => {
      const groups = site.toolGroups;
      const total = groups.reduce((n, g) => n + g.tools.length, 0);
      return {
        content: groups.map((g) => `${g.title}: ${g.tools.map((t) => t.name).join(", ")}`).join("\n"),
        summary: `${groups.length} groups · ${total} tools`,
      };
    },
  },
  {
    name: "get_experience",
    description: "Anton's jobs: role, company, dates and what he did in each.",
    parameters: noArgs,
    run: () => {
      const jobs = site.experience;
      return {
        content: jobs
          .map((j) => `- ${j.role}${j.company ? `, ${j.company}` : ""} (${j.start} to ${j.end}): ${j.summary}`)
          .join("\n"),
        summary: `${jobs.length} roles`,
      };
    },
  },
  {
    name: "get_resume",
    description:
      "Anton's full resume for one kind of role, with detailed achievements, numbers, projects, education and licenses. " +
      'track "cad" is for CAD, EDA, PCB or electronics tooling roles; "fullstack" is for web, backend, full-stack and AI product roles.',
    parameters: {
      type: "object",
      properties: { track: { type: "string", enum: Object.keys(tracks), description: "Which resume to read." } },
      required: ["track"],
      additionalProperties: false,
    },
    run: ({ track }) => {
      // An unknown track falls back to full-stack, the one the site leads with.
      const key = typeof track === "string" && track in tracks ? (track as keyof typeof tracks) : "fullstack";
      return { content: readContent("resume", `${key}.md`), summary: `${tracks[key]} resume` };
    },
  },
  {
    name: "get_projects",
    description:
      "Anton's projects. Without a slug, lists every project with its slug, summary and tags. " +
      "With a slug from that list, returns the project's full write-up.",
    parameters: {
      type: "object",
      properties: { slug: { type: "string", description: "A project slug, for the full write-up." } },
      additionalProperties: false,
    },
    run: ({ slug }) => {
      const all = getProjects();
      if (typeof slug === "string" && slug) {
        const p = all.find((x) => x.slug === slug);
        if (!p) return { content: `There's no project with the slug "${slug}".`, summary: `${slug} not found` };
        return { content: `# ${p.title}\n${p.summary}\nTags: ${p.tags.join(", ")}\n\n${p.text}`, summary: p.title };
      }
      return {
        content: all.map((p) => `- ${p.slug}: ${p.title} (${p.date.slice(0, 4)}). ${p.summary} Tags: ${p.tags.join(", ")}`).join("\n"),
        summary: `${all.length} projects`,
      };
    },
  },
  {
    name: "get_gear",
    description: "Anton's desk setup (laptop, monitors, keyboard, mouse) and the software he uses daily.",
    parameters: noArgs,
    run: () => {
      const total = gear.groups.reduce((n, g) => n + g.items.length, 0);
      return {
        content: gear.groups.map((g) => `${g.title}:\n${g.items.map((i) => `- ${i.name}: ${i.note}`).join("\n")}`).join("\n\n"),
        summary: `${total} items`,
      };
    },
  },
  {
    name: "get_status",
    description: "Whether Anton is open to work, when he can start, and where he's based.",
    parameters: noArgs,
    run: () => {
      const { open, start } = site.availability;
      return {
        content: [open ? "Open to work." : "Not looking right now.", start, `Location: ${site.location}`].filter(Boolean).join("\n"),
        summary: open ? "open to work" : "not looking",
      };
    },
  },
];

/** The tool list in the shape OpenAI-compatible chat APIs expect. */
export const toolSpecs = tools.map(({ name, description, parameters }) => ({
  type: "function" as const,
  function: { name, description, parameters },
}));

/** Runs a tool the model asked for. `rawArgs` is the JSON string the model wrote. */
export function runTool(name: string, rawArgs: string): ToolResult {
  const tool = tools.find((t) => t.name === name);
  if (!tool) return { content: `There's no tool called ${name}.`, summary: "unknown tool" };
  let args: Record<string, unknown> = {};
  try {
    args = rawArgs ? JSON.parse(rawArgs) : {};
  } catch {
    // Bad JSON from the model: run with no arguments rather than failing the whole answer.
  }
  return tool.run(args);
}
