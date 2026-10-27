import fs from "node:fs";
import path from "node:path";
import { Marquee } from "./marquee";
import { Modal } from "./modal";
import {
  siCelery,
  siCloudflare,
  siDigitalocean,
  siDjango,
  siDocker,
  siFastapi,
  siGit,
  siGooglebigquery,
  siGooglecloud,
  siJavascript,
  siN8n,
  siNewrelic,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siRedis,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVitest,
} from "simple-icons";
import { site, type Tool, type ToolGroup } from "@/site.config";

type SimpleIcon = { path: string; hex: string };

// Add more from https://simpleicons.org: import siSomething above, then map it here.
// Logos Simple Icons doesn't carry (AWS, Heroku, Playwright) live as SVG files in src/icons.
const SIMPLE: Record<string, SimpleIcon> = {
  celery: siCelery,
  cloudflare: siCloudflare,
  digitalocean: siDigitalocean,
  django: siDjango,
  docker: siDocker,
  fastapi: siFastapi,
  git: siGit,
  googlebigquery: siGooglebigquery,
  googlecloud: siGooglecloud,
  javascript: siJavascript,
  n8n: siN8n,
  newrelic: siNewrelic,
  nextdotjs: siNextdotjs,
  nodedotjs: siNodedotjs,
  postgresql: siPostgresql,
  python: siPython,
  react: siReact,
  redis: siRedis,
  supabase: siSupabase,
  tailwindcss: siTailwindcss,
  typescript: siTypescript,
  vitest: siVitest,
};

// Brand colors too dark for the dark theme get the text color instead.
const DARK_FILLS = ["#000000", "#092E20", "#181717", "#252f3e", "#2D4552"];

function fileIcon(name: string): string | null {
  const file = path.join(process.cwd(), "src", "icons", `${name}.svg`);
  if (!fs.existsSync(file)) return null;
  let svg = fs.readFileSync(file, "utf8");
  for (const c of DARK_FILLS) svg = svg.replaceAll(`fill="${c}"`, 'fill="currentColor"');
  return svg.replace("<svg", '<svg width="100%" height="100%" aria-hidden="true"');
}

export function ToolIcon({ tool, size = 20 }: { tool: Tool; size?: number }) {
  const simple = tool.icon ? SIMPLE[tool.icon] : undefined;
  if (simple) {
    const dark = DARK_FILLS.some((c) => c.slice(1).toUpperCase() === simple.hex.toUpperCase());
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        aria-hidden
        style={{ fill: dark ? "var(--ink)" : `#${simple.hex}` }}
      >
        <path d={simple.path} />
      </svg>
    );
  }
  const svg = tool.icon ? fileIcon(tool.icon) : null;
  if (svg) {
    return (
      <span
        aria-hidden
        className="inline-block shrink-0 text-ink"
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full bg-paper text-[10px] font-bold text-muted"
      style={{ width: size, height: size }}
    >
      {tool.name.slice(0, 2).toUpperCase()}
    </span>
  );
}

/** The configured tool with this name, so project tags get the same logos. Unknown names fall back to initials. */
export function toolByName(name: string): Tool {
  const all = site.toolGroups.flatMap((g) => g.tools as Tool[]);
  return all.find((t) => t.name.toLowerCase() === name.toLowerCase()) ?? { name };
}

/** Logo only. The name shows on hover, or on tap/focus where there's no hover. */
export function ToolTile({ tool }: { tool: Tool }) {
  return (
    <li
      tabIndex={0}
      aria-label={tool.name}
      className="group/tile relative grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface outline-none transition-colors hover:border-ink/30 focus-visible:border-accent"
    >
      <ToolIcon tool={tool} size={22} />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[12px] font-medium text-paper opacity-0 transition-opacity group-hover/tile:opacity-100 group-focus/tile:opacity-100"
      >
        {tool.name}
      </span>
    </li>
  );
}

/** Every tool, grouped by purpose. Used inside the "See all" popup. */
export function ToolGroups() {
  const groups: ToolGroup[] = site.toolGroups;
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-2.5">
          <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{group.title}</h3>
          <ul className="flex flex-wrap gap-2">
            {group.tools.map((tool) => (
              <ToolTile key={tool.name} tool={tool} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Every tool on the home page, in two rows drifting opposite ways. Groups are split between the rows in order. */
export function ToolMarquee() {
  const groups: ToolGroup[] = site.toolGroups;
  const half = Math.ceil(groups.length / 2);
  const rows = [groups.slice(0, half), groups.slice(half)].map((gs) => gs.flatMap((g) => g.tools as Tool[]));

  return (
    <div className="flex flex-col gap-2">
      {rows.map((tools, i) => (
        <Marquee key={i} reverse={i === 1}>
          {tools.map((tool) => (
            <li
              key={tool.name}
              role="img"
              aria-label={tool.name}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-surface"
            >
              <ToolIcon tool={tool} size={22} />
            </li>
          ))}
        </Marquee>
      ))}
    </div>
  );
}

/** Opens every tool, grouped and named. Styled like the "All projects" and "All gear" links. */
export function AllToolsButton() {
  return (
    <Modal
      label="All tools"
      trigger={
        <>
          All tools <span aria-hidden>→</span>
        </>
      }
      triggerClassName="inline-flex items-center gap-1.5 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-muted transition-colors hover:text-accent"
    >
      <div className="p-5">
        <ToolGroups />
      </div>
    </Modal>
  );
}
