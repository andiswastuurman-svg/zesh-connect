import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const creatorProfiles = mysqlTable("creatorProfiles", {
  id: int("id").autoincrement().primaryKey(),
  displayName: varchar("displayName", { length: 120 }).notNull(),
  handle: varchar("handle", { length: 120 }).notNull().unique(),
  niche: varchar("niche", { length: 120 }).notNull(),
  location: varchar("location", { length: 120 }).notNull(),
  audienceSize: varchar("audienceSize", { length: 32 }).notNull(),
  engagementRate: varchar("engagementRate", { length: 16 }).notNull(),
  rateRange: varchar("rateRange", { length: 64 }).notNull(),
  platforms: text("platforms").notNull(),
  bio: text("bio"),
  managedBy: varchar("managedBy", { length: 120 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  brief: text("brief").notNull(),
  objective: varchar("objective", { length: 120 }).notNull(),
  status: mysqlEnum("status", ["draft", "active", "review", "completed"]).default("draft").notNull(),
  startAt: timestamp("startAt"),
  endAt: timestamp("endAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const libraryAssets = mysqlTable("libraryAssets", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  assetType: mysqlEnum("assetType", ["copy", "prompt", "code", "image", "brief"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreatorProfile = typeof creatorProfiles.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type LibraryAsset = typeof libraryAssets.$inferSelect;