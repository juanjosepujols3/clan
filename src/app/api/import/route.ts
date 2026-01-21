import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUserId } from "@/lib/api";
import { getSelectedClanId } from "@/lib/clan";
import { getWeekRange } from "@/lib/dates";
import { detectMapping, readSheet, type ColumnMapping } from "@/lib/xlsx";
import { parseDateValue } from "@/lib/import-helpers";
import { getPhase1Data } from "@/services/phase1";

const typeSchema = z.enum(["phase1", "exploration", "ocr"]);
const mappingSchema = z.object({
  ign: z.string().min(1),
  value: z.string().min(1),
  date: z.string().min(1),
});

function buildIndex(headers: string[], mapping: ColumnMapping) {
  const map = new Map(headers.map((header, index) => [header, index]));
  return {
    ign: map.get(mapping.ign) ?? -1,
    value: map.get(mapping.value) ?? -1,
    date: map.get(mapping.date) ?? -1,
  };
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

  const formData = await request.formData();
  const typeValue = String(formData.get("type") ?? "");
  const typeResult = typeSchema.safeParse(typeValue);

  if (!typeResult.success) {
    return NextResponse.json(
      { error: "Tipo de importacion no soportado" },
      { status: 400 }
    );
  }

  const type = typeResult.data;

  if (type === "ocr") {
    return NextResponse.json({ message: "OCR proximamente" });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Falta archivo" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { headers, rows } = readSheet(buffer);

  const mappingPayload = formData.get("mapping");
  let mapping: ColumnMapping | null = null;

  if (mappingPayload) {
    try {
      mapping = mappingSchema.parse(JSON.parse(String(mappingPayload))) as ColumnMapping;
    } catch (error) {
      return NextResponse.json({ error: "Mapeo invalido" }, { status: 400 });
    }
  } else {
    mapping = detectMapping(headers, type as "phase1" | "exploration");
  }

  if (!mapping) {
    return NextResponse.json({
      needsMapping: true,
      headers,
      sampleRows: rows.slice(0, 5),
    });
  }

  const indexes = buildIndex(headers, mapping);
  if (indexes.ign === -1 || indexes.value === -1 || indexes.date === -1) {
    return NextResponse.json(
      { error: "Faltan columnas requeridas en el mapeo" },
      { status: 400 }
    );
  }

  const existingPlayers = await db.player.findMany({
    where: { clanId },
  });
  const playerMap = new Map(
    existingPlayers.map((player) => [player.ign.toLowerCase(), player])
  );

  let playerCount = existingPlayers.length;
  const errors: string[] = [];
  const touchedPeriods = new Set<string>();

  for (const row of rows) {
    const ignRaw = row[indexes.ign];
    const valueRaw = row[indexes.value];
    const dateRaw = row[indexes.date];

    const ign = String(ignRaw ?? "").trim();
    if (!ign) {
      continue;
    }

    const date = parseDateValue(dateRaw);
    if (!date) {
      errors.push(`Fecha faltante o invalida para ${ign}`);
      continue;
    }

    const value = Number(valueRaw ?? 0);
    if (Number.isNaN(value)) {
      errors.push(`Valor faltante o invalido para ${ign}`);
      continue;
    }

    let player = playerMap.get(ign.toLowerCase());

    if (!player) {
      if (playerCount >= 40) {
        errors.push(`Limite de plantilla alcanzado. Se omite ${ign}`);
        continue;
      }

      player = await db.player.create({
        data: { clanId, ign },
      });
      playerMap.set(ign.toLowerCase(), player);
      playerCount += 1;
    }

    if (type === "phase1") {
      const week = getWeekRange(date);
      const period = await db.period.upsert({
        where: { clanId_startDate: { clanId, startDate: week.start } },
        create: {
          clanId,
          name: `Semana de ${week.start.toISOString().slice(0, 10)}`,
          startDate: week.start,
          endDate: week.end,
        },
        update: {},
      });

      await db.phase1Entry.upsert({
        where: { periodId_playerId: { periodId: period.id, playerId: player.id } },
        create: { periodId: period.id, playerId: player.id, value: Math.round(value) },
        update: { value: Math.round(value) },
      });

      touchedPeriods.add(period.id);
    } else {
      await db.explorationEntry.upsert({
        where: { playerId_date: { playerId: player.id, date } },
        create: { clanId, playerId: player.id, date, swords: Math.round(value) },
        update: { swords: Math.round(value) },
      });
    }
  }

  for (const periodId of touchedPeriods) {
    const data = await getPhase1Data(clanId, periodId);
    await db.period.update({
      where: { id: periodId },
      data: { phase1Top30Total: data.totalTop30 },
    });
  }

  return NextResponse.json({ ok: true, errors });
}
