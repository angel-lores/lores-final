import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function WeatherCard({ weather }) {
    return (_jsxs("div", { className: "weatherCardCompact", children: [_jsx("div", { className: "weatherCompactTitle", children: weather.locationLabel }), _jsxs("div", { className: "weatherCompactBody", children: [weather.temperature !== null ? `${weather.temperature}°C` : "Unavailable", " \u00B7 ", weather.weatherLabel] }), _jsx("div", { className: "weatherCompactMessage", children: weather.message })] }));
}
