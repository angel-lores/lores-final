export type ItemType = "habit" | "task";

export type ItemRow = {
  id: string;
  title: string;
  type: ItemType;
  frequency: string | null;
  created_at: Date;
};

export type WeatherPayload = {
  locationLabel: string;
  temperature: number | null;
  weatherLabel: string;
  message: string;
  fetchedAt: string;
};