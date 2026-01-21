import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clanUpdateSchema } from "@/lib/validators";
import { getUserId } from "@/lib/api";
import { ensureMembership, setSelectedClanId } from "@/lib/clan";

export async function PATCH(
  request: Request,
  { params }: { params: { clanId: string } }
) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { clanId } = params;
  const hasMembership = await ensureMembership(userId, clanId);
  if (!hasMembership) {
    return NextResponse.json({ error: "Sin acceso" }, { status: 403 });
  }

  const body = await request.json();
  const result = clanUpdateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  const { name, allowClosedEdits, select } = result.data;

  if (select) {
    await setSelectedClanId(userId, clanId);
  }

  if (name || typeof allowClosedEdits === "boolean") {
    try {
      const clan = await db.clan.update({
        where: { id: clanId },
        data: {
          name: name?.trim(),
          allowClosedEdits,
        },
      });
      return NextResponse.json({ clan });
    } catch (error) {
      return NextResponse.json(
        { error: "Nombre de clan ya existe." },
        { status: 409 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
