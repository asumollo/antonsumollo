import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjectIndex, getProjects, yearOf } from "@/lib/projects";
import { Cover, ProjectLinks } from "@/components/project-card";
import { BackIcon } from "@/components/icons";
import { Footer } from "@/components/contact";
import { Dock } from "@/components/dock";

const EMPTY = "__none__";

export function generateStaticParams() {
  const projects = getProjects();
  // At least one param is required at build time; an empty folder renders a 404.
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: EMPTY }];
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = slug === EMPTY ? undefined : getProject(slug);
  if (!project) notFound();

  return (
    <>
      <main className="mx-auto flex max-w-[720px] flex-col px-5 pb-16 pt-10 sm:px-6 sm:pt-14">
        <Link
          href="/projects"
          className="inline-flex w-fit items-center gap-2 text-[14px] font-semibold text-muted hover:text-ink"
        >
          <BackIcon className="h-4 w-4" />
          All projects
        </Link>

        <div className="mt-6 aspect-[16/7] overflow-hidden rounded-[18px] border border-line">
          <Cover project={project} />
        </div>

        <div className="mt-7 flex items-baseline gap-3">
          <h1 className="text-[32px] font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-[40px]">{project.title}</h1>
          {project.date && <span className="font-mono text-[14px] text-muted">{yearOf(project.date)}</span>}
        </div>
        {project.summary && <p className="mt-3 text-[19px] leading-relaxed text-muted">{project.summary}</p>}

        {project.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Built with">
            {project.tags.map((t) => (
              <li key={t} className="rounded-[7px] border border-line bg-surface px-2 py-0.5 font-mono text-[12px] text-muted">
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          <ProjectLinks project={project} />
        </div>

        <hr className="my-10 border-line" />

        <article className="prose max-w-[66ch]" dangerouslySetInnerHTML={{ __html: project.html }} />
      </main>
      <Footer />
      <Dock projects={getProjectIndex()} />
    </>
  );
}
