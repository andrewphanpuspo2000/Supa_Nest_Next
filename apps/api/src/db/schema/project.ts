import { PgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { organisations } from './organisations';
import { pgTable } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: uuid().defaultRandom().primaryKey(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organisations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  dbSchema: text('db_schema').notNull().unique(),
  projectUrl: text('project_url').notNull().unique(),
  anonKey: text('anon_key').notNull(),
  serviceRoleKey: text('service_role_key').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
