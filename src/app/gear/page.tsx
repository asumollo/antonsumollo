import type { Metadata } from "next";
import { gear } from "@/gear.config";
import { GearGrid } from "@/components/gear-section";
import { SubPage } from "@/components/sub-page";

export const metadata: Metadata = {
  title: "Gear",
  description: gear.intro,
};

export default function GearPage() {
  return (
    <SubPage title="Gear" intro={gear.intro}>
      <div className="flex flex-col gap-10">
        {gear.groups.map((group) => (
          <section key={group.title} aria-labelledby={`gear-${group.title}`}>
            <h2
              id={`gear-${group.title}`}
              className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
            >
              {group.title}
            </h2>
            <GearGrid items={group.items} />
          </section>
        ))}
      </div>
    </SubPage>
  );
}
