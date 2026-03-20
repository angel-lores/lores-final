import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

declare global {
  var __pool: Pool | undefined;
  var __dbInit: Promise<void> | undefined;
}

export const pool =
  global.__pool ||
  new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false }
  });

global.__pool = pool;

export async function ensureDb() {
  if (!global.__dbInit) {
    global.__dbInit = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS items (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('habit', 'task')),
          frequency TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS completions (
          id TEXT PRIMARY KEY,
          item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
          date DATE NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(item_id, date)
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS weather_cache (
          cache_key TEXT PRIMARY KEY,
          payload JSONB NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);
    })();
  }

  return global.__dbInit;
}