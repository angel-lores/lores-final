import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import type { SummaryResponse } from "../types";
import { addWeeks, yearWeekString } from "../utils/week";

export default function Summary() {
  const [week, setWeek] = useState<string>(() => yearWeekString(new Date()));
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("habtrack:lastWeek", week);
  }, [week]);

  useEffect(() => {
    const saved = localStorage.getItem("habtrack:lastWeek");
    if (saved) setWeek(saved);
  }, []);

  const weekInputValue = useMemo(() => {
    const [y, w] = week.split("-");
    return `${y}-W${w}`;
  }, [week]);

  useEffect(() => {
    api<SummaryResponse>(`/api/summary?week=${week}`)
      .then(setData)
      .catch((e) => setErr(e.message));
  }, [week]);

  function onWeekChange(value: string) {
    const m = /^(\d{4})-W(\d{2})$/.exec(value);
    if (!m) return;
    setWeek(`${m[1]}-${m[2]}`);
  }

  return (
    <div className="card">
      <div className="summaryHeader">
        <h1 className="pageTitle">Weekly Summary</h1>

        <div className="summaryControls">
          <input
            className="input weekInputFull"
            type="week"
            value={weekInputValue}
            aria-label="Select week"
            onChange={(e) => onWeekChange(e.target.value)}
          />

          <div className="summaryButtons">
            <button
              className="buttonSecondary"
              type="button"
              onClick={() => setWeek(addWeeks(week, -1))}
              aria-label="Previous week"
            >
              ←
            </button>

            <button
              className="buttonSecondary"
              type="button"
              onClick={() => setWeek(addWeeks(week, 1))}
              aria-label="Next week"
            >
              →
            </button>

            <button
              className="buttonSecondary"
              type="button"
              onClick={() => setWeek(yearWeekString(new Date()))}
            >
              This week
            </button>
          </div>
        </div>
      </div>

      {err && <p role="alert" className="errorText">{err}</p>}

      {!data ? (
        <p className="muted">Loading…</p>
      ) : (
        <>
          <h2>Completions per day</h2>
          <ul className="list resetList">
            {data.days.map((day) => (
              <li key={day.date} className="listRow">
                <span>{day.date}</span>
                <strong>{day.completedCount}</strong>
              </li>
            ))}
          </ul>

          <h2 className="sectionTitle">Streaks</h2>
          <ul className="list resetList">
            {data.streaks.map((row) => (
              <li key={row.itemId} className="listRow">
                <span>{row.title}</span>
                <span className="muted">current {row.current} · longest {row.longest}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}