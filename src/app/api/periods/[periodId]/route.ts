import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { periodUpdateSchema } from "@/lib/validators";
import { getUserId } from "@/lib/api";
import { getSelectedClanId } from "@/lib/clan";
import { ensurePhase1Warnings } from "@/services/warnings";

export async function GET(
  request: Request,
  { params }: { params: { periodId: string } }
) {
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

  const period = await db.period.findFirst({
    where: { id: params.periodId, clanId },
  });

  if (!period) {
    return NextResponse.json({ error: "Periodo no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ period });
}

export async function PATCH(
  request: Request,
  { params }: { params: { periodId: string } }
) {
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
  const result = periodUpdateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  const period = await db.period.findFirst({
    where: { id: params.periodId, clanId },
  });

  if (!period) {
    return NextResponse.json({ error: "Periodo no encontrado" }, { status: 404 });
  }

  const updated = await db.period.update({
    where: { id: period.id },
    data: {
      isClosed: result.data.isClosed ?? period.isClosed,
    },
  });

  if (!period.isClosed && result.data.isClosed) {
    await ensurePhase1Warnings(clanId);
  }

  return NextResponse.json({ period: updated });
}
