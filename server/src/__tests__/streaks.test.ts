import { computeStreaks } from "../utils/streaks";

describe("computeStreaks", () => {
  test("returns current and longest streak", () => {
    const result = computeStreaks([
      "2026-03-01",
      "2026-03-02",
      "2026-03-04",
      "2026-03-05",
      "2026-03-06"
    ]);

    expect(result.current).toBe(3);
    expect(result.longest).toBe(3);
  });
});