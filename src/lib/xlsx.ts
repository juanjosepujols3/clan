import * as xlsx from "xlsx";

export type ImportType = "phase1" | "exploration";

export type ColumnMapping = {
  ign: string;
  value: string;
  date: string;
};

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function readSheet(buffer: Buffer) {
  const workbook = xlsx.read(buffer, { type: "buffer", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: true }) as (string | number | Date | null)[][];

  const [rawHeaders = []] = rows;
  const headers = rawHeaders.map((header) =>
    typeof header === "string" ? header : String(header ?? "")
  );

  return { headers, rows: rows.slice(1) };
}

export function detectMapping(headers: string[], type: ImportType): ColumnMapping | null {
  const normalized = headers.map((header) => normalizeHeader(header));

  const findHeader = (candidates: string[]) => {
    const index = normalized.findIndex((header) =>
      candidates.some((candidate) => header.includes(candidate))
    );
    return index === -1 ? null : headers[index];
  };

  const ign = findHeader(["ign", "player", "name"]);
  const date = findHeader(["date", "day", "period"]);
  const valueCandidates = type === "phase1" ? ["phase", "score", "value"] : ["swords", "explore", "value"];
  const value = findHeader(valueCandidates);

  if (ign && date && value) {
    return { ign, date, value };
  }

  return null;
}
