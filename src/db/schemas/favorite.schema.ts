import { int, sqliteTable } from "drizzle-orm/sqlite-core";

export const favorite = sqliteTable("favorite", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int().notNull(),
  listingId: int().notNull(),
});

export type Favorite = typeof favorite.$inferSelect;
