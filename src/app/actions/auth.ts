// Tento soubor má na starosti přihlašování, registraci a odhlašování uživatelů.
"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { user } from "@/db/schemas";

export async function register(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !email || !password) return { error: "Vyplňte všechna pole." };

  const existing = await db.select().from(user).where(eq(user.email, email));
  if (existing.length > 0) return { error: "Účet s tímto e-mailem již existuje." };

  const hashed = await bcrypt.hash(password, 10);

  const result = await db
    .insert(user)
    .values({
      firstName,
      lastName,
      email,
      password: hashed,
    })
    .returning();

  const newUser = result[0];
  const cookieStore = await cookies();
  cookieStore.set("userId", String(newUser.id), { httpOnly: true, path: "/" });

  redirect("/cs");
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Vyplňte e-mail a heslo." };

  const result = await db.select().from(user).where(eq(user.email, email));
  const found = result[0];

  if (!found) return { error: "Účet s tímto e-mailem neexistuje." };

  const valid = await bcrypt.compare(password, found.password);
  if (!valid) return { error: "Špatné heslo." };

  const cookieStore = await cookies();
  cookieStore.set("userId", String(found.id), { httpOnly: true, path: "/" });

  redirect("/cs");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect("/cs");
}
