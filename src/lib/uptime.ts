import { cacheLife } from "next/cache";

/** Whole years since `start` ("YYYY-MM"). Recomputed daily so it ticks over on its own. */
export async function yearsSince(start: string): Promise<number> {
  "use cache";
  cacheLife("days");

  const [year, month] = start.split("-").map(Number);
  const now = new Date();
  let years = now.getUTCFullYear() - year;
  if (now.getUTCMonth() + 1 < month) years -= 1;
  return Math.max(0, years);
}

export function monthYear(start: string): string {
  const [year, month] = start.split("-").map(Number);
  const names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${names[month - 1]} ${year}`;
}
