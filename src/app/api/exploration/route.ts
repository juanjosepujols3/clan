import { NextResponse } from "next/server";
import { addDays } from "date-fns";
import { db } from "@/lib/db";
import { explorationUpsertSchema } from "@/lib/validators";
import { getUserId } from "@/lib/api";
import { getSelectedClanId } from "@/lib/clan";
import { parseDateOnly, toDateOnlyString } from "@/lib/dates";
import { getStreaksForClan } from "@/services/exploration";
import { ensureSwordsWarning } from "@/services/warnings";

export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const clanId = await getSelectedClanId(userId);
  if (!clanId) {
    return NextResponse.json(
      { error: "No hay clan seleccionado" },
      { status: 400 }
    );
  }

  const url = new URL(request.url);
  const startParam = url.searchParams.get("start");
  const endParam = url.searchParams.get("end");

  const endDate = endParam ? parseDateOnly(endParam) : new Date();
  const startDate = startParam
    ? parseDateOnly(startParam)
    : addDays(endDate, -6);

  const entries = await db.explorationEntry.findMany({
    where: { clanId, date: { gte: startDate, lte: endDate } },
    include: { player: true },
    orderBy: [{ date: "desc" }, { player: { ign: "asc" } }],
  });

  const streaks = await getStreaksForClan(clanId, endDate);

  return NextResponse.json({
    entries,
    streaks,
    range: { start: toDateOnlyString(startDate), end: toDateOnlyString(endDate) },
  });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const clanId = await getSelectedClanId(userId);
  if (!clanId) {
    return NextResponse.json(
      { error: "No hay clan seleccionado" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const result = explorationUpsertSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  const entryDate = parseDateOnly(result.data.date);

  await db.$transaction(
    result.data.entries.map((entry) =>
      db.explorationEntry.upsert({
        where: { playerId_date: { playerId: entry.playerId, date: entryDate } },
        create: {
          clanId,
          playerId: entry.playerId,
          date: entryDate,
          swords: entry.swords,
        },
        update: { swords: entry.swords },
      })
    )
  );

  await Promise.all(
    result.data.entries.map((entry) =>
      ensureSwordsWarning(clanId, entry.playerId, entryDate)
    )
  );

  return NextResponse.json({ ok: true });
}
