import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { memberUpdateSchema } from "@/lib/validators";
import { getUserId } from "@/lib/api";
import { getSelectedClanId } from "@/lib/clan";

export async function PATCH(
  request: Request,
  { params }: { params: { playerId: string } }
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
  const result = memberUpdateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  const player = await db.player.findFirst({
    where: { id: params.playerId, clanId },
  });

  if (!player) {
    return NextResponse.json({ error: "Jugador no encontrado" }, { status: 404 });
  }

  try {
    const updated = await db.player.update({
      where: { id: player.id },
      data: {
        ign: result.data.ign?.trim(),
        isActive: result.data.isActive,
      },
    });

    return NextResponse.json({ player: updated });
  } catch (error) {
    return NextResponse.json({ error: "IGN ya existe." }, { status: 409 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { playerId: string } }
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

  const player = await db.player.findFirst({
    where: { id: params.playerId, clanId },
  });

  if (!player) {
    return NextResponse.json({ error: "Jugador no encontrado" }, { status: 404 });
  }

  const updated = await db.player.update({
    where: { id: player.id },
    data: { isActive: false },
  });

  return NextResponse.json({ player: updated });
}
