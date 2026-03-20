import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./routes/Dashboard";
import Items from "./routes/Items";
import ItemForm from "./routes/ItemForm";
import Summary from "./routes/Summary";
export default function App() {
    return (_jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/items", element: _jsx(Items, {}) }), _jsx(Route, { path: "/items/new", element: _jsx(ItemForm, { mode: "create" }) }), _jsx(Route, { path: "/items/:id/edit", element: _jsx(ItemForm, { mode: "edit" }) }), _jsx(Route, { path: "/summary", element: _jsx(Summary, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}
