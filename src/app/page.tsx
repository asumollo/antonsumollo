import { site } from "@/site.config";
import { getDeck, getProjectIndex } from "@/lib/projects";
import { Hero } from "@/components/hero";
import { AllToolsButton, ToolMarquee } from "@/components/tools";
import { GitHubActivity } from "@/components/github-activity";
import { ProjectDeck } from "@/components/project-card";
import { Experience } from "@/components/experience";
import { GearSection } from "@/components/gear-section";
import { Contact, Footer } from "@/components/contact";
import { Section, SectionLink } from "@/components/section";
import { Dock } from "@/components/dock";

export default function Home() {
  const deck = getDeck(site.homeProjectLimit);

  return (
    <>
      <div className="graph-paper" aria-hidden />
      <main
        id="top"
        className="relative mx-auto flex max-w-[720px] flex-col gap-16 px-5 pb-16 pt-14 sm:px-6 sm:pt-20"
      >
        <Hero />

        <Section id="stack" title="Stack" aside={<AllToolsButton />}>
          <ToolMarquee />
        </Section>

        {site.github.show && <GitHubActivity />}

        <Section id="projects" title="Projects" aside={<SectionLink href="/projects">All projects</SectionLink>}>
          {deck.length > 0 ? (
            <ProjectDeck projects={deck} />
          ) : (
            <p className="rounded-[18px] border border-dashed border-line p-6 text-muted">
              Add a markdown file to content/projects and it shows up here.
            </p>
          )}
        </Section>

        <Experience />
        <GearSection />
        <Contact />
      </main>
      <Footer />
      <Dock projects={getProjectIndex()} />
    </>
  );
}
