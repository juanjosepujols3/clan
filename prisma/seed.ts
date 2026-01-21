import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const db = new PrismaClient();

async function main() {
  const email = process.env.SEED_USER_EMAIL;
  const password = process.env.SEED_USER_PASSWORD;

  if (!email || !password) {
    console.log("SEED_USER_EMAIL and SEED_USER_PASSWORD are not set.");
    return;
  }

  const existing = await db.user.findUnique({ where: { email } });
  let user = existing;

  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10);
    user = await db.user.create({
      data: {
        email,
        name: "Seed Leader",
        passwordHash,
      },
    });
    console.log(`Created seed user ${email}`);
  }

  if (process.env.SEED_SAMPLE !== "true" || !user) {
    return;
  }

  const clanName = "Demo Clan";
  let clan = await db.clan.findUnique({ where: { name: clanName } });

  if (!clan) {
    clan = await db.clan.create({
      data: {
        name: clanName,
        memberships: { create: { userId: user.id } },
      },
    });
  } else {
    await db.clanMembership.upsert({
      where: { userId_clanId: { userId: user.id, clanId: clan.id } },
      create: { userId: user.id, clanId: clan.id },
      update: {},
    });
  }

  const existingPlayers = await db.player.findMany({ where: { clanId: clan.id } });
  if (existingPlayers.length === 0) {
    const names = [
      "Echo",
      "Nova",
      "Riven",
      "Sol",
      "Mara",
      "Zen",
      "Bolt",
      "Lyra",
      "Kite",
      "Vex",
    ];

    await db.player.createMany({
      data: names.map((ign) => ({ clanId: clan.id, ign })),
    });
  }

  console.log("Seed data complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
