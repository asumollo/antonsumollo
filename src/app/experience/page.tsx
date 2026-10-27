import type { Metadata } from "next";
import { site } from "@/site.config";
import { ExperienceTimeline } from "@/components/experience";
import { SubPage } from "@/components/sub-page";

export const metadata: Metadata = {
  title: "Experience",
  description: `Work history of ${site.name}.`,
};

export default function ExperiencePage() {
  return (
    <SubPage title="Experience">
      <ExperienceTimeline />
    </SubPage>
  );
}
