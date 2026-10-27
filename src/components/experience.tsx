import { site } from "@/site.config";
import { Section, SectionLink } from "./section";

/** How many jobs the home page lists before "Full history". */
const HOME_LIMIT = 4;

/** "Apr 2023", "Mar 2026" → "2023 – 2026". A current job ("Present") reads "2023 – now"; a single year stays as one. */
function years(start: string, end: string) {
  const from = start.slice(-4);
  const to = /present|now/i.test(end) ? "now" : end.slice(-4);
  return from === to ? from : `${from} – ${to}`;
}

/** Home-page overview: one line per job (year, role, company). The details live on /experience. */
export function Experience() {
  const jobs = site.experience.slice(0, HOME_LIMIT);

  return (
    <Section id="experience" title="Experience" aside={<SectionLink href="/experience">Full history</SectionLink>}>
      <ul className="divide-y divide-line border-y border-line">
        {jobs.map((job) => (
          <li
            key={`${job.company}-${job.role}`}
            className="grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-0.5 py-3 sm:grid-cols-[6.5rem_1fr_auto] sm:items-baseline"
          >
            <span className="font-mono text-[12px] tabular-nums text-muted">{years(job.start, job.end)}</span>
            <span className="text-[15px] font-semibold">{job.role}</span>
            {job.company && (
              <span className="col-start-2 text-[14px] text-muted sm:col-start-auto sm:text-right">{job.company}</span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Every job with dates and a summary, on a vertical timeline. Used by /experience. */
export function ExperienceTimeline() {
  return (
    <ol className="relative flex flex-col gap-7 border-l border-line pl-6">
      {site.experience.map((job, i) => (
        <li key={`${job.company}-${job.role}`} className="relative">
          <span
            aria-hidden
            className={`absolute -left-[31px] top-[7px] h-[11px] w-[11px] rounded-full border-2 border-paper ${
              i === 0 ? "bg-accent" : "bg-muted/60"
            }`}
          />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h2 className="text-[17px] font-bold">
              {job.role}
              {job.company && <span className="font-medium text-muted">, {job.company}</span>}
            </h2>
            <p className="text-[14px] tabular-nums text-muted">
              {job.start} to {job.end}
            </p>
          </div>
          <p className="mt-1.5 max-w-[62ch] text-[15px] leading-relaxed text-muted">{job.summary}</p>
        </li>
      ))}
    </ol>
  );
}
