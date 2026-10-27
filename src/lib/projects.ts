import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/** One stage of the "How it works" flow: a short name and an optional one-line note. */
export type Step = { name: string; note?: string };

/** One arrow in the sequence diagram: who calls whom, and what for. */
export type Message = { from: string; to: string; label: string };

export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  date: string;
  cover?: string;
  live?: string;
  /** A public repo URL shows "Code"; "private" (code owned by an employer) shows no code button; left out shows "Request code". */
  repo?: string;
  /** How the pieces connect, in order. Drawn as a flow in the project popup. */
  architecture: Step[];
  /** The system diagram, left to right. Each column holds one or more components; every component points to the next column. */
  system: Step[][];
  /** The sequence diagram: messages in order, as "From -> To: what". */
  sequence: Message[];
  /** One-line design decisions shown under the diagrams. */
  decisions: string[];
  /** "terminal" opts this project into the terminal-window popup. */
  popup: "default" | "terminal";
  /** Puts this project in the middle of the home page deck. */
  featured: boolean;
  /** Shows this project on the home page. With none marked, the newest ones show. */
  home: boolean;
};

export type ProjectWithBody = Project & { html: string; text: string };

const DIR = path.join(process.cwd(), "content", "projects");

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value;
  return "";
}

function list(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

// Either "Name" or "Name: note". Unquoted, YAML reads the second as a one-key map; quoted, it stays a string.
function step(item: unknown): Step {
  if (item && typeof item === "object") {
    const [name, note] = Object.entries(item)[0] ?? ["", ""];
    return { name, note: note ? String(note) : undefined };
  }
  const [name, ...note] = String(item).split(": ");
  return { name, note: note.length ? note.join(": ") : undefined };
}

function steps(value: unknown): Step[] {
  if (!Array.isArray(value)) return [];
  return value.map(step);
}

// A column is one component ("Name: note") or a list of them, stacked.
function columns(value: unknown): Step[][] {
  if (!Array.isArray(value)) return [];
  return value.map((col) => (Array.isArray(col) ? col.map(step) : [step(col)]));
}

// Each item is "From -> To: label", which YAML reads as a one-key map.
function messages(value: unknown): Message[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const { name, note } = step(item);
    const [from, to] = name.split("->").map((s) => s.trim());
    return from && to ? [{ from, to, label: note ?? "" }] : [];
  });
}

function read(file: string): ProjectWithBody {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    tags: list(data.tags),
    date: toDateString(data.date),
    cover: data.cover ? String(data.cover) : undefined,
    live: data.live ? String(data.live) : undefined,
    repo: data.repo ? String(data.repo) : undefined,
    architecture: steps(data.architecture),
    system: columns(data.system),
    sequence: messages(data.sequence),
    decisions: list(data.decisions),
    popup: data.popup === "terminal" ? "terminal" : "default",
    featured: data.featured === true,
    home: data.home === true || data.featured === true,
    html: marked.parse(content, { async: false }) as string,
    text: content.trim(),
  };
}

function files(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
}

/** All projects, newest first. Files starting with "_" are treated as drafts and skipped. */
export function getProjects(): ProjectWithBody[] {
  return files()
    .map(read)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * The home page deck: up to `limit` projects, ordered left to right, with the featured one
 * (or the newest, if none is flagged) in the middle at index `floor((length - 1) / 2)`.
 */
export function getDeck(limit: number): ProjectWithBody[] {
  const projects = getProjects();
  const all = projects.some((p) => p.home) ? projects.filter((p) => p.home) : projects;
  const center = all.find((p) => p.featured) ?? all[0];
  if (!center) return [];
  const rest = all.filter((p) => p !== center).slice(0, limit - 1);
  const mid = Math.floor(rest.length / 2);
  return [...rest.slice(0, mid), center, ...rest.slice(mid)];
}

/** Just enough of each project for the Ask terminal's /projects command, so the page HTML stays out of the client bundle. */
export type ProjectSummary = Pick<Project, "slug" | "title" | "summary" | "date">;

export function getProjectIndex(): ProjectSummary[] {
  return getProjects().map(({ slug, title, summary, date }) => ({ slug, title, summary, date }));
}

export function getProject(slug: string): ProjectWithBody | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function yearOf(date: string): string {
  return date.slice(0, 4);
}
