import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clanCreateSchema } from "@/lib/validators";
import { getUserId } from "@/lib/api";
import { getSelectedClanId, setSelectedClanId } from "@/lib/clan";

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const memberships = await db.clanMembership.findMany({
    where: { userId },
    include: { clan: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    clans: memberships.map((membership) => membership.clan),
    selectedClanId: await getSelectedClanId(userId),
  });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const result = clanCreateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  const { name, action } = result.data;
  const normalizedName = name.trim();

  if (action === "join") {
    const clan = await db.clan.findUnique({
      where: { name: normalizedName },
    });

    if (!clan) {
      return NextResponse.json({ error: "Clan no encontrado" }, { status: 404 });
    }

    await db.clanMembership.upsert({
      where: { userId_clanId: { userId, clanId: clan.id } },
      create: { userId, clanId: clan.id },
      update: {},
    });

    await setSelectedClanId(userId, clan.id);

    return NextResponse.json({ clan });
  }

  const existing = await db.clan.findUnique({
    where: { name: normalizedName },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Nombre de clan ya existe" },
      { status: 409 }
    );
  }

  const clan = await db.clan.create({
    data: {
      name: normalizedName,
      memberships: { create: { userId } },
    },
  });

  await setSelectedClanId(userId, clan.id);

  return NextResponse.json({ clan });
}
