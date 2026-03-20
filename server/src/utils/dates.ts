import { addDays, format, startOfISOWeek, setISOWeek, setISOWeekYear } from "date-fns";

export function toISODateOnly(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseISODateOnly(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error("invalid date format");
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function parseYearWeek(value: string): { year: number; week: number } {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) throw new Error("week must be in YYYY-WW format");
  const year = Number(match[1]);
  const week = Number(match[2]);
  if (!Number.isInteger(year) || !Number.isInteger(week) || week < 1 || week > 53) {
    throw new Error("invalid year/week");
  }
  return { year, week };
}

export function isoWeekRange(yearWeek: string) {
  const { year, week } = parseYearWeek(yearWeek);
  const base = new Date(year, 0, 4);
  const withYear = setISOWeekYear(base, year);
  const withWeek = setISOWeek(withYear, week);
  const start = startOfISOWeek(withWeek);
  const days = Array.from({ length: 7 }, (_, i) => toISODateOnly(addDays(start, i)));
  return { start, days };
}