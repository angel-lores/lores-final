import { addDays, format, startOfISOWeek, setISOWeek, setISOWeekYear } from "date-fns";

export function toISODateOnly(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function parseISODateOnly(s: string): Date {
  // Interpret as LOCAL date (not UTC) to avoid day-shifts
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) throw new Error("invalid date format");
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  return new Date(year, month - 1, day);
}

export function parseYearWeek(yearWeek: string): { year: number; week: number } {
  const m = /^(\d{4})-(\d{2})$/.exec(yearWeek);
  if (!m) throw new Error("week must be in YYYY-WW format");
  const year = Number(m[1]);
  const week = Number(m[2]);
  if (!Number.isInteger(year) || !Number.isInteger(week) || week < 1 || week > 53) {
    throw new Error("invalid year/week");
  }
  return { year, week };
}

export function isoWeekRange(yearWeek: string): { start: Date; days: string[] } {
  const { year, week } = parseYearWeek(yearWeek);

  const base = new Date(year, 0, 4); // local date
  const withYear = setISOWeekYear(base, year);
  const withWeek = setISOWeek(withYear, week);
  const start = startOfISOWeek(withWeek);

  const days = Array.from({ length: 7 }, (_, i) => toISODateOnly(addDays(start, i)));
  return { start, days };
}