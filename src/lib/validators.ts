import { z } from "zod";

export const clanCreateSchema = z.object({
  name: z.string().min(2).max(50),
  action: z.enum(["create", "join"]).optional(),
});

export const clanUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  allowClosedEdits: z.boolean().optional(),
  select: z.boolean().optional(),
});

export const memberCreateSchema = z.object({
  ign: z.string().min(2).max(30),
  isActive: z.boolean().optional(),
});

export const memberUpdateSchema = z.object({
  ign: z.string().min(2).max(30).optional(),
  isActive: z.boolean().optional(),
});

export const periodCreateSchema = z.object({
  startDate: z.string().optional(),
  name: z.string().min(2).optional(),
});

export const periodUpdateSchema = z.object({
  isClosed: z.boolean().optional(),
});

export const phase1UpsertSchema = z.object({
  periodId: z.string().min(1),
  entries: z
    .array(
      z.object({
        playerId: z.string().min(1),
        value: z.number().int().min(0),
      })
    )
    .min(1),
});

export const explorationUpsertSchema = z.object({
  date: z.string().min(1),
  entries: z
    .array(
      z.object({
        playerId: z.string().min(1),
        swords: z.number().int().min(0),
      })
    )
    .min(1),
});

export const compareSchema = z.object({
  rangeA: z.object({
    start: z.string().min(1),
    end: z.string().min(1),
  }),
  rangeB: z.object({
    start: z.string().min(1),
    end: z.string().min(1),
  }),
});

export const warningAckSchema = z.object({
  warningId: z.string().min(1),
});
