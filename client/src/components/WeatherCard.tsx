import type { WeatherResponse } from "../types";

export default function WeatherCard({ weather }: { weather: WeatherResponse }) {
  return (
    <div className="weatherCardCompact">
      <div className="weatherCompactTitle">{weather.locationLabel}</div>
      <div className="weatherCompactBody">
        {weather.temperature !== null ? `${weather.temperature}°C` : "Unavailable"} · {weather.weatherLabel}
      </div>
      <div className="weatherCompactMessage">{weather.message}</div>
    </div>
  );
}