import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { warningAckSchema } from "@/lib/validators";
import { getUserId } from "@/lib/api";
import { getSelectedClanId } from "@/lib/clan";
import { ensurePhase1Warnings, ensureSwordsWarning } from "@/services/warnings";

export async function GET() {
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

  const warnings = await db.warningEvent.findMany({
    where: { clanId },
    include: { player: true, period: true },
    orderBy: { createdAt: "desc" },
  });

  const current = warnings.filter((warning) => !warning.acknowledgedAt);

  return NextResponse.json({ current, history: warnings });
}

export async function POST() {
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

  const phase1Count = await ensurePhase1Warnings(clanId);
  const players = await db.player.findMany({ where: { clanId } });
  const today = new Date();

  await Promise.all(
    players.map((player) => ensureSwordsWarning(clanId, player.id, today))
  );

  return NextResponse.json({ phase1Count });
}

export async function PATCH(request: Request) {
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
  const result = warningAckSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  const warning = await db.warningEvent.findFirst({
    where: { id: result.data.warningId, clanId },
  });

  if (!warning) {
    return NextResponse.json(
      { error: "Advertencia no encontrada" },
      { status: 404 }
    );
  }

  const updated = await db.warningEvent.update({
    where: { id: warning.id },
    data: { acknowledgedAt: new Date() },
  });

  return NextResponse.json({ warning: updated });
}
