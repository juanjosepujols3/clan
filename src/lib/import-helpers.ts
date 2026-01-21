import { isValid, parse } from "date-fns";
import * as xlsx from "xlsx";

const DATE_PATTERNS = ["yyyy-MM-dd", "MM/dd/yyyy", "M/d/yyyy", "yyyy/M/d"];

export function parseDateValue(value: unknown): Date | null {
  if (value instanceof Date && isValid(value)) {
    return value;
  }
  if (typeof value === "number") {
    const parsed = xlsx.SSF.parse_date_code(value);
    if (parsed && parsed.y && parsed.m && parsed.d) {
      return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
    }
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    for (const pattern of DATE_PATTERNS) {
      const parsed = parse(trimmed, pattern, new Date());
      if (isValid(parsed)) {
        return new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()));
      }
    }
    const iso = new Date(trimmed);
    if (isValid(iso)) {
      return new Date(Date.UTC(iso.getFullYear(), iso.getMonth(), iso.getDate()));
    }
  }
  return null;
}
