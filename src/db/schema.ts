import {
  mysqlTable,
  text,
  timestamp,
  boolean,
  varchar,
  char,
} from "drizzle-orm/mysql-core";

// Generate UUID function for MySQL
function generateUUID() {
  return crypto.randomUUID();
}

export const users = mysqlTable("users", {
  id: char("id", { length: 36 }).primaryKey().$defaultFn(generateUUID),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const persons = mysqlTable("persons", {
  id: char("id", { length: 36 }).primaryKey().$defaultFn(generateUUID),
  userId: char("user_id", { length: 36 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  relationship: varchar("relationship", { length: 100 }).notNull(),
  avatar: varchar("avatar", { length: 10 }).notNull().default("👤"),
  birthDate: varchar("birth_date", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = mysqlTable("categories", {
  id: char("id", { length: 36 }).primaryKey().$defaultFn(generateUUID),
  userId: char("user_id", { length: 36 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 20 }).notNull().default("#3b82f6"),
  icon: varchar("icon", { length: 10 }).notNull().default("📄"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documents = mysqlTable("documents", {
  id: char("id", { length: 36 }).primaryKey().$defaultFn(generateUUID),
  userId: char("user_id", { length: 36 }).notNull(),
  personId: char("person_id", { length: 36 }),
  categoryId: char("category_id", { length: 36 }),
  categoryName: varchar("category_name", { length: 255 }).notNull(),
  country: varchar("country", { length: 50 }).notNull().default("jordan"),
  issueDate: varchar("issue_date", { length: 20 }),
  expiryDate: varchar("expiry_date", { length: 20 }),
  documentNumber: varchar("document_number", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
