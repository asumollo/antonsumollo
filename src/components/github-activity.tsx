import { getActivity, type Day } from "@/lib/github";
import { site } from "@/site.config";
import { Section, SectionLink } from "./section";

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 28; // room for weekday labels
const TOP = 18; // room for month labels
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const fmt = (n: number) => n.toLocaleString("en-US");

function niceDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** Group days into week columns starting on Sunday, padding the first week. */
function toWeeks(days: Day[]) {
  if (!days.length) return [];
  const first = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const padded: (Day | null)[] = [...Array(first).fill(null), ...days];
  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
  return weeks;
}

/** The last year of GitHub contributions as a graph, plus the yearly total. */
export async function GitHubActivity() {
  const { username } = site.github;
  const activity = await getActivity(username);
  const weeks = toWeeks(activity.days);
  const width = LEFT + weeks.length * STEP;
  const height = TOP + 7 * STEP;

  // A month label sits on the first week column where that month begins.
  const monthLabels: { x: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, w) => {
    const firstDay = week.find((d) => d);
    if (!firstDay) return;
    const month = Number(firstDay.date.slice(5, 7)) - 1;
    if (month !== lastMonth) {
      // skip a label squeezed into the very first partial column
      if (w > 0 || Number(firstDay.date.slice(8, 10)) <= 7) {
        monthLabels.push({ x: LEFT + w * STEP, label: MONTHS[month] });
      }
      lastMonth = month;
    }
  });

  return (
    <Section
      id="github"
      title="GitHub"
      aside={<SectionLink href={`https://github.com/${username}`}>@{username}</SectionLink>}
    >
      <figure className="rounded-[16px] border border-line bg-surface p-4">
        {/* rtl keeps the newest weeks in view when the graph scrolls on small screens */}
        <div className="overflow-x-auto [direction:rtl]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="block h-auto w-full min-w-[560px] [direction:ltr]"
            role="img"
            aria-label={`${fmt(activity.total)} contributions in the last year`}
          >
            {monthLabels.map((m) => (
              <text key={`${m.label}-${m.x}`} x={m.x} y={10} fontSize="10" fill="var(--muted)">
                {m.label}
              </text>
            ))}
            {[
              ["Mon", 1],
              ["Wed", 3],
              ["Fri", 5],
            ].map(([label, row]) => (
              <text key={label} x={0} y={TOP + Number(row) * STEP + 9} fontSize="10" fill="var(--muted)">
                {label}
              </text>
            ))}
            {weeks.map((week, w) =>
              week.map((day, d) =>
                day ? (
                  <rect
                    key={day.date}
                    x={LEFT + w * STEP}
                    y={TOP + d * STEP}
                    width={CELL}
                    height={CELL}
                    rx={2.5}
                    className={`gh-${Math.min(4, Math.max(0, day.level))}`}
                  >
                    <title>{`${day.count} contribution${day.count === 1 ? "" : "s"} on ${niceDate(day.date)}`}</title>
                  </rect>
                ) : null,
              ),
            )}
          </svg>
        </div>
        <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[12px] text-muted">
          <span className="uppercase tracking-[0.08em]">{fmt(activity.total)} contributions in the last year</span>
          <span className="inline-flex items-center gap-1.5">
            Less
            {[0, 1, 2, 3, 4].map((l) => (
              <svg key={l} width="11" height="11" aria-hidden>
                <rect width="11" height="11" rx="2.5" className={`gh-${l}`} />
              </svg>
            ))}
            More
          </span>
        </figcaption>
      </figure>
    </Section>
  );
}
