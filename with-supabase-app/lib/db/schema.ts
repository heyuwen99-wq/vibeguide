import { pgTable, text, uuid, integer, decimal, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Users table - extends Supabase auth
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  projectCredits: integer('project_credits').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Payments table - records payment history
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  outTradeNo: text('out_trade_no').notNull().unique(), // Merchant order number
  tradeNo: text('trade_no'), // Zpay transaction number
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  credits: integer('credits').notNull(),
  type: text('type').notNull(), // alipay/wxpay
  status: text('status').notNull().default('pending'), // pending/success/failed
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Projects table - stores project data
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),

  // Step 1: Project description
  step1Description: text('step1_description'),

  // Step 2: Deep requirements
  step2Questions: jsonb('step2_questions'), // Array of AI-generated questions
  step2Answers: text('step2_answers'),

  // Step 3: Generated documents (Markdown)
  docUserJourney: text('doc_user_journey'),
  docPrd: text('doc_prd'),
  docFrontend: text('doc_frontend'),
  docBackend: text('doc_backend'),
  docDatabase: text('doc_database'),

  status: text('status').notNull().default('draft'), // draft/completed
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Type exports for use in application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
