import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import type { Item, ItemType } from "../types";

export default function ItemForm({ mode }: { mode: "create" | "edit" }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ItemType>("habit");
  const [frequency, setFrequency] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "edit" || !id) return;
    api<Item>(`/api/items/${id}`)
      .then((item) => {
        setTitle(item.title);
        setType(item.type);
        setFrequency(item.frequency || "");
      })
      .catch((e) => setErr(e.message));
  }, [id, mode]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!title.trim()) {
      setErr("Title is required");
      return;
    }

    const body = {
      title: title.trim(),
      type,
      frequency: frequency.trim() || undefined
    };

    if (mode === "create") {
      await api("/api/items", {
        method: "POST",
        body: JSON.stringify(body)
      });
    } else {
      await api(`/api/items/${id}`, {
        method: "PUT",
        body: JSON.stringify(body)
      });
    }

    navigate("/items");
  }

  return (
    <div className="card">
      <h1 className="pageTitle">{mode === "create" ? "Add Item" : "Edit Item"}</h1>

      {err && <p role="alert" className="errorText">{err}</p>}

      <form onSubmit={submit} className="formStack">
        <label>
          <div className="labelText">Title</div>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          <div className="labelText">Type</div>
          <select className="input" value={type} onChange={(e) => setType(e.target.value as ItemType)}>
            <option value="habit">Habit</option>
            <option value="task">Task</option>
          </select>
        </label>

        <label>
          <div className="labelText">Frequency (optional)</div>
          <input className="input" value={frequency} onChange={(e) => setFrequency(e.target.value)} />
        </label>

        <div className="row topGap">
          <button className="button" type="submit">Save</button>
          <button className="buttonSecondary" type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}