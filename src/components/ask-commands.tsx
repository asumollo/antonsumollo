import Link from "next/link";
import { site } from "@/site.config";
import { gear } from "@/gear.config";
// Type-only: lib/projects reads files with node:fs, which can't ship to the browser.
import type { ProjectSummary } from "@/lib/projects";
import { openContact } from "./contact-popup";

/** What a command can reach besides the config files. */
export type CommandContext = {
  projects: ProjectSummary[];
  clear: () => void;
};

export type Command = {
  name: string;
  /** Other names that run the same command, so a guess like /tools still works. */
  aliases?: string[];
  summary: string;
  /** Returns what to print in the log, or nothing for commands that only act (like /clear). */
  run: (ctx: CommandContext) => React.ReactNode | void;
};

const muted = "text-[#6b7280]";
const link = "text-[#9db3ff] hover:text-[#c3d1ff] hover:underline underline-offset-[3px]";

/** A two-column list: a muted label on the left, the value on the right. Stacks on phones. */
function Rows({ rows }: { rows: [React.ReactNode, React.ReactNode][] }) {
  return (
    <dl className="grid gap-x-4 gap-y-1.5 sm:grid-cols-[max-content_1fr]">
      {rows.map(([label, value], i) => (
        <div key={i} className="contents">
          <dt className={`${muted} max-sm:mt-1.5 max-sm:first:mt-0`}>{label}</dt>
          <dd className="text-[#c4cad4]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export const commands: Command[] = [
  {
    name: "help",
    summary: "list the commands",
    run: () => <Help />,
  },
  {
    name: "skills",
    aliases: ["tools", "stack"],
    summary: "languages, frameworks and tools",
    run: () => (
      <Rows rows={site.toolGroups.map((g) => [g.title.toLowerCase(), g.tools.map((t) => t.name).join(", ")])} />
    ),
  },
  {
    name: "experience",
    summary: "where I've worked",
    run: () => (
      <Rows
        rows={site.experience.map((j) => [
          `${j.start.slice(-4)}–${j.end.slice(-4)}`,
          <>
            {j.role}
            {j.company && <span className={muted}> · {j.company}</span>}
          </>,
        ])}
      />
    ),
  },
  {
    name: "projects",
    summary: "things I've built",
    run: ({ projects }) =>
      projects.length ? (
        <ul className="flex flex-col gap-2">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`} className={link}>
                {p.title}
              </Link>
              {p.date && <span className={muted}> {p.date.slice(0, 4)}</span>}
              {p.summary && <p className="text-[#c4cad4]">{p.summary}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className={muted}>No projects yet.</p>
      ),
  },
  {
    name: "gear",
    summary: "my desk setup and software",
    run: () => <Rows rows={gear.groups.map((g) => [g.title.toLowerCase(), g.items.map((i) => i.name).join(", ")])} />,
  },
  {
    name: "status",
    summary: "availability and location",
    run: () => (
      <Rows
        rows={[
          [
            "status",
            site.availability.open ? (
              <span className="text-[#45c085]">● open to work</span>
            ) : (
              "not looking right now"
            ),
          ],
          ...(site.availability.start ? [["start", site.availability.start] as [string, string]] : []),
          ["location", site.location],
        ]}
      />
    ),
  },
  {
    name: "contact",
    aliases: ["email"],
    summary: "message me",
    run: () => {
      openContact();
      return (
      <Rows
        rows={[
          ["email", <button key="e" type="button" onClick={openContact} className={link}>{site.email}</button>],
          ["github", <a key="g" href={site.links.github} target="_blank" rel="noreferrer" className={link}>{site.links.github.replace("https://", "")} ↗</a>],
          ["linkedin", <a key="l" href={site.links.linkedin} target="_blank" rel="noreferrer" className={link}>{site.links.linkedin.replace("https://www.", "")} ↗</a>],
        ]}
      />
      );
    },
  },
  {
    name: "resume",
    aliases: ["cv"],
    summary: "open my resume",
    run: () => {
      // The same popup as the hero's "View resume" button. Pages without the hero fall back to a new
      // tab, which the browser allows because this runs inside the Enter keypress.
      const popup = document.getElementById("resume");
      if (popup instanceof HTMLDialogElement) popup.showModal();
      else window.open(site.resume, "_blank", "noreferrer");
      return (
        <p>
          opening{" "}
          <a href={site.resume} target="_blank" rel="noreferrer" className={link}>
            {site.resume.split("/").pop()} ↗
          </a>
        </p>
      );
    },
  },
  {
    name: "clear",
    summary: "clear the screen",
    run: ({ clear }) => clear(),
  },
];

/** Finds a command by name or alias. Accepts "skills", "/skills" or "/Skills". */
export function findCommand(input: string): Command | undefined {
  const name = input.trim().replace(/^\//, "").split(/\s+/)[0].toLowerCase();
  return commands.find((c) => c.name === name || c.aliases?.includes(name));
}

/** Commands whose name starts with what's typed after the slash, for the autocomplete list. */
export function matchCommands(input: string): Command[] {
  if (!input.startsWith("/") || /\s/.test(input)) return [];
  const typed = input.slice(1).toLowerCase();
  return commands.filter((c) => c.name.startsWith(typed));
}

function Help() {
  return (
    <Rows
      rows={commands.map((c) => [
        <span key={c.name} className="text-[#e8eaee]">/{c.name}</span>,
        c.summary,
      ])}
    />
  );
}
