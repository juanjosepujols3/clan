import { db } from "@/lib/db";
import { rankTop30 } from "@/lib/top30";

export async function getPhase1Data(clanId: string, periodId: string) {
  const players = await db.player.findMany({
    where: { clanId },
    orderBy: { ign: "asc" },
  });

  const entries = await db.phase1Entry.findMany({
    where: { periodId },
  });

  const entryMap = new Map(entries.map((entry) => [entry.playerId, entry.value]));
  const merged = players.map((player) => ({
    playerId: player.id,
    ign: player.ign,
    value: entryMap.get(player.id) ?? 0,
  }));

  const { ranked, totalTop30 } = rankTop30(merged);
  return { players, ranked, totalTop30 };
}

export async function upsertPhase1Entries(
  periodId: string,
  entries: { playerId: string; value: number }[]
) {
  const operations = entries.map((entry) =>
    db.phase1Entry.upsert({
      where: { periodId_playerId: { periodId, playerId: entry.playerId } },
      create: { periodId, playerId: entry.playerId, value: entry.value },
      update: { value: entry.value },
    })
  );

  await db.$transaction(operations);
}
