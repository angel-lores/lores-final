import cors from "cors";
import express from "express";
import { ensureDb } from "./db.js";
import health from "./routes/health.js";
import items from "./routes/items.js";
import summary from "./routes/summary.js";
import weather from "./routes/weather.js";

const app = express();

const allowed = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({ origin: allowed.length ? allowed : true }));
app.use(express.json());

app.use(async (_req, _res, next) => {
  try {
    await ensureDb();
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/api/health", health);
app.use("/api/items", items);
app.use("/api/summary", summary);
app.use("/api/weather", weather);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
);

export default app;