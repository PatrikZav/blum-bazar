"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { review } from "@/db/schemas";
import { getSession } from "@/lib/auth";

export async function createReview(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Nejste přihlášeni." };

  const sellerId = formData.get("sellerId") as string;
  const listingId = formData.get("listingId") as string;
  const rating = formData.get("rating") as string;
  const comment = formData.get("comment") as string;
  const listingTitle = formData.get("listingTitle") as string;

  if (!sellerId || !rating) return { error: "Vyplňte hodnocení." };

  await db.insert(review).values({
    userId: session.id,
    sellerId: Number(sellerId),
    listingId: listingId ? Number(listingId) : null,
    rating: Number(rating),
    comment: comment || null,
    listingTitle: listingTitle || null,
  });

  revalidatePath(`/cs/inzeraty/${listingId}`);
}

export async function getSellerStats(sellerId: number) {
  const reviews = await db.select().from(review).where(eq(review.sellerId, sellerId));

  const count = reviews.length;
  const avg = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  return { count, avg };
}
