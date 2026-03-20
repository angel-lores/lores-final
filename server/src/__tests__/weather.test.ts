import { normalizeWeather, weatherLabel, weatherMessage } from "../utils/weather";

describe("weather utils", () => {
  test("weatherLabel maps codes", () => {
    expect(weatherLabel(0)).toBe("Clear");
    expect(weatherLabel(63)).toBe("Rain");
  });

  test("weatherMessage returns expected helper text", () => {
    expect(weatherMessage(24, "Clear")).toMatch(/walk/i);
    expect(weatherMessage(2, "Cloudy")).toMatch(/warm/i);
  });

  test("normalizeWeather returns compact payload", () => {
    const result = normalizeWeather("Portland, OR", {
      current: {
        temperature_2m: 12,
        weather_code: 3
      }
    });

    expect(result.locationLabel).toBe("Portland, OR");
    expect(result.temperature).toBe(12);
    expect(result.weatherLabel).toBe("Cloudy");
  });
});