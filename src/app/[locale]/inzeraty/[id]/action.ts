/* Změní stav inzerátu a uloží do databáze*/
"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { listing } from "@/db/schemas";

export async function updateStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  if (!id || !status) return;

  await db
    .update(listing)
    .set({ status })
    .where(eq(listing.id, Number(id)));

  revalidatePath(`/cs/inzeraty/${id}`);
}

export async function updateListing(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const isFree = formData.get("isFree") === "on";
  const category = formData.get("category") as string;
  const contact = formData.get("contact") as string;
  const status = formData.get("status") as string;

  if (!id || !title || !description || !category || !contact || !status) return;

  await db
    .update(listing)
    .set({
      title,
      description,
      price: isFree ? null : Number(price),
      isFree,
      category,
      contact,
      status,
    })
    .where(eq(listing.id, Number(id)));

  revalidatePath(`/cs/inzeraty/${id}`);
  revalidatePath("/cs/inzeraty");
}
