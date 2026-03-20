import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
export default function Items() {
    const [items, setItems] = useState([]);
    const [q, setQ] = useState("");
    const [type, setType] = useState("all");
    const [err, setErr] = useState(null);
    async function load() {
        setItems(await api("/api/items"));
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
    async function remove(id) {
        await api(`/api/items/${id}`, { method: "DELETE" });
        await load();
    }
    return (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "rowBetween topGap", children: [_jsx("h1", { className: "pageTitle", children: "My Items" }), _jsx(Link, { className: "button", to: "/items/new", children: "+ Add Item" })] }), err && _jsx("p", { role: "alert", className: "errorText", children: err }), _jsxs("div", { className: "row topGap", children: [_jsx("input", { className: "input", "aria-label": "Search items", placeholder: "Search items", value: q, onChange: (e) => setQ(e.target.value) }), _jsxs("select", { className: "input filterSelect", "aria-label": "Filter by type", value: type, onChange: (e) => setType(e.target.value), children: [_jsx("option", { value: "all", children: "All types" }), _jsx("option", { value: "habit", children: "Habits" }), _jsx("option", { value: "task", children: "Tasks" })] })] }), _jsx("ul", { className: "list resetList", children: filtered.length === 0 ? (_jsx("li", { className: "muted", children: "No matching items." })) : (filtered.map((it) => (_jsxs("li", { className: "listRow", children: [_jsxs("div", { children: [_jsx("div", { className: "itemTitle", children: it.title }), _jsx("div", { className: "muted smallText", children: it.type })] }), _jsxs("div", { className: "row", children: [_jsx(Link, { className: "buttonSecondary", to: `/items/${it.id}/edit`, children: "Edit" }), _jsx("button", { className: "buttonSecondary", type: "button", onClick: () => remove(it.id), children: "Delete" })] })] }, it.id)))) })] }));
}
