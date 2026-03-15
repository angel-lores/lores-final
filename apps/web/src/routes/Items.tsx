import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Item, ItemType } from "../api/types";

export default function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState<ItemType | "all">("all");
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    setItems(await api<Item[]>("/api/items"));
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchesQ = it.title.toLowerCase().includes(q.toLowerCase());
      const matchesT = type === "all" ? true : it.type === type;
      return matchesQ && matchesT;
    });
  }, [items, q, type]);

  async function del(id: string) {
    setErr(null);
    await api(`/api/items/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="card">
      <div className="rowBetween">
        <h1 style={{ margin: 0 }}>My Items</h1>
        <Link className="button" to="/items/new">
          + Add Item
        </Link>
      </div>

      {err && (
        <p role="alert" style={{ color: "#ff8a8a" }}>
          {err}
        </p>
      )}

      <div className="row" style={{ marginTop: 12 }}>
        <input
          className="input"
          aria-label="Search items"
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1 }}
        />
        <select
          aria-label="Filter by type"
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          style={{ width: 180 }}
        >
          <option value="all">All types</option>
          <option value="habit">Habits</option>
          <option value="task">Tasks</option>
        </select>
      </div>

      <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
        {filtered.map((it) => (
          <li
            key={it.id}
            className="rowBetween"
            style={{ padding: "10px 0", borderBottom: "1px solid #222" }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{it.title}</div>
              <div style={{ fontSize: 13, opacity: 0.75 }}>{it.type}</div>
            </div>
            <div className="row">
              <Link className="buttonSecondary" to={`/items/${it.id}/edit`}>
                Edit
              </Link>
              <button
                className="buttonSecondary"
                onClick={() => del(it.id)}
                aria-label={`Delete ${it.title}`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}