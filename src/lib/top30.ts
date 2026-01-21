export type RankedEntry = {
  playerId: string;
  ign: string;
  value: number;
  rank: number;
  isTop30: boolean;
};

export function rankTop30(entries: { playerId: string; ign: string; value: number }[]) {
  const sorted = [...entries].sort((a, b) => b.value - a.value || a.ign.localeCompare(b.ign));
  const ranked: RankedEntry[] = sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1,
    isTop30: index < 30,
  }));
  const totalTop30 = ranked
    .filter((entry) => entry.isTop30)
    .reduce((sum, entry) => sum + entry.value, 0);
  return { ranked, totalTop30 };
}
