import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Item } from "../api/types";

function isoToday(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const today = useMemo(() => isoToday(), []);

  async function load() {
    setErr(null);
    setItems(await api<Item[]>(`/api/items?date=${today}`));
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function complete(itemId: string) {
    setErr(null);
    await api(`/api/items/${itemId}/complete`, {
      method: "POST",
      body: JSON.stringify({ date: today })
    });
    await load();
  }

  return (
    <div className="card">
      <div className="rowBetween">
        <div>
          <h1 style={{ margin: 0 }}>Today</h1>
          <p style={{ marginTop: 6, opacity: 0.85 }}>{today}</p>
        </div>
        <Link className="button" to="/items/new">
          + Add Item
        </Link>
      </div>

      {err && (
        <p role="alert" style={{ color: "#ff8a8a" }}>
          {err}
        </p>
      )}

      <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
        {items.map((it) => (
          <li
            key={it.id}
            className="rowBetween"
            style={{ padding: "10px 0", borderBottom: "1px solid #222" }}
          >
            <div className="row">
              <input
                aria-label={`Complete ${it.title}`}
                type="checkbox"
                checked={Boolean(it.completed)}
                onChange={() => complete(it.id)}
                disabled={Boolean(it.completed)}
              />
              <div>
                <div style={{ fontWeight: 600 }}>{it.title}</div>
                <div style={{ fontSize: 13, opacity: 0.75 }}>{it.type}</div>
              </div>
            </div>
            <span style={{ opacity: 0.7 }}>{it.completed ? "Done" : ""}</span>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 14 }}>
        <Link className="buttonSecondary" to="/summary">
          View Weekly Summary
        </Link>
      </div>
    </div>
  );
}