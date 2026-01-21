import { NextResponse } from "next/server";
import * as xlsx from "xlsx";
import { db } from "@/lib/db";
import { getUserId } from "@/lib/api";
import { getSelectedClanId } from "@/lib/clan";
import { parseDateOnly, toDateOnlyString } from "@/lib/dates";
import { getPhase1Data } from "@/services/phase1";

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
  const type = url.searchParams.get("type");

  if (!type) {
    return NextResponse.json(
      { error: "Falta tipo de exportacion" },
      { status: 400 }
    );
  }

  let workbook = xlsx.utils.book_new();
  let fileName = "export.xlsx";

  if (type === "phase1") {
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

    const rows = [
      ["IGN", "PHASE1", "Rank", "Top30"],
      ...data.ranked.map((entry) => [
        entry.ign,
        entry.value,
        entry.rank,
        entry.isTop30 ? "YES" : "",
      ]),
    ];

    const sheet = xlsx.utils.aoa_to_sheet(rows);
    xlsx.utils.book_append_sheet(workbook, sheet, "PHASE1");
    fileName = `phase1-${period.name.replace(/\s+/g, "-")}.xlsx`;
  } else if (type === "exploration") {
    const startParam = url.searchParams.get("start");
    const endParam = url.searchParams.get("end");
    const endDate = endParam ? parseDateOnly(endParam) : new Date();
    const startDate = startParam ? parseDateOnly(startParam) : endDate;

    const entries = await db.explorationEntry.findMany({
      where: { clanId, date: { gte: startDate, lte: endDate } },
      include: { player: true },
      orderBy: [{ date: "desc" }, { player: { ign: "asc" } }],
    });

    const rows = [
      ["Date", "IGN", "Swords"],
      ...entries.map((entry) => [
        toDateOnlyString(entry.date),
        entry.player.ign,
        entry.swords,
      ]),
    ];

    const sheet = xlsx.utils.aoa_to_sheet(rows);
    xlsx.utils.book_append_sheet(workbook, sheet, "Exploration");
    fileName = "exploration.xlsx";
  } else if (type === "warnings") {
    const warnings = await db.warningEvent.findMany({
      where: { clanId },
      include: { player: true, period: true },
      orderBy: { createdAt: "desc" },
    });

    const rows = [
      ["Date", "Type", "IGN", "Period", "Acknowledged", "Details"],
      ...warnings.map((warning) => [
        toDateOnlyString(warning.triggerDate),
        warning.type,
        warning.player.ign,
        warning.period?.name ?? "",
        warning.acknowledgedAt ? "YES" : "",
        warning.details ? JSON.stringify(warning.details) : "",
      ]),
    ];

    const sheet = xlsx.utils.aoa_to_sheet(rows);
    xlsx.utils.book_append_sheet(workbook, sheet, "Warnings");
    fileName = "warnings.xlsx";
  } else {
    return NextResponse.json(
      { error: "Tipo de exportacion no soportado" },
      { status: 400 }
    );
  }

  const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=\"${fileName}\"`,
    },
  });
}
