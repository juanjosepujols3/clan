import { db } from "@/lib/db";

type Range = { start: Date; end: Date };

function sumByPlayer(entries: { playerId: string; value: number }[]) {
  const totals = new Map<string, number>();
  for (const entry of entries) {
    totals.set(entry.playerId, (totals.get(entry.playerId) ?? 0) + entry.value);
  }
  return totals;
}

export async function compareRanges(clanId: string, rangeA: Range, rangeB: Range) {
  const players = await db.player.findMany({
    where: { clanId },
    orderBy: { ign: "asc" },
  });

  const [periodsA, periodsB] = await Promise.all([
    db.period.findMany({
      where: {
        clanId,
        startDate: {
          gte: rangeA.start,
          lte: rangeA.end,
        },
      },
      select: { id: true },
    }),
    db.period.findMany({
      where: {
        clanId,
        startDate: {
          gte: rangeB.start,
          lte: rangeB.end,
        },
      },
      select: { id: true },
    }),
  ]);

  const [phase1A, phase1B] = await Promise.all([
    db.phase1Entry.findMany({
      where: { periodId: { in: periodsA.map((p) => p.id) } },
      select: { playerId: true, value: true },
    }),
    db.phase1Entry.findMany({
      where: { periodId: { in: periodsB.map((p) => p.id) } },
      select: { playerId: true, value: true },
    }),
  ]);

  const [exploreA, exploreB] = await Promise.all([
    db.explorationEntry.findMany({
      where: { clanId, date: { gte: rangeA.start, lte: rangeA.end } },
      select: { playerId: true, swords: true },
    }),
    db.explorationEntry.findMany({
      where: { clanId, date: { gte: rangeB.start, lte: rangeB.end } },
      select: { playerId: true, swords: true },
    }),
  ]);

  const phase1TotalsA = sumByPlayer(
    phase1A.map((entry) => ({ playerId: entry.playerId, value: entry.value }))
  );
  const phase1TotalsB = sumByPlayer(
    phase1B.map((entry) => ({ playerId: entry.playerId, value: entry.value }))
  );
  const exploreTotalsA = sumByPlayer(
    exploreA.map((entry) => ({ playerId: entry.playerId, value: entry.swords }))
  );
  const exploreTotalsB = sumByPlayer(
    exploreB.map((entry) => ({ playerId: entry.playerId, value: entry.swords }))
  );

  const phase1 = players.map((player) => {
    const aTotal = phase1TotalsA.get(player.id) ?? 0;
    const bTotal = phase1TotalsB.get(player.id) ?? 0;
    return {
      playerId: player.id,
      ign: player.ign,
      aTotal,
      bTotal,
      delta: aTotal - bTotal,
    };
  });

  const exploration = players.map((player) => {
    const aTotal = exploreTotalsA.get(player.id) ?? 0;
    const bTotal = exploreTotalsB.get(player.id) ?? 0;
    return {
      playerId: player.id,
      ign: player.ign,
      aTotal,
      bTotal,
      delta: aTotal - bTotal,
    };
  });

  return { phase1, exploration };
}
