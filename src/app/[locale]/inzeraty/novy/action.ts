/*Uloží inzeráty do databáze*/
"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { listing } from "@/db/schemas";

export async function createListing(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const isFree = formData.get("isFree") === "on";
  const category = formData.get("category") as string;
  const contact = formData.get("contact") as string;

  if (!title || !description || !category || !contact) return;
  if (!isFree && !price) return;

  await db.insert(listing).values({
    title,
    description,
    price: isFree ? null : Number(price),
    isFree,
    category,
    contact,
    status: "Dostupné",
  });

  redirect("/cs/inzeraty");
}
