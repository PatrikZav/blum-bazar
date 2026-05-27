/*Uloží inzeráty do databáze*/
"use server";

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { listing } from "@/db/schemas";
import { getSession } from "@/lib/auth";

export async function createListing(formData: FormData) {
  const session = await getSession();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const isFree = formData.get("isFree") === "on";
  const category = formData.get("category") as string;
  const contact = formData.get("contact") as string;
  const imageFile = formData.get("image") as File | null;
  const imageUrl = formData.get("imageUrl") as string;
  const imageMode = formData.get("imageMode") as string;
  const accountNumber = formData.get("accountNumber") as string;
  const locationCity = formData.get("locationCity") as string;
  const locationLat = formData.get("locationLat") as string;
  const locationLng = formData.get("locationLng") as string;
  const locationRadius = formData.get("locationRadius") as string;

  if (!title || !description || !category || !contact) return;
  if (!isFree && !price) return;

  let imagePath: string | null = null;

  if (imageMode === "url" && imageUrl) {
    imagePath = imageUrl;
  } else if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, "-")}`;
    const path = join(process.cwd(), "public", "uploads", filename);
    await writeFile(path, buffer);
    imagePath = `/uploads/${filename}`;
  }

  await db.insert(listing).values({
    userId: session?.id ?? null,
    title,
    description,
    price: isFree ? null : Number(price),
    isFree,
    category,
    contact,
    status: "Dostupné",
    image: imagePath,
    accountNumber: accountNumber || null,
    locationCity: locationCity || null,
    locationLat: locationLat || null,
    locationLng: locationLng || null,
    locationRadius: locationRadius ? Number(locationRadius) : null,
  });

  redirect("/cs/inzeraty");
}
