import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
export default function ItemForm({ mode }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [type, setType] = useState("habit");
    const [frequency, setFrequency] = useState("");
    const [err, setErr] = useState(null);
    useEffect(() => {
        if (mode !== "edit" || !id)
            return;
        api(`/api/items/${id}`)
            .then((item) => {
            setTitle(item.title);
            setType(item.type);
            setFrequency(item.frequency || "");
        })
            .catch((e) => setErr(e.message));
    }, [id, mode]);
    async function submit(e) {
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
        }
        else {
            await api(`/api/items/${id}`, {
                method: "PUT",
                body: JSON.stringify(body)
            });
        }
        navigate("/items");
    }
    return (_jsxs("div", { className: "card", children: [_jsx("h1", { className: "pageTitle", children: mode === "create" ? "Add Item" : "Edit Item" }), err && _jsx("p", { role: "alert", className: "errorText", children: err }), _jsxs("form", { onSubmit: submit, className: "formStack", children: [_jsxs("label", { children: [_jsx("div", { className: "labelText", children: "Title" }), _jsx("input", { className: "input", value: title, onChange: (e) => setTitle(e.target.value) })] }), _jsxs("label", { children: [_jsx("div", { className: "labelText", children: "Type" }), _jsxs("select", { className: "input", value: type, onChange: (e) => setType(e.target.value), children: [_jsx("option", { value: "habit", children: "Habit" }), _jsx("option", { value: "task", children: "Task" })] })] }), _jsxs("label", { children: [_jsx("div", { className: "labelText", children: "Frequency (optional)" }), _jsx("input", { className: "input", value: frequency, onChange: (e) => setFrequency(e.target.value) })] }), _jsxs("div", { className: "row topGap", children: [_jsx("button", { className: "button", type: "submit", children: "Save" }), _jsx("button", { className: "buttonSecondary", type: "button", onClick: () => navigate(-1), children: "Cancel" })] })] })] }));
}
