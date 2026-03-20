import { randomUUID } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";
import { parseISODateOnly, toISODateOnly } from "../utils/dates.js";

const router = Router();

const itemSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["habit", "task"]),
  frequency: z.string().optional()
});

router.get("/", async (req, res) => {
  const date = typeof req.query.date === "string" ? req.query.date : undefined;

  if (!date) {
    const result = await pool.query(
      `SELECT id, title, type, frequency, created_at FROM items ORDER BY created_at DESC`
    );
    return res.json(
      result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        type: row.type,
        frequency: row.frequency,
        createdAt: row.created_at
      }))
    );
  }

  const result = await pool.query(
    `
      SELECT i.id, i.title, i.type, i.frequency, i.created_at,
      EXISTS (
        SELECT 1 FROM completions c
        WHERE c.item_id = i.id AND c.date = $1
      ) AS completed
      FROM items i
      ORDER BY i.created_at DESC
    `,
    [toISODateOnly(parseISODateOnly(date))]
  );

  res.json(
    result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      frequency: row.frequency,
      createdAt: row.created_at,
      completed: row.completed
    }))
  );
});

router.post("/", async (req, res) => {
  const parsed = itemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid item data" });

  const id = randomUUID();
  const result = await pool.query(
    `INSERT INTO items (id, title, type, frequency) VALUES ($1, $2, $3, $4) RETURNING *`,
    [id, parsed.data.title, parsed.data.type, parsed.data.frequency || null]
  );

  const row = result.rows[0];
  res.status(201).json({
    id: row.id,
    title: row.title,
    type: row.type,
    frequency: row.frequency,
    createdAt: row.created_at
  });
});

router.get("/:id", async (req, res) => {
  const result = await pool.query(`SELECT * FROM items WHERE id = $1`, [req.params.id]);
  if (result.rowCount === 0) return res.status(404).json({ error: "Item not found" });

  const row = result.rows[0];
  res.json({
    id: row.id,
    title: row.title,
    type: row.type,
    frequency: row.frequency,
    createdAt: row.created_at
  });
});

router.put("/:id", async (req, res) => {
  const parsed = itemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid item data" });

  const result = await pool.query(
    `
      UPDATE items
      SET title = $1, type = $2, frequency = $3
      WHERE id = $4
      RETURNING *
    `,
    [parsed.data.title, parsed.data.type, parsed.data.frequency || null, req.params.id]
  );

  if (result.rowCount === 0) return res.status(404).json({ error: "Item not found" });

  const row = result.rows[0];
  res.json({
    id: row.id,
    title: row.title,
    type: row.type,
    frequency: row.frequency,
    createdAt: row.created_at
  });
});

router.delete("/:id", async (req, res) => {
  const result = await pool.query(`DELETE FROM items WHERE id = $1`, [req.params.id]);
  if (result.rowCount === 0) return res.status(404).json({ error: "Item not found" });
  res.status(204).send();
});

router.post("/:id/complete", async (req, res) => {
  const bodySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
  });

  const parsed = bodySchema.safeParse(req.body || {});
  if (!parsed.success) return res.status(400).json({ error: "Invalid date" });

  const date = parsed.data.date || toISODateOnly(new Date());
  const itemCheck = await pool.query(`SELECT id FROM items WHERE id = $1`, [req.params.id]);
  if (itemCheck.rowCount === 0) return res.status(404).json({ error: "Item not found" });

  try {
    const result = await pool.query(
      `INSERT INTO completions (id, item_id, date) VALUES ($1, $2, $3) RETURNING *`,
      [randomUUID(), req.params.id, toISODateOnly(parseISODateOnly(date))]
    );
    const row = result.rows[0];
    res.status(201).json({ id: row.id, itemId: row.item_id, date: row.date });
  } catch {
    res.status(409).json({ error: "Already completed for that date" });
  }
});

export default router;