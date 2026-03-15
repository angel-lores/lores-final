export type ItemType = "habit" | "task";

export type Item = {
  id: string;
  title: string;
  type: ItemType;
  frequency: string | null;
  createdAt: string;
  completed?: boolean;
};

export type SummaryDay = { date: string; completedCount: number };

export type StreakRow = {
  itemId: string;
  title: string;
  current: number;
  longest: number;
};

export type SummaryResponse = {
  week: string;
  days: SummaryDay[];
  streaks: StreakRow[];
};