import { cacheLife } from "next/cache";
import snapshot from "@/data/github-snapshot.json";

export type Day = { date: string; count: number; level: number };

export type Activity = {
  total: number;
  days: Day[];
  activeDays: number;
  longestStreak: number;
  bestDay: Day | null;
};

type ApiResponse = { total: Record<string, number>; contributions: Day[] };

/**
 * Last 12 months of contributions for a GitHub user.
 * Refreshes once a day. Falls back to the saved snapshot if the request fails.
 */
export async function getActivity(username: string): Promise<Activity> {
  "use cache";
  cacheLife("days");

  let data: ApiResponse = snapshot as ApiResponse;
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (res.ok) {
      const json = (await res.json()) as ApiResponse;
      if (Array.isArray(json.contributions) && json.contributions.length) data = json;
    }
  } catch {
    // keep the snapshot
  }

  return summarize(data);
}

function summarize(data: ApiResponse): Activity {
  const days = data.contributions;
  let longest = 0;
  let run = 0;
  let active = 0;
  let best: Day | null = null;

  for (const d of days) {
    if (d.count > 0) {
      active++;
      run++;
      longest = Math.max(longest, run);
      if (!best || d.count > best.count) best = d;
    } else {
      run = 0;
    }
  }

  const total =
    data.total?.lastYear ?? days.reduce((sum, d) => sum + d.count, 0);

  return { total, days, activeDays: active, longestStreak: longest, bestDay: best };
}
