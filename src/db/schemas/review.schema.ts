import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const review = sqliteTable("review", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int().notNull(),
  sellerId: int().notNull(),
  listingId: int(),
  rating: int().notNull(),
  comment: text(),
  listingTitle: text(),
  createdAt: int({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Review = typeof review.$inferSelect;
