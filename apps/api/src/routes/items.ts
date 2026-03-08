import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { parseISODateOnly, toISODateOnly } from "../lib/dates";

const router = Router();

const ItemSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["habit", "task"]),
  frequency: z.string().optional()
});

router.get("/", async (req, res) => {
  const date = typeof req.query.date === "string" ? req.query.date : undefined;

  const items = await prisma.item.findMany({
    orderBy: { createdAt: "desc" },
    include: date
      ? {
          completions: {
            where: { date: parseISODateOnly(date) },
            select: { id: true }
          }
        }
      : { completions: false }
  });

  res.json(
    items.map((it: any) => ({
      id: it.id,
      title: it.title,
      type: it.type,
      frequency: it.frequency ?? null,
      createdAt: it.createdAt.toISOString(),
      completed: date ? it.completions.length > 0 : undefined
    }))
  );
});

router.post("/", async (req, res) => {
  const parsed = ItemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const created = await prisma.item.create({ data: parsed.data });
  res.status(201).json({
    id: created.id,
    title: created.title,
    type: created.type,
    frequency: created.frequency ?? null,
    createdAt: created.createdAt.toISOString()
  });
});

router.get("/:id", async (req, res) => {
  const item = await prisma.item.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: "Item not found" });

  res.json({
    id: item.id,
    title: item.title,
    type: item.type,
    frequency: item.frequency ?? null,
    createdAt: item.createdAt.toISOString()
  });
});

router.put("/:id", async (req, res) => {
  const parsed = ItemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const updated = await prisma.item.update({
      where: { id: req.params.id },
      data: parsed.data
    });

    res.json({
      id: updated.id,
      title: updated.title,
      type: updated.type,
      frequency: updated.frequency ?? null,
      createdAt: updated.createdAt.toISOString()
    });
  } catch {
    res.status(404).json({ error: "Item not found" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.item.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Item not found" });
  }
});

router.post("/:id/complete", async (req, res) => {
  const Body = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).optional();
  const parsed = Body.safeParse(req.body ?? {});
  const dateStr =
    parsed.success && parsed.data?.date ? parsed.data.date : toISODateOnly(new Date());

  const item = await prisma.item.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: "Item not found" });

  try {
    const created = await prisma.completion.create({
      data: { itemId: item.id, date: parseISODateOnly(dateStr) }
    });
    res.status(201).json({ id: created.id, itemId: created.itemId, date: dateStr });
  } catch {
    res.status(409).json({ error: "Already completed for that date" });
  }
});

export default router;