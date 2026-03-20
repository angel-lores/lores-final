import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { addWeeks, yearWeekString } from "../utils/week";
export default function Summary() {
    const [week, setWeek] = useState(() => yearWeekString(new Date()));
    const [data, setData] = useState(null);
    const [err, setErr] = useState(null);
    useEffect(() => {
        localStorage.setItem("habtrack:lastWeek", week);
    }, [week]);
    useEffect(() => {
        const saved = localStorage.getItem("habtrack:lastWeek");
        if (saved)
            setWeek(saved);
    }, []);
    const weekInputValue = useMemo(() => {
        const [y, w] = week.split("-");
        return `${y}-W${w}`;
    }, [week]);
    useEffect(() => {
        api(`/api/summary?week=${week}`)
            .then(setData)
            .catch((e) => setErr(e.message));
    }, [week]);
    function onWeekChange(value) {
        const m = /^(\d{4})-W(\d{2})$/.exec(value);
        if (!m)
            return;
        setWeek(`${m[1]}-${m[2]}`);
    }
    return (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "summaryHeader", children: [_jsx("h1", { className: "pageTitle", children: "Weekly Summary" }), _jsxs("div", { className: "summaryControls", children: [_jsx("input", { className: "input weekInputFull", type: "week", value: weekInputValue, "aria-label": "Select week", onChange: (e) => onWeekChange(e.target.value) }), _jsxs("div", { className: "summaryButtons", children: [_jsx("button", { className: "buttonSecondary", type: "button", onClick: () => setWeek(addWeeks(week, -1)), "aria-label": "Previous week", children: "\u2190" }), _jsx("button", { className: "buttonSecondary", type: "button", onClick: () => setWeek(addWeeks(week, 1)), "aria-label": "Next week", children: "\u2192" }), _jsx("button", { className: "buttonSecondary", type: "button", onClick: () => setWeek(yearWeekString(new Date())), children: "This week" })] })] })] }), err && _jsx("p", { role: "alert", className: "errorText", children: err }), !data ? (_jsx("p", { className: "muted", children: "Loading\u2026" })) : (_jsxs(_Fragment, { children: [_jsx("h2", { children: "Completions per day" }), _jsx("ul", { className: "list resetList", children: data.days.map((day) => (_jsxs("li", { className: "listRow", children: [_jsx("span", { children: day.date }), _jsx("strong", { children: day.completedCount })] }, day.date))) }), _jsx("h2", { className: "sectionTitle", children: "Streaks" }), _jsx("ul", { className: "list resetList", children: data.streaks.map((row) => (_jsxs("li", { className: "listRow", children: [_jsx("span", { children: row.title }), _jsxs("span", { className: "muted", children: ["current ", row.current, " \u00B7 longest ", row.longest] })] }, row.itemId))) })] }))] }));
}
