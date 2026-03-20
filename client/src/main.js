import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
async function enableAxe() {
    if (import.meta.env.DEV) {
        const axe = await import("@axe-core/react");
        axe.default(React, ReactDOM, 1000);
    }
}
enableAxe().finally(() => {
    ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(App, {}) }) }));
});
