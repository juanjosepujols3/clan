import { addDays, startOfWeek } from "date-fns";

export function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map((part) => Number(part));
  if (!year || !month || !day) {
    throw new Error("Invalid date value");
  }
  return new Date(Date.UTC(year, month - 1, day));
}

export function toDateOnlyString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getWeekRange(baseDate: Date): { start: Date; end: Date } {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 });
  const end = addDays(start, 6);
  return { start, end };
}
