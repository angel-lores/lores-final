import { Router } from "express";
import { addDays } from "date-fns";
import { pool } from "../db.js";
import { isoWeekRange, toISODateOnly } from "../utils/dates.js";
import { computeStreaks } from "../utils/streaks.js";

const router = Router();

router.get("/", async (req, res) => {
  const week = typeof req.query.week === "string" ? req.query.week : undefined;
  if (!week) return res.status(400).json({ error: "week query param required" });

  const { start, days } = isoWeekRange(week);
  const endExclusive = addDays(start, 7);

  const weekResult = await pool.query(
    `SELECT date FROM completions WHERE date >= $1 AND date < $2`,
    [toISODateOnly(start), toISODateOnly(endExclusive)]
  );

  const counts = new Map<string, number>();
  for (const day of days) counts.set(day, 0);
  for (const row of weekResult.rows) {
    const date = row.date instanceof Date ? toISODateOnly(row.date) : row.date;
    counts.set(date, (counts.get(date) || 0) + 1);
  }

  const allItems = await pool.query(
    `
      SELECT i.id, i.title, c.date
      FROM items i
      LEFT JOIN completions c ON c.item_id = i.id
      ORDER BY i.created_at DESC
    `
  );

  const grouped = new Map<string, { title: string; dates: string[] }>();
  for (const row of allItems.rows) {
    if (!grouped.has(row.id)) {
      grouped.set(row.id, { title: row.title, dates: [] });
    }
    if (row.date) {
      grouped.get(row.id)!.dates.push(row.date instanceof Date ? toISODateOnly(row.date) : row.date);
    }
  }

  const streaks = Array.from(grouped.entries()).map(([itemId, value]) => ({
    itemId,
    title: value.title,
    ...computeStreaks(value.dates)
  }));

  res.json({
    week,
    days: days.map((date) => ({ date, completedCount: counts.get(date) || 0 })),
    streaks
  });
});

export default router;