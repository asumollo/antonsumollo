import type { Metadata } from "next";
import { getProjects } from "@/lib/projects";
import { SubPage } from "@/components/sub-page";
import { ProjectCard } from "@/components/project-card";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects by Anton Mark Sumollo.",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <SubPage title="Projects">
      {projects.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      ) : (
        <p className="rounded-[18px] border border-dashed border-line p-6 text-muted">
          Add a markdown file to content/projects and it shows up here.
        </p>
      )}
    </SubPage>
  );
}
