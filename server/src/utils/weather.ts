import type { WeatherPayload } from "../types.js";

export function weatherLabel(code: number | null): string {
  if (code === null) return "Unavailable";
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown";
}

export function weatherMessage(temp: number | null, label: string): string {
  if (temp === null) return "Check back later for weather.";
  if (temp >= 20 && label === "Clear") return "Nice day for a walk.";
  if (temp >= 20) return "Good weather for getting outside.";
  if (temp <= 5) return "Stay warm today.";
  if (label === "Rain") return "Might be a good indoor day.";
  if (label === "Snow") return "Bundle up out there.";
  return "Keep the streak going today.";
}

export function normalizeWeather(label: string, data: any): WeatherPayload {
  const current = data?.current ?? {};
  const temp = typeof current.temperature_2m === "number" ? current.temperature_2m : null;
  const code = typeof current.weather_code === "number" ? current.weather_code : null;
  const summary = weatherLabel(code);

  return {
    locationLabel: label,
    temperature: temp,
    weatherLabel: summary,
    message: weatherMessage(temp, summary),
    fetchedAt: new Date().toISOString()
  };
}