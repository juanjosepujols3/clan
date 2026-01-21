import { db } from "@/lib/db";
import { getStreakForPlayer } from "@/services/exploration";

export async function ensurePhase1Warnings(clanId: string) {
  const now = new Date();
  const periods = await db.period.findMany({
    where: {
      clanId,
      OR: [{ isClosed: true }, { endDate: { lte: now } }],
    },
    orderBy: { startDate: "asc" },
  });

  const players = await db.player.findMany({
    where: { clanId },
  });

  const entries = await db.phase1Entry.findMany({
    where: {
      periodId: { in: periods.map((period) => period.id) },
    },
  });

  const entryMap = new Map(
    entries.map((entry) => [
      `${entry.periodId}:${entry.playerId}`,
      entry.value,
    ])
  );

  const warnings = [] as {
    clanId: string;
    playerId: string;
    periodId: string;
    type: "NO_PHASE1";
    triggerDate: Date;
    details: { value: number };
  }[];

  for (const period of periods) {
    for (const player of players) {
      const key = `${period.id}:${player.id}`;
      const value = entryMap.get(key) ?? 0;
      if (value <= 0) {
        warnings.push({
          clanId,
          playerId: player.id,
          periodId: period.id,
          type: "NO_PHASE1",
          triggerDate: period.endDate,
          details: { value },
        });
      }
    }
  }

  if (!warnings.length) {
    return 0;
  }

  const created = await db.warningEvent.createMany({
    data: warnings,
    skipDuplicates: true,
  });

  return created.count;
}

export async function ensureSwordsWarning(
  clanId: string,
  playerId: string,
  triggerDate: Date
) {
  const normalized = new Date(
    Date.UTC(
      triggerDate.getUTCFullYear(),
      triggerDate.getUTCMonth(),
      triggerDate.getUTCDate()
    )
  );
  const streak = await getStreakForPlayer(playerId, normalized);
  if (streak <= 5) {
    return null;
  }

  return db.warningEvent.createMany({
    data: [
      {
        clanId,
        playerId,
        type: "NO_SWORDS_STREAK",
        triggerDate: normalized,
        details: { streak },
      },
    ],
    skipDuplicates: true,
  });
}
