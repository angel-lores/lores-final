import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import type { Item, ItemType } from "../types";

export default function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState<ItemType | "all">("all");
  const [err, setErr] = useState<string | null>(null);

  async function load() {
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

  async function remove(id: string) {
    await api(`/api/items/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="card">
      <div className="rowBetween topGap">
        <h1 className="pageTitle">My Items</h1>
        <Link className="button" to="/items/new">+ Add Item</Link>
      </div>

      {err && <p role="alert" className="errorText">{err}</p>}

      <div className="row topGap">
        <input
          className="input"
          aria-label="Search items"
          placeholder="Search items"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="input filterSelect"
          aria-label="Filter by type"
          value={type}
          onChange={(e) => setType(e.target.value as ItemType | "all")}
        >
          <option value="all">All types</option>
          <option value="habit">Habits</option>
          <option value="task">Tasks</option>
        </select>
      </div>

      <ul className="list resetList">
        {filtered.length === 0 ? (
          <li className="muted">No matching items.</li>
        ) : (
          filtered.map((it) => (
            <li key={it.id} className="listRow">
              <div>
                <div className="itemTitle">{it.title}</div>
                <div className="muted smallText">{it.type}</div>
              </div>
              <div className="row">
                <Link className="buttonSecondary" to={`/items/${it.id}/edit`}>Edit</Link>
                <button className="buttonSecondary" type="button" onClick={() => remove(it.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}