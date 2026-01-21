import { db } from "@/lib/db";

export async function getSelectedClanId(userId: string): Promise<string | null> {
  const preference = await db.userPreference.findUnique({
    where: { userId },
  });
  if (preference?.selectedClanId) {
    const membership = await db.clanMembership.findUnique({
      where: { userId_clanId: { userId, clanId: preference.selectedClanId } },
    });
    if (membership) {
      return preference.selectedClanId;
    }
  }

  const membership = await db.clanMembership.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  if (!membership) {
    return null;
  }

  await db.userPreference.upsert({
    where: { userId },
    create: { userId, selectedClanId: membership.clanId },
    update: { selectedClanId: membership.clanId },
  });

  return membership.clanId;
}

export async function setSelectedClanId(userId: string, clanId: string) {
  await db.userPreference.upsert({
    where: { userId },
    create: { userId, selectedClanId: clanId },
    update: { selectedClanId: clanId },
  });
}

export async function ensureMembership(userId: string, clanId: string) {
  const membership = await db.clanMembership.findUnique({
    where: { userId_clanId: { userId, clanId } },
  });
  return membership !== null;
}
