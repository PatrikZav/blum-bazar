// Zde jsou funkce pro administrátora, například pro správu uživatelů a jejich rolí.
"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schemas";
import { getSession, isAdmin } from "@/lib/auth";

export async function getAllUsers() {
  const admin = await isAdmin();
  if (!admin) return { error: "Nemáte oprávnění." };

  const session = await getSession();
  if (!session) return { error: "Nejste přihlášeni." };

  const users = await db
    .select({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    })
    .from(user);

  return { users };
}

export async function adminChangePassword(userId: number, newPassword: string) {
  const admin = await isAdmin();
  if (!admin) return { error: "Nemáte oprávnění." };

  if (!newPassword) {
    return { error: "Zadejte nové heslo." };
  }

  const result = await db.select().from(user).where(eq(user.id, userId));
  const found = result[0];
  if (!found) return { error: "Uživatel nenalezen." };

  const isSamePassword = await bcrypt.compare(newPassword, found.password);
  if (isSamePassword) {
    return { error: "Nové heslo je stejné jako to stávající." };
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await db.update(user).set({ password: hashed }).where(eq(user.id, userId));

  return { success: true };
}

export async function adminChangeRole(userId: number, newRole: string) {
  const admin = await isAdmin();
  if (!admin) return { error: "Nemáte oprávnění." };

  const session = await getSession();
  if (!session) return { error: "Nejste přihlášeni." };

  if (userId === session.id) {
    return { error: "Nemůžete změnit vlastní roli." };
  }

  if (newRole !== "user" && newRole !== "admin") {
    return { error: "Neplatná role." };
  }

  const result = await db.select().from(user).where(eq(user.id, userId));
  const found = result[0];
  if (!found) return { error: "Uživatel nenalezen." };

  await db.update(user).set({ role: newRole }).where(eq(user.id, userId));

  return { success: true };
}

export async function adminDeleteUser(userId: number) {
  const admin = await isAdmin();
  if (!admin) return { error: "Nemáte oprávnění." };

  const session = await getSession();
  if (!session) return { error: "Nejste přihlášeni." };

  if (userId === session.id) {
    return { error: "Nemůžete smazat vlastní účet přes správu uživatelů." };
  }

  const result = await db.select().from(user).where(eq(user.id, userId));
  const found = result[0];
  if (!found) return { error: "Uživatel nenalezen." };

  await db.delete(user).where(eq(user.id, userId));

  return { success: true };
}
