import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
export default function Layout({ children }) {
    return (_jsxs(_Fragment, { children: [_jsxs("nav", { className: "nav", "aria-label": "Primary navigation", children: [_jsx(NavLink, { to: "/", className: ({ isActive }) => (isActive ? "active" : ""), children: "Dashboard" }), _jsx(NavLink, { to: "/items", className: ({ isActive }) => (isActive ? "active" : ""), children: "My Items" }), _jsx(NavLink, { to: "/summary", className: ({ isActive }) => (isActive ? "active" : ""), children: "Summary" })] }), _jsx("main", { className: "container", children: children })] }));
}
