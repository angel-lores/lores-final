import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import type { Item, WeatherResponse } from "../types";
import WeatherCard from "../components/WeatherCard";

function isoToday(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Dashboard() {
  const today = isoToday();
  const [items, setItems] = useState<Item[]>([]);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function loadItems() {
    setItems(await api<Item[]>(`/api/items?date=${today}`));
  }

  async function loadWeather() {
    try {
      setWeather(await api<WeatherResponse>("/api/weather"));
    } catch {
      setWeather(null);
    }
  }

  useEffect(() => {
    Promise.all([loadItems(), loadWeather()]).catch((e) => setErr(e.message));
  }, []);

  async function complete(itemId: string) {
    setErr(null);
    await api(`/api/items/${itemId}/complete`, {
      method: "POST",
      body: JSON.stringify({ date: today })
    });
    await loadItems();
  }

  return (
    <div className="card">
      <div className="dashboardHeader">
        <div>
          <h1 className="pageTitle">Today</h1>
          <p className="muted">{today}</p>
        </div>

        <div className="dashboardHeaderRight">
          {weather && <WeatherCard weather={weather} />}
          <Link className="button" to="/items/new">
            + Add Item
          </Link>
        </div>
      </div>

      {err && <p role="alert" className="errorText">{err}</p>}

      <ul className="list resetList">
        {items.length === 0 ? (
          <li className="muted">No items yet. Add one to get started.</li>
        ) : (
          items.map((it) => (
            <li key={it.id} className="listRow">
              <div className="row">
                <input
                  aria-label={`Complete ${it.title}`}
                  type="checkbox"
                  checked={Boolean(it.completed)}
                  onChange={() => complete(it.id)}
                  disabled={Boolean(it.completed)}
                />
                <div>
                  <div className="itemTitle">{it.title}</div>
                  <div className="muted smallText">{it.type}</div>
                </div>
              </div>
              <span className="muted">{it.completed ? "Done" : ""}</span>
            </li>
          ))
        )}
      </ul>

      <div className="topGap">
        <Link className="buttonSecondary" to="/summary">
          View Weekly Summary
        </Link>
      </div>
    </div>
  );
}