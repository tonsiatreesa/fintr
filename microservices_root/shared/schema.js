const { z } = require("zod");
const { createInsertSchema } = require("drizzle-zod");
const { relations } = require("drizzle-orm");
const { 
  integer, 
  pgTable, 
  text, 
  timestamp,
} = require("drizzle-orm/pg-core");

const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

const insertAccountSchema = createInsertSchema(accounts);

const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

const insertCategorySchema = createInsertSchema(categories);

const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id").references(() => accounts.id, {
    onDelete: "cascade",
  }).notNull(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
});

const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  categories: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});

const connectedBanks = pgTable("connected_banks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  accessToken: text("access_token").notNull(),
});

const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  subscriptionId: text("subscription_id").notNull().unique(),
  status: text("status").notNull(),
});

module.exports = {
  accounts,
  accountsRelations,
  insertAccountSchema,
  categories,
  categoriesRelations,
  insertCategorySchema,
  transactions,
  transactionsRelations,
  insertTransactionSchema,
  connectedBanks,
  subscriptions,
};
