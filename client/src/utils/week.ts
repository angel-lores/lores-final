function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function isoWeekYearAndNumber(date: Date): { year: number; week: number } {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day + 3);
  const year = d.getFullYear();

  const firstThu = new Date(year, 0, 4);
  const firstDay = (firstThu.getDay() + 6) % 7;
  firstThu.setDate(firstThu.getDate() - firstDay + 3);

  const diffDays = Math.round((d.getTime() - firstThu.getTime()) / 86400000);
  const week = 1 + Math.floor(diffDays / 7);

  return { year, week };
}

export function yearWeekString(date: Date): string {
  const { year, week } = isoWeekYearAndNumber(date);
  return `${year}-${pad2(week)}`;
}

export function parseYearWeek(s: string): { year: number; week: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(s);
  if (!m) return null;
  const year = Number(m[1]);
  const week = Number(m[2]);
  if (!Number.isInteger(year) || !Number.isInteger(week) || week < 1 || week > 53) {
    return null;
  }
  return { year, week };
}

export function isoWeekStartDate(year: number, week: number): Date {
  const jan4 = new Date(year, 0, 4);
  const day = (jan4.getDay() + 6) % 7;
  const week1Mon = new Date(year, 0, 4 - day);
  const d = new Date(week1Mon);
  d.setDate(d.getDate() + (week - 1) * 7);
  return d;
}

export function addWeeks(weekStr: string, delta: number): string {
  const parsed = parseYearWeek(weekStr);
  if (!parsed) return weekStr;
  const start = isoWeekStartDate(parsed.year, parsed.week);
  start.setDate(start.getDate() + delta * 7);
  return yearWeekString(start);
}