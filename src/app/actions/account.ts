// Tento soubor zajišťuje změnu hesla a smazání uživatelského účtu.
"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { user } from "@/db/schemas";
import { getSession } from "@/lib/auth";

export async function changePassword(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Nejste přihlášeni." };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Vyplňte všechna pole." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Nová hesla se neshodují." };
  }

  if (currentPassword === newPassword) {
    return { error: "Nové heslo je stejné jako to stávající." };
  }

  if (newPassword.length < 6) {
    return { error: "Heslo musí mít alespoň 6 znaků." };
  }

  const result = await db.select().from(user).where(eq(user.id, session.id));
  const found = result[0];
  if (!found) return { error: "Účet nenalezen." };

  const valid = await bcrypt.compare(currentPassword, found.password);
  if (!valid) return { error: "Současné heslo je nesprávné." };

  const hashed = await bcrypt.hash(newPassword, 10);
  await db.update(user).set({ password: hashed }).where(eq(user.id, session.id));

  return { success: true };
}

export async function deleteAccount(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Nejste přihlášeni." };

  const password = formData.get("password") as string;
  if (!password) return { error: "Zadejte heslo." };

  const result = await db.select().from(user).where(eq(user.id, session.id));
  const found = result[0];
  if (!found) return { error: "Účet nenalezen." };

  const valid = await bcrypt.compare(password, found.password);
  if (!valid) return { error: "Nesprávné heslo." };

  await db.delete(user).where(eq(user.id, session.id));

  const cookieStore = await cookies();
  cookieStore.delete("userId");

  redirect("/cs");
}
