import { yearOf, type Project, type ProjectWithBody, type Step } from "@/lib/projects";
import { site } from "@/site.config";
import { Architecture } from "./architecture";
import { CheckIcon, ExternalIcon, GitHubIcon, MailIcon } from "./icons";
import { Modal } from "./modal";
import { ToolIcon, toolByName } from "./tools";

export function Cover({
  project,
  className = "",
  compact = false,
}: {
  project: Project;
  className?: string;
  /** Smaller placeholder title, for half-width cards and popups. */
  compact?: boolean;
}) {
  if (project.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={project.cover} alt="" className={`h-full w-full object-cover ${className}`} />
    );
  }
  // No image yet: an accent-tinted tile with the project name, so it stands apart from the page's graph paper.
  return (
    <div aria-hidden className={`cover-placeholder relative h-full w-full overflow-hidden ${className}`}>
      <span
        className={`cover-placeholder-title absolute bottom-4 left-5 right-5 line-clamp-2 font-extrabold leading-[1.05] tracking-[-0.03em] ${
          compact ? "text-[30px]" : "text-[40px] sm:text-[52px]"
        }`}
      >
        {project.title}
      </span>
    </div>
  );
}

/** A pre-addressed email asking for access to a project's code. */
export function requestCodeHref(project: Project): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(`Code request: ${project.title}`)}`;
}

/** Live preview if there is one, then "Code" for a public repo or "Request code" for a private one. */
export function ProjectLinks({ project, compact = false }: { project: Project; compact?: boolean }) {
  const btn = `inline-flex items-center gap-1.5 rounded-[9px] font-semibold ${
    compact ? "h-8 px-3 text-[13px]" : "h-10 px-4 text-[14px]"
  }`;
  return (
    <div className="flex flex-wrap gap-2">
      {project.live && (
        <a href={project.live} target="_blank" rel="noreferrer" className={`${btn} bg-ink text-paper hover:opacity-90`}>
          <ExternalIcon className="h-4 w-4" />
          Live preview
        </a>
      )}
      {project.repo === "private" ? null : project.repo ? (
        <a
          href={project.repo}
          target="_blank"
          rel="noreferrer"
          className={`${btn} border border-line bg-surface text-ink hover:border-ink`}
        >
          <GitHubIcon className="h-4 w-4" />
          Code
        </a>
      ) : (
        <a href={requestCodeHref(project)} className={`${btn} border border-line bg-surface text-ink hover:border-ink`}>
          <MailIcon className="h-4 w-4" />
          Request code
        </a>
      )}
    </div>
  );
}

/** Compact card for the project grids. Clicking anywhere on it opens the full project in a popup. */
export function ProjectCard({ project }: { project: ProjectWithBody }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[18px] border border-line bg-surface transition-colors hover:border-accent">
      <div className="relative aspect-[16/10] border-b border-line">
        <Cover project={project} compact className="transition-transform duration-500 group-hover:scale-[1.02]" />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="text-[17px] font-bold leading-snug transition-colors group-hover:text-accent">{project.title}</h3>
        {project.summary && <p className="line-clamp-3 text-[14px] leading-relaxed text-muted">{project.summary}</p>}
        {project.tags.length > 0 && <Tags tags={project.tags} className="mt-auto pt-1" />}
      </div>

      {/* Covers the whole card so any click opens the popup. */}
      <Modal
        label={project.title}
        triggerLabel={`${project.title}, open details`}
        triggerClassName="absolute inset-0 rounded-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <ProjectDetails project={project} />
      </Modal>
    </article>
  );
}

/**
 * The home page's projects as a hand of cards: overlapped and tilted at rest, fanned out on hover.
 * Expects the order from `getDeck`, with the featured project at the middle index.
 */
export function ProjectDeck({ projects }: { projects: ProjectWithBody[] }) {
  const center = Math.floor((projects.length - 1) / 2);

  return (
    <ul className="project-deck" aria-label="Featured projects">
      {projects.map((p, i) => (
        <li
          key={p.slug}
          className="project-deck-card"
          // --o: offset from the middle (-1, 0, 1); --z: the middle card sits on top.
          style={{ "--o": i - (projects.length - 1) / 2, "--z": projects.length - Math.abs(i - center) } as React.CSSProperties}
        >
          <ProjectCard project={p} />
        </li>
      ))}
    </ul>
  );
}

function ProjectDetails({ project }: { project: ProjectWithBody }) {
  if (project.popup === "terminal") return <TerminalDetails project={project} />;

  return (
    <>
      {project.cover && (
        <div className="aspect-[16/9] border-b border-line bg-paper">
          <Cover project={project} />
        </div>
      )}

      <div className="flex flex-col gap-6 p-5 sm:p-7">
        <div>
          {/* Without a cover the close button sits beside the title, so leave room for it. */}
          <div className={`flex items-baseline gap-3 ${project.cover ? "" : "pr-10"}`}>
            <h2 className="text-[28px] font-black leading-[1.1] tracking-[-0.03em]">{project.title}</h2>
            {project.date && <span className="font-mono text-[13px] text-muted">{yearOf(project.date)}</span>}
          </div>
          {project.summary && <p className="mt-2 text-[15px] leading-relaxed text-muted">{project.summary}</p>}
        </div>

        {project.system.length > 0 || project.sequence.length > 0 ? (
          <Architecture system={project.system} sequence={project.sequence} decisions={project.decisions} />
        ) : (
          project.architecture.length > 0 && <Flow steps={project.architecture} />
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
          {project.tags.length > 0 && <StackIcons tags={project.tags} />}
          <div className="ml-auto">
            <ProjectLinks project={project} compact />
          </div>
        </div>
      </div>
    </>
  );
}

/** Logos only, with the tool name as a tooltip, so the stack takes one short row. */
function StackIcons({ tags, className = "" }: { tags: string[]; className?: string }) {
  return (
    <ul className={`flex gap-1.5 ${className}`} aria-label="Built with">
      {tags.map((t) => (
        <li key={t} title={t} className="grid h-7 w-7 place-items-center rounded-[7px] border border-line bg-surface">
          <ToolIcon tool={toolByName(t)} size={16} />
          <span className="sr-only">{t}</span>
        </li>
      ))}
    </ul>
  );
}

/** "How it works": numbered stages joined by a line, the last one marked done. */
function Flow({ steps }: { steps: Step[] }) {
  return (
    <section>
      <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">How it works</h3>
      <ol className="mt-3">
        {steps.map((step, i) => {
          const last = i === steps.length - 1;
          return (
            <li key={step.name} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-[9px] border font-mono text-[12px] font-medium ${
                    last ? "border-ink bg-ink text-paper" : "border-line bg-paper text-muted"
                  }`}
                >
                  {last ? <CheckIcon className="h-4 w-4" /> : i + 1}
                </span>
                {!last && <span aria-hidden className="min-h-3 w-px flex-1 bg-line" />}
              </div>
              <div className={`pt-1 ${last ? "" : "pb-4"}`}>
                <p className="text-[15px] font-semibold leading-snug">{step.name}</p>
                {step.note && <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{step.note}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** The opt-in terminal look (`popup: terminal`). Always dark, whatever the site theme. */
function TerminalDetails({ project }: { project: ProjectWithBody }) {
  const link = "text-[#9db3ff] hover:text-[#c3d1ff]";

  return (
    // Overriding --ink keeps dark logos (Next.js, GitHub) visible on the dark background.
    <div className="bg-[#16181d] font-mono text-[13px] text-[#e8eaee] [--ink:#e8eaee] sm:text-[14px]">
      <div className="flex h-12 items-center gap-2 border-b border-[#2a2e36] bg-[#1b1e24] pl-4 pr-14">
        <span aria-hidden className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span aria-hidden className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span aria-hidden className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate text-[12px] text-[#8b93a1]">~/projects/{project.slug}</span>
      </div>

      <div className="flex flex-col gap-5 p-5 sm:p-7">
        <Command cmd="cat README.md">
          <div className="border-l-2 border-[#2a2e36] pl-4">
            <div className="flex items-baseline gap-3">
              <h2 className="font-sans text-[24px] font-black tracking-[-0.03em]">{project.title}</h2>
              {project.date && <span className="text-[12px] text-[#6b7280]">{yearOf(project.date)}</span>}
            </div>
            {project.summary && <p className="mt-1.5 text-[13px] leading-relaxed text-[#9aa2ae]">{project.summary}</p>}
          </div>
        </Command>

        {project.tags.length > 0 && (
          <Command cmd="ls stack/">
            <ul className="flex flex-wrap gap-2" aria-label="Built with">
              {project.tags.map((t) => (
                <li key={t} className="inline-flex items-center gap-2 rounded-[10px] border border-[#2a2e36] bg-[#1b1e24] px-3 py-1.5">
                  <ToolIcon tool={toolByName(t)} size={16} />
                  {t.toLowerCase()}
                </li>
              ))}
            </ul>
          </Command>
        )}

        {project.architecture.length > 0 && (
          <Command cmd="./pipeline --dry-run">
            <ol className="flex flex-col gap-1.5 text-[13px] text-[#c4cad4]">
              {project.architecture.map((step) => (
                <li key={step.name}>
                  <span className="text-[#45c085]">✓</span> {step.name.toLowerCase()}
                  {step.note && <span className="text-[#6b7280]"> → {step.note.toLowerCase()}</span>}
                </li>
              ))}
            </ol>
          </Command>
        )}

        <p aria-hidden>
          <span className="text-[#7d9bff]">❯</span> <span className="inline-block animate-[blink_1s_steps(1)_infinite] h-[1.1em] w-[0.55em] translate-y-[3px] bg-[#e8eaee]" />
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#2a2e36] pt-4 text-[13px]">
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" className={link}>
              open live ↗
            </a>
          )}
          {project.repo === "private" ? null : project.repo ? (
            <a href={project.repo} target="_blank" rel="noreferrer" className={link}>
              open code ↗
            </a>
          ) : (
            <a href={requestCodeHref(project)} className={link}>
              request code ✉
            </a>
          )}
          <span className="ml-auto hidden text-[12px] text-[#6b7280] sm:inline">esc to close</span>
        </div>
      </div>
    </div>
  );
}

function Command({ cmd, children }: { cmd: string; children: React.ReactNode }) {
  return (
    <div>
      <p>
        <span aria-hidden className="text-[#7d9bff]">❯</span> {cmd}
      </p>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function Tags({ tags, className = "" }: { tags: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Built with">
      {tags.map((t) => (
        <li key={t} className="rounded-[7px] border border-line bg-paper px-2 py-0.5 font-mono text-[11px] text-muted">
          {t}
        </li>
      ))}
    </ul>
  );
}
