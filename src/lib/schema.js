import { pgTable, text, timestamp, integer, boolean, uuid, varchar, jsonb, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('admin'),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

export const aktaTemplates = pgTable('akta_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  aktaType: varchar('akta_type', { length: 100 }).notNull().unique(),
  category: varchar('category', { length: 100 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  content: text('content'),
  prefix: varchar('prefix', { length: 20 }).notNull().default('AKT'),
  templateFilePath: text('template_file_path'),
  templateFileName: varchar('template_file_name', { length: 255 }),
  templateFileSize: integer('template_file_size'),
  templateMime: varchar('template_mime', { length: 100 }),
  stages: jsonb('stages').notNull().default([]),
  version: integer('version').notNull().default(1),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const aktaCounters = pgTable('akta_counters', {
  id: uuid('id').primaryKey().defaultRandom(),
  prefix: varchar('prefix', { length: 20 }).notNull(),
  year: integer('year').notNull(),
  lastNumber: integer('last_number').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  uniq: unique('akta_counters_prefix_year_unique').on(t.prefix, t.year),
}));

export const templateFields = pgTable('template_fields', {
  id: uuid('id').primaryKey().defaultRandom(),
  templateId: uuid('template_id').notNull().references(() => aktaTemplates.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull().default('text'),
  required: boolean('required').notNull().default(false),
  options: jsonb('options'),
  placeholder: varchar('placeholder', { length: 255 }),
  validation: text('validation'),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aktas = pgTable('aktas', {
  id: uuid('id').primaryKey().defaultRandom(),
  trackingCode: varchar('tracking_code', { length: 50 }).notNull().unique(),
  aktaType: varchar('akta_type', { length: 100 }).notNull(),
  clientId: varchar('client_id', { length: 255 }).notNull(),
  clientName: varchar('client_name', { length: 255 }).notNull(),
  clientEmail: varchar('client_email', { length: 255 }),
  clientPhone: varchar('client_phone', { length: 50 }),
  formData: jsonb('form_data').notNull().default({}),
  templateVersion: integer('template_version').notNull().default(1),
  currentStage: varchar('current_stage', { length: 100 }).notNull().default('draft'),
  status: varchar('status', { length: 30 }).notNull().default('in_progress'),
  progress: integer('progress').notNull().default(0),
  documentPath: text('document_path'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const progressHistory = pgTable('progress_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  aktaId: uuid('akta_id').notNull().references(() => aktas.id, { onDelete: 'cascade' }),
  stageId: varchar('stage_id', { length: 100 }).notNull(),
  stageName: varchar('stage_name', { length: 255 }).notNull(),
  status: varchar('status', { length: 30 }).notNull(),
  notes: text('notes'),
  completedBy: uuid('completed_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  progressHistory: many(progressHistory),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const aktaTemplatesRelations = relations(aktaTemplates, ({ many }) => ({
  fields: many(templateFields),
}));

export const templateFieldsRelations = relations(templateFields, ({ one }) => ({
  template: one(aktaTemplates, { fields: [templateFields.templateId], references: [aktaTemplates.id] }),
}));

export const aktasRelations = relations(aktas, ({ many }) => ({
  progressHistory: many(progressHistory),
}));

export const progressHistoryRelations = relations(progressHistory, ({ one }) => ({
  akta: one(aktas, { fields: [progressHistory.aktaId], references: [aktas.id] }),
  completedByUser: one(users, { fields: [progressHistory.completedBy], references: [users.id] }),
}));
