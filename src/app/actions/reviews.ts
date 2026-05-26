"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { review, user } from "@/db/schemas";
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

export async function getSellerReviews(sellerId: number) {
  const reviews = await db.select().from(review).where(eq(review.sellerId, sellerId));

  const reviewsWithUsers = await Promise.all(
    reviews.map(async (r) => {
      const authorResult = await db.select().from(user).where(eq(user.id, r.userId));
      const author = authorResult[0];
      return {
        ...r,
        authorName: author ? `${author.firstName} ${author.lastName}` : "Anonymní",
      };
    }),
  );

  return reviewsWithUsers;
}

export async function getMyReviews() {
  const session = await getSession();
  if (!session) return [];

  const reviews = await db.select().from(review).where(eq(review.userId, session.id));

  const reviewsWithSellers = await Promise.all(
    reviews.map(async (r) => {
      const sellerResult = await db.select().from(user).where(eq(user.id, r.sellerId));
      const seller = sellerResult[0];
      return {
        ...r,
        sellerName: seller ? `${seller.firstName} ${seller.lastName}` : "Anonymní",
      };
    }),
  );

  return reviewsWithSellers;
}

export async function getReceivedReviews() {
  const session = await getSession();
  if (!session) return [];

  const reviews = await db.select().from(review).where(eq(review.sellerId, session.id));

  const reviewsWithAuthors = await Promise.all(
    reviews.map(async (r) => {
      const authorResult = await db.select().from(user).where(eq(user.id, r.userId));
      const author = authorResult[0];
      return {
        ...r,
        authorName: author ? `${author.firstName} ${author.lastName}` : "Anonymní",
      };
    }),
  );

  return reviewsWithAuthors;
}

export async function updateReview(reviewId: number, rating: number, comment: string, listingTitle: string) {
  const session = await getSession();
  if (!session) return { error: "Nejste přihlášeni." };

  const existing = await db
    .select()
    .from(review)
    .where(and(eq(review.id, reviewId), eq(review.userId, session.id)));

  if (existing.length === 0) return { error: "Recenze nenalezena." };

  await db
    .update(review)
    .set({ rating, comment: comment || null, listingTitle: listingTitle || null })
    .where(eq(review.id, reviewId));

  return { success: true };
}

export async function deleteReview(reviewId: number) {
  const session = await getSession();
  if (!session) return { error: "Nejste přihlášeni." };

  const existing = await db
    .select()
    .from(review)
    .where(and(eq(review.id, reviewId), eq(review.userId, session.id)));

  if (existing.length === 0) return { error: "Recenze nenalezena." };

  await db.delete(review).where(eq(review.id, reviewId));

  return { success: true };
}
