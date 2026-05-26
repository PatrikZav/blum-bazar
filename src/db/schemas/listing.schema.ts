import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const listing = sqliteTable("listing", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int(),
  title: text().notNull(),
  description: text().notNull(),
  price: int(),
  isFree: int({ mode: "boolean" }).notNull().default(false),
  category: text().notNull(),
  status: text().notNull().default("Dostupné"),
  contact: text().notNull(),
  image: text(),
  accountNumber: text(),
  createdAt: int({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Listing = typeof listing.$inferSelect;
export type NewListing = typeof listing.$inferInsert;
