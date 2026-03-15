import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Item, ItemType } from "../api/types";

export default function ItemForm({ mode }: { mode: "create" | "edit" }) {
  const nav = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ItemType>("habit");
  const [frequency, setFrequency] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "edit" || !id) return;
    api<Item>(`/api/items/${id}`)
      .then((it) => {
        setTitle(it.title);
        setType(it.type);
        setFrequency(it.frequency ?? "");
      })
      .catch((e) => setErr(e.message));
  }, [mode, id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!title.trim()) {
      setErr("Title is required");
      return;
    }

    const body = { title: title.trim(), type, frequency: frequency.trim() || undefined };

    if (mode === "create") {
      await api("/api/items", { method: "POST", body: JSON.stringify(body) });
    } else {
      await api(`/api/items/${id}`, { method: "PUT", body: JSON.stringify(body) });
    }

    nav("/items");
  }

  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>{mode === "create" ? "Add Item" : "Edit Item"}</h1>

      {err && (
        <p role="alert" style={{ color: "#ff8a8a" }}>
          {err}
        </p>
      )}

      <form onSubmit={submit}>
        <label>
          <div style={{ marginBottom: 6 }}>Title</div>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Title"
            style={{ width: "100%" }}
          />
        </label>

        <div className="row" style={{ marginTop: 12 }}>
          <label style={{ flex: 1 }}>
            <div style={{ marginBottom: 6 }}>Type</div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ItemType)}
              aria-label="Type"
              style={{ width: "100%" }}
            >
              <option value="habit">Habit</option>
              <option value="task">Task</option>
            </select>
          </label>

          <label style={{ flex: 2 }}>
            <div style={{ marginBottom: 6 }}>Frequency (optional)</div>
            <input
              className="input"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="e.g., daily"
              aria-label="Frequency"
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <div className="row" style={{ marginTop: 14 }}>
          <button className="button" type="submit">
            Save
          </button>
          <button className="buttonSecondary" type="button" onClick={() => nav(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}