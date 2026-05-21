/*Změní stav inzerátu a uloží do databáze*/
"use server";

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  const imageFile = formData.get("image") as File | null;

  if (!id || !title || !description || !category || !contact || !status) return;

  let imagePath: string | undefined;

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, "-")}`;
    const path = join(process.cwd(), "public", "uploads", filename);
    await writeFile(path, buffer);
    imagePath = `/uploads/${filename}`;
  }

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
      ...(imagePath ? { image: imagePath } : {}),
    })
    .where(eq(listing.id, Number(id)));

  revalidatePath(`/cs/inzeraty/${id}`);
  revalidatePath("/cs/inzeraty");
}

export async function deleteListing(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) return;

  await db.delete(listing).where(eq(listing.id, Number(id)));

  redirect("/cs/inzeraty");
}

export async function removeListingImage(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) return;

  const result = await db
    .select()
    .from(listing)
    .where(eq(listing.id, Number(id)));
  const item = result[0];

  if (item?.image) {
    const { unlink } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const filePath = join(process.cwd(), "public", item.image);
    await unlink(filePath).catch(() => {});
  }

  await db
    .update(listing)
    .set({ image: null })
    .where(eq(listing.id, Number(id)));

  revalidatePath(`/cs/inzeraty/${id}`);
}
