import { db } from "@/lib/db";
import { addDays } from "date-fns";

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getStreakForPlayer(
  playerId: string,
  referenceDate: Date,
  lookbackDays = 30
) {
  const start = addDays(referenceDate, -lookbackDays + 1);
  const entries = await db.explorationEntry.findMany({
    where: {
      playerId,
      date: {
        gte: start,
        lte: referenceDate,
      },
    },
  });

  const entryMap = new Map(entries.map((entry) => [dateKey(entry.date), entry.swords]));

  let streak = 0;
  for (let i = 0; i < lookbackDays; i += 1) {
    const current = addDays(referenceDate, -i);
    const swords = entryMap.get(dateKey(current)) ?? 0;
    if (swords > 0) {
      break;
    }
    streak += 1;
  }

  return streak;
}

export async function getStreaksForClan(clanId: string, referenceDate: Date) {
  const players = await db.player.findMany({
    where: { clanId },
    orderBy: { ign: "asc" },
  });

  const streaks = await Promise.all(
    players.map(async (player) => ({
      playerId: player.id,
      ign: player.ign,
      streak: await getStreakForPlayer(player.id, referenceDate),
    }))
  );

  return streaks;
}
