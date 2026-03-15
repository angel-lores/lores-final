import express from "express";
import cors from "cors";
import health from "./routes/health";
import items from "./routes/items";
import summary from "./routes/summary";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

const allowed = process.env.CORS_ORIGIN?.split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowed && allowed.length > 0 ? allowed : true
  })
);

app.use(express.json());

app.use("/api/health", health);
app.use("/api/items", items);
app.use("/api/summary", summary);

app.use(notFound);
app.use(errorHandler);

export default app;