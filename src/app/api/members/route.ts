import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { memberCreateSchema } from "@/lib/validators";
import { getUserId } from "@/lib/api";
import { getSelectedClanId } from "@/lib/clan";

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

  const players = await db.player.findMany({
    where: { clanId },
    orderBy: { ign: "asc" },
  });

  return NextResponse.json({ players });
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
  const result = memberCreateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  const count = await db.player.count({ where: { clanId } });
  if (count >= 40) {
    return NextResponse.json(
      { error: "Limite de plantilla alcanzado (40 jugadores)." },
      { status: 400 }
    );
  }

  try {
    const player = await db.player.create({
      data: {
        clanId,
        ign: result.data.ign.trim(),
        isActive: result.data.isActive ?? true,
      },
    });

    return NextResponse.json({ player });
  } catch (error) {
    return NextResponse.json({ error: "IGN ya existe." }, { status: 409 });
  }
}
