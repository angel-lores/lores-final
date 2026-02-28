import express from "express";
import cors from "cors";
import health from "./routes/health";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", health);

export default app;