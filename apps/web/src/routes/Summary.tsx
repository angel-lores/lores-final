import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { SummaryResponse } from "../api/types";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function isoWeekYearAndNumber(date: Date): { year: number; week: number } {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = (d.getDay() + 6) % 7; 
  d.setDate(d.getDate() - day + 3);
  const year = d.getFullYear();

  const firstThu = new Date(year, 0, 4);
  const firstDay = (firstThu.getDay() + 6) % 7;
  firstThu.setDate(firstThu.getDate() - firstDay + 3);

  const diffDays = Math.round((d.getTime() - firstThu.getTime()) / 86400000);
  const week = 1 + Math.floor(diffDays / 7);

  return { year, week };
}

function yearWeekString(date: Date): string {
  const { year, week } = isoWeekYearAndNumber(date);
  return `${year}-${pad2(week)}`;
}

function parseYearWeek(s: string): { year: number; week: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(s);
  if (!m) return null;
  const year = Number(m[1]);
  const week = Number(m[2]);
  if (!Number.isInteger(year) || !Number.isInteger(week) || week < 1 || week > 53) return null;
  return { year, week };
}

function isoWeekStartDate(year: number, week: number): Date {
  const jan4 = new Date(year, 0, 4);
  const day = (jan4.getDay() + 6) % 7;
  const week1Mon = new Date(year, 0, 4 - day);
  const d = new Date(week1Mon);
  d.setDate(d.getDate() + (week - 1) * 7);
  return d;
}

function addWeeks(weekStr: string, delta: number): string {
  const parsed = parseYearWeek(weekStr);
  if (!parsed) return weekStr;
  const start = isoWeekStartDate(parsed.year, parsed.week);
  start.setDate(start.getDate() + delta * 7);
  return yearWeekString(start);
}

export default function Summary() {
  const [week, setWeek] = useState<string>(() => yearWeekString(new Date()));
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const weekInputValue = useMemo(() => {
    const [y, w] = week.split("-");
    return `${y}-W${w}`;
  }, [week]);

  async function load(w: string) {
    setErr(null);
    setData(await api<SummaryResponse>(`/api/summary?week=${w}`));
  }

  useEffect(() => {
    load(week).catch((e) => setErr(e.message));
  }, [week]);

  function onWeekChange(v: string) {
    const m = /^(\d{4})-W(\d{2})$/.exec(v);
    if (!m) return;
    setWeek(`${m[1]}-${m[2]}`);
  }

  return (
    <div className="card">
      <div className="rowBetween">
        <h1 style={{ margin: 0 }}>Weekly Summary</h1>

        <div className="row" style={{ gap: 8 }}>
          <button className="buttonSecondary" type="button" onClick={() => setWeek(addWeeks(week, -1))}>
            ←
          </button>

          <label className="row" style={{ gap: 8 }}>
            <span style={{ opacity: 0.8 }}>Week</span>
            <input
              type="week"
              value={weekInputValue}
              onChange={(e) => onWeekChange(e.target.value)}
              aria-label="Select week"
            />
          </label>

          <button className="buttonSecondary" type="button" onClick={() => setWeek(addWeeks(week, 1))}>
            →
          </button>

          <button className="buttonSecondary" type="button" onClick={() => setWeek(yearWeekString(new Date()))}>
            This week
          </button>
        </div>
      </div>

      {err && (
        <p role="alert" style={{ color: "#ff8a8a" }}>
          {err}
        </p>
      )}

      {!data ? (
        <p style={{ opacity: 0.8 }}>Loading…</p>
      ) : (
        <>
          <h2 style={{ marginBottom: 8 }}>Completions per day</h2>
          <ul style={{ listStyle: "none", padding: 0, marginTop: 0 }}>
            {data.days.map((d) => (
              <li
                key={d.date}
                className="rowBetween"
                style={{ padding: "8px 0", borderBottom: "1px solid #222" }}
              >
                <span>{d.date}</span>
                <strong>{d.completedCount}</strong>
              </li>
            ))}
          </ul>

          <h2 style={{ marginTop: 18, marginBottom: 8 }}>Streaks</h2>
          <ul style={{ listStyle: "none", padding: 0, marginTop: 0 }}>
            {data.streaks.slice(0, 8).map((s) => (
              <li
                key={s.itemId}
                className="rowBetween"
                style={{ padding: "8px 0", borderBottom: "1px solid #222" }}
              >
                <span>{s.title}</span>
                <span style={{ opacity: 0.85 }}>
                  current {s.current} · longest {s.longest}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}