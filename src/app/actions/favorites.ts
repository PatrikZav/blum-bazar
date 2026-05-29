// Tento soubor se stará o přidávání a odebírání inzerátů do oblíbených.
"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { favorite } from "@/db/schemas";
import { getSession } from "@/lib/auth";

export async function toggleFavorite(listingId: number) {
  const session = await getSession();
  if (!session) return;

  const existing = await db
    .select()
    .from(favorite)
    .where(and(eq(favorite.userId, session.id), eq(favorite.listingId, listingId)));

  if (existing.length > 0) {
    await db.delete(favorite).where(and(eq(favorite.userId, session.id), eq(favorite.listingId, listingId)));
  } else {
    await db.insert(favorite).values({ userId: session.id, listingId });
  }

  revalidatePath("/cs/inzeraty");
}
