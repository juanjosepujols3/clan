import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { db } from "@/lib/db";

const signupSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = signupSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  const { name, email, password } = result.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await db.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Correo ya registrado" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
    },
  });

  return NextResponse.json({ id: user.id });
}
