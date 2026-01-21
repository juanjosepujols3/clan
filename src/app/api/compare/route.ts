import { NextResponse } from "next/server";
import { compareSchema } from "@/lib/validators";
import { getUserId } from "@/lib/api";
import { getSelectedClanId } from "@/lib/clan";
import { parseDateOnly } from "@/lib/dates";
import { compareRanges } from "@/services/compare";

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
  const result = compareSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  const rangeA = {
    start: parseDateOnly(result.data.rangeA.start),
    end: parseDateOnly(result.data.rangeA.end),
  };
  const rangeB = {
    start: parseDateOnly(result.data.rangeB.start),
    end: parseDateOnly(result.data.rangeB.end),
  };

  if (rangeA.start > rangeA.end || rangeB.start > rangeB.end) {
    return NextResponse.json(
      { error: "Rangos de fecha invalidos." },
      { status: 400 }
    );
  }

  const comparison = await compareRanges(clanId, rangeA, rangeB);

  return NextResponse.json(comparison);
}
