import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import WeatherCard from "../components/WeatherCard";
function isoToday() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}
export default function Dashboard() {
    const today = isoToday();
    const [items, setItems] = useState([]);
    const [weather, setWeather] = useState(null);
    const [err, setErr] = useState(null);
    async function loadItems() {
        setItems(await api(`/api/items?date=${today}`));
    }
    async function loadWeather() {
        try {
            setWeather(await api("/api/weather"));
        }
        catch {
            setWeather(null);
        }
    }
    useEffect(() => {
        Promise.all([loadItems(), loadWeather()]).catch((e) => setErr(e.message));
    }, []);
    async function complete(itemId) {
        setErr(null);
        await api(`/api/items/${itemId}/complete`, {
            method: "POST",
            body: JSON.stringify({ date: today })
        });
        await loadItems();
    }
    return (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "dashboardHeader", children: [_jsxs("div", { children: [_jsx("h1", { className: "pageTitle", children: "Today" }), _jsx("p", { className: "muted", children: today })] }), _jsxs("div", { className: "dashboardHeaderRight", children: [weather && _jsx(WeatherCard, { weather: weather }), _jsx(Link, { className: "button", to: "/items/new", children: "+ Add Item" })] })] }), err && _jsx("p", { role: "alert", className: "errorText", children: err }), _jsx("ul", { className: "list resetList", children: items.length === 0 ? (_jsx("li", { className: "muted", children: "No items yet. Add one to get started." })) : (items.map((it) => (_jsxs("li", { className: "listRow", children: [_jsxs("div", { className: "row", children: [_jsx("input", { "aria-label": `Complete ${it.title}`, type: "checkbox", checked: Boolean(it.completed), onChange: () => complete(it.id), disabled: Boolean(it.completed) }), _jsxs("div", { children: [_jsx("div", { className: "itemTitle", children: it.title }), _jsx("div", { className: "muted smallText", children: it.type })] })] }), _jsx("span", { className: "muted", children: it.completed ? "Done" : "" })] }, it.id)))) }), _jsx("div", { className: "topGap", children: _jsx(Link, { className: "buttonSecondary", to: "/summary", children: "View Weekly Summary" }) })] }));
}
