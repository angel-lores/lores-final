import { isoWeekRange, parseISODateOnly, parseYearWeek, toISODateOnly } from "../utils/dates";

describe("dates utils", () => {
  test("parseISODateOnly and toISODateOnly keep same date", () => {
    const d = parseISODateOnly("2026-03-08");
    expect(toISODateOnly(d)).toBe("2026-03-08");
  });

  test("parseYearWeek reads YYYY-WW", () => {
    expect(parseYearWeek("2026-10")).toEqual({ year: 2026, week: 10 });
  });

  test("isoWeekRange returns seven days", () => {
    const result = isoWeekRange("2026-10");
    expect(result.days).toHaveLength(7);
  });
});