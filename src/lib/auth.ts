import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schemas";

export async function getSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;

  const result = await db
    .select()
    .from(user)
    .where(eq(user.id, Number(userId)));
  const found = result[0];
  if (!found) return null;

  return {
    id: found.id,
    firstName: found.firstName,
    lastName: found.lastName,
    email: found.email,
  };
}
