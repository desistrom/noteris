import { pgTable, text, timestamp, integer, boolean, uuid, varchar, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// User table for authentication
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('admin'), // 'admin' or 'super_admin'
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Session table for Lucia Auth
export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

// Akta Templates table - stores template structure and content (manageable by super admin)
export const aktaTemplates = pgTable('akta_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  aktaType: varchar('akta_type', { length: 100 }).notNull().unique(), // e.g., 'pendirian_pt', 'jual_beli_tanah'
  category: varchar('category', { length: 100 }).notNull(), // e.g., 'Pendirian Perusahaan'
  name: varchar('name', { length: 255 }).notNull(), // e.g., 'Akta Pendirian PT'
  description: text('description'),
  content: text('content').notNull(), // Template content with placeholders like {{nama_perusahaan}}
  stages: jsonb('stages').notNull().default([]), // Array of stages: [{id, name, order}]
  version: integer('version').notNull().default(1),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Template Fields table - defines dynamic fields for each template
export const templateFields = pgTable('template_fields', {
  id: uuid('id').primaryKey().defaultRandom(),
  templateId: uuid('template_id').notNull().references(() => aktaTemplates.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(), // e.g., 'nama_perusahaan'
  label: varchar('label', { length: 255 }).notNull(), // e.g., 'Nama Perusahaan'
  type: varchar('type', { length: 50 }).notNull().default('text'), // text, textarea, number, date, select, multiselect, checkbox
  required: boolean('required').notNull().default(false),
  options: jsonb('options'), // For select fields: ["Option 1", "Option 2"]
  placeholder: varchar('placeholder', { length: 255 }),
  validation: text('validation'), // Regex or simple validation rule
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Akta table
export const aktas = pgTable('aktas', {
  id: uuid('id').primaryKey().defaultRandom(),
  aktaType: varchar('akta_type', { length: 100 }).notNull(),
  clientId: varchar('client_id', { length: 255 }).notNull(),
  clientName: varchar('client_name', { length: 255 }).notNull(),
  clientEmail: varchar('client_email', { length: 255 }),
  clientPhone: varchar('client_phone', { length: 50 }),
  formData: jsonb('form_data').notNull().default({}), // Stores filled form data
  templateVersion: integer('template_version').notNull().default(1),
  currentStage: varchar('current_stage', { length: 100 }).notNull().default('draft'),
  status: varchar('status', { length: 30 }).notNull().default('in_progress'), // draft, in_progress, review, completed, cancelled
  progress: integer('progress').notNull().default(0), // 0-100
  documentPath: text('document_path'), // Path to generated document
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Progress history table
export const progressHistory = pgTable('progress_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  aktaId: uuid('akta_id').notNull().references(() => aktas.id, { onDelete: 'cascade' }),
  stageId: varchar('stage_id', { length: 100 }).notNull(), // Stage ID
  stageName: varchar('stage_name', { length: 255 }).notNull(), // Stage name
  status: varchar('status', { length: 30 }).notNull(), // started, in_progress, completed, on_hold
  notes: text('notes'),
  completedBy: uuid('completed_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  progressHistory: many(progressHistory),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const aktaTemplatesRelations = relations(aktaTemplates, ({ many }) => ({
  fields: many(templateFields),
}));

export const templateFieldsRelations = relations(templateFields, ({ one }) => ({
  template: one(aktaTemplates, {
    fields: [templateFields.templateId],
    references: [aktaTemplates.id],
  }),
}));

export const aktasRelations = relations(aktas, ({ many }) => ({
  progressHistory: many(progressHistory),
}));

export const progressHistoryRelations = relations(progressHistory, ({ one }) => ({
  akta: one(aktas, {
    fields: [progressHistory.aktaId],
    references: [aktas.id],
  }),
}));
