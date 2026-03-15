export type Streaks = { current: number; longest: number };

export function computeStreaks(dates: string[]): Streaks {
  const uniq = Array.from(new Set(dates)).sort();
  if (uniq.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;

  for (let i = 1; i < uniq.length; i++) {
    const prev = new Date(`${uniq[i - 1]}T00:00:00.000Z`);
    const curr = new Date(`${uniq[i]}T00:00:00.000Z`);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);

    if (diffDays === 1) run += 1;
    else run = 1;

    if (run > longest) longest = run;
  }

  let current = 1;
  for (let i = uniq.length - 1; i > 0; i--) {
    const a = new Date(`${uniq[i]}T00:00:00.000Z`);
    const b = new Date(`${uniq[i - 1]}T00:00:00.000Z`);
    const diffDays = Math.round((a.getTime() - b.getTime()) / 86400000);
    if (diffDays === 1) current += 1;
    else break;
  }

  return { current, longest };
}