import { Router } from "express";
import { addDays } from "date-fns";
import { prisma } from "../lib/prisma";
import { isoWeekRange, toISODateOnly } from "../lib/dates";
import { computeStreaks } from "../lib/streaks";

const router = Router();

router.get("/", async (req, res) => {
  const week = typeof req.query.week === "string" ? req.query.week : undefined;
  if (!week) return res.status(400).json({ error: "week query param required (YYYY-WW)" });

  const { start, days } = isoWeekRange(week);
  const endExclusive = addDays(start, 7);

  const completions = await prisma.completion.findMany({
    where: { date: { gte: start, lt: endExclusive } },
    select: { date: true }
  });

  const countsByDay = new Map<string, number>();
  for (const d of days) countsByDay.set(d, 0);
  for (const c of completions) {
    const day = toISODateOnly(c.date);
    countsByDay.set(day, (countsByDay.get(day) ?? 0) + 1);
  }

  const items = await prisma.item.findMany({
    select: {
      id: true,
      title: true,
      completions: { select: { date: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  const streaks = items.map((it) => {
    const dts = it.completions.map((c) => toISODateOnly(c.date));
    return { itemId: it.id, title: it.title, ...computeStreaks(dts) };
  });

  res.json({
    week,
    days: days.map((d) => ({ date: d, completedCount: countsByDay.get(d) ?? 0 })),
    streaks
  });
});

export default router;