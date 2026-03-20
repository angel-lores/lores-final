import { Router } from "express";
import { pool } from "../db.js";
import { normalizeWeather } from "../utils/weather.js";

const router = Router();

router.get("/", async (_req, res) => {
  const label = process.env.WEATHER_LABEL || "Portland, OR";
  const lat = process.env.WEATHER_LAT || "45.5152";
  const lon = process.env.WEATHER_LON || "-122.6784";
  const cacheMinutes = Number(process.env.WEATHER_CACHE_MINUTES || 60);
  const cacheKey = `weather:${label}:${lat}:${lon}`;

  const cached = await pool.query(
    `SELECT payload, expires_at FROM weather_cache WHERE cache_key = $1`,
    [cacheKey]
  );

  if (cached.rowCount && new Date(cached.rows[0].expires_at) > new Date()) {
    return res.json({
      ...cached.rows[0].payload,
      cached: true,
      expiresAt: cached.rows[0].expires_at
    });
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,weather_code&timezone=auto`;
  const response = await fetch(url);

  if (!response.ok) {
    if (cached.rowCount) {
      return res.json({
        ...cached.rows[0].payload,
        cached: true,
        expiresAt: cached.rows[0].expires_at
      });
    }
    return res.status(502).json({ error: "Failed to fetch weather" });
  }

  const raw = await response.json();
  const payload = normalizeWeather(label, raw);
  const expiresAt = new Date(Date.now() + cacheMinutes * 60 * 1000).toISOString();

  await pool.query(
    `
      INSERT INTO weather_cache (cache_key, payload, expires_at, updated_at)
      VALUES ($1, $2::jsonb, $3, NOW())
      ON CONFLICT (cache_key)
      DO UPDATE SET payload = EXCLUDED.payload, expires_at = EXCLUDED.expires_at, updated_at = NOW()
    `,
    [cacheKey, JSON.stringify(payload), expiresAt]
  );

  res.json({
    ...payload,
    cached: false,
    expiresAt
  });
});

export default router;