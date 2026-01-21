import { NextResponse } from "next/server";
import { addDays } from "date-fns";
import { db } from "@/lib/db";
import { periodCreateSchema } from "@/lib/validators";
import { getUserId } from "@/lib/api";
import { getSelectedClanId } from "@/lib/clan";
import { getWeekRange, parseDateOnly, toDateOnlyString } from "@/lib/dates";

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

  const periods = await db.period.findMany({
    where: { clanId },
    orderBy: { startDate: "desc" },
  });

  return NextResponse.json({ periods });
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
  const result = periodCreateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  const lastPeriod = await db.period.findFirst({
    where: { clanId },
    orderBy: { startDate: "desc" },
  });

  let startDate: Date;

  if (result.data.startDate) {
    startDate = parseDateOnly(result.data.startDate);
  } else if (lastPeriod) {
    startDate = addDays(lastPeriod.endDate, 1);
  } else {
    const range = getWeekRange(new Date());
    startDate = range.start;
  }

  const endDate = addDays(startDate, 6);
  const name = result.data.name ?? `Semana de ${toDateOnlyString(startDate)}`;

  try {
    const period = await db.period.create({
      data: {
        clanId,
        name,
        startDate,
        endDate,
      },
    });

    return NextResponse.json({ period });
  } catch (error) {
    return NextResponse.json({ error: "El periodo ya existe." }, { status: 409 });
  }
}
