import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { phase1UpsertSchema } from "@/lib/validators";
import { getUserId } from "@/lib/api";
import { getSelectedClanId } from "@/lib/clan";
import { getPhase1Data, upsertPhase1Entries } from "@/services/phase1";

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
  const periodId = url.searchParams.get("periodId");
  if (!periodId) {
    return NextResponse.json({ error: "Falta periodId" }, { status: 400 });
  }

  const period = await db.period.findFirst({
    where: { id: periodId, clanId },
  });

  if (!period) {
    return NextResponse.json({ error: "Periodo no encontrado" }, { status: 404 });
  }

  const data = await getPhase1Data(clanId, periodId);

  return NextResponse.json({ period, ...data });
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
  const result = phase1UpsertSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  const period = await db.period.findFirst({
    where: { id: result.data.periodId, clanId },
    include: { clan: true },
  });

  if (!period) {
    return NextResponse.json({ error: "Periodo no encontrado" }, { status: 404 });
  }

  if (period.isClosed && !period.clan.allowClosedEdits) {
    return NextResponse.json(
      { error: "Periodo cerrado. Activa edicion en periodos cerrados." },
      { status: 403 }
    );
  }

  await upsertPhase1Entries(result.data.periodId, result.data.entries);

  const data = await getPhase1Data(clanId, result.data.periodId);

  const updatedPeriod = await db.period.update({
    where: { id: result.data.periodId },
    data: { phase1Top30Total: data.totalTop30 },
  });

  return NextResponse.json({ period: updatedPeriod, ...data });
}
