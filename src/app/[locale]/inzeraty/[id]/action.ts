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
