import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// ENUMS
// ============================================================================

export const adminRoleEnum = ['super_admin', 'platform_admin', 'restaurant_admin'] as const;
export type AdminRole = (typeof adminRoleEnum)[number];

export const subscriptionStatusEnum = ['none', 'active', 'past_due', 'cancelled'] as const;
export type SubscriptionStatus = (typeof subscriptionStatusEnum)[number];

// ============================================================================
// ADMINS TABLE
// ============================================================================

export const admins = sqliteTable('admins', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  role: text('role', { enum: adminRoleEnum }).notNull(),
  restaurant_id: text('restaurant_id').references((): typeof restaurants.id => restaurants.id, { onDelete: 'set null' }),
  is_active: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Admins relations
export const adminsRelations = relations(admins, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [admins.restaurant_id],
    references: [restaurants.id],
  }),
  sessions: many(sessions),
  auditEvents: many(auditEvents),
}));

// ============================================================================
// RESTAURANTS TABLE
// ============================================================================

export const restaurants = sqliteTable('restaurants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  is_active: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  payment_stage_enabled: integer('payment_stage_enabled', { mode: 'boolean' }).notNull().default(false),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Restaurants relations
export const restaurantsRelations = relations(restaurants, ({ one, many }) => ({
  settings: one(restaurantSettings, {
    fields: [restaurants.id],
    references: [restaurantSettings.restaurant_id],
  }),
  entitlements: one(entitlements, {
    fields: [restaurants.id],
    references: [entitlements.restaurant_id],
  }),
  admin: one(admins, {
    fields: [restaurants.id],
    references: [admins.restaurant_id],
  }),
  auditEvents: many(auditEvents),
}));

// ============================================================================
// RESTAURANT SETTINGS TABLE
// ============================================================================

export const restaurantSettings = sqliteTable('restaurant_settings', {
  id: text('id').primaryKey(),
  restaurant_id: text('restaurant_id').notNull().unique().references((): typeof restaurants.id => restaurants.id, { onDelete: 'cascade' }),
  payment_stage_enabled: integer('payment_stage_enabled', { mode: 'boolean' }).notNull().default(false),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Restaurant Settings relations
export const restaurantSettingsRelations = relations(restaurantSettings, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [restaurantSettings.restaurant_id],
    references: [restaurants.id],
  }),
}));

// ============================================================================
// SESSIONS TABLE
// ============================================================================

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  admin_id: text('admin_id').notNull().references((): typeof admins.id => admins.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expires_at: integer('expires_at', { mode: 'timestamp' }).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Sessions relations
export const sessionsRelations = relations(sessions, ({ one }) => ({
  admin: one(admins, {
    fields: [sessions.admin_id],
    references: [admins.id],
  }),
}));

// ============================================================================
// ENTITLEMENTS TABLE
// ============================================================================

export const entitlements = sqliteTable('entitlements', {
  id: text('id').primaryKey(),
  restaurant_id: text('restaurant_id').notNull().unique().references((): typeof restaurants.id => restaurants.id, { onDelete: 'cascade' }),
  is_paid: integer('is_paid', { mode: 'boolean' }).notNull().default(false),
  subscription_status: text('subscription_status', { enum: subscriptionStatusEnum }).notNull().default('none'),
  subscription_started_at: integer('subscription_started_at', { mode: 'timestamp' }),
  subscription_ends_at: integer('subscription_ends_at', { mode: 'timestamp' }),
  ads_enabled: integer('ads_enabled', { mode: 'boolean' }).notNull().default(true),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Entitlements relations
export const entitlementsRelations = relations(entitlements, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [entitlements.restaurant_id],
    references: [restaurants.id],
  }),
}));

// ============================================================================
// AUDIT EVENTS TABLE
// ============================================================================

export const auditEvents = sqliteTable('audit_events', {
  id: text('id').primaryKey(),
  event_type: text('event_type').notNull(),
  actor_id: text('actor_id').references((): typeof admins.id => admins.id, { onDelete: 'set null' }),
  target_type: text('target_type'),
  target_id: text('target_id'),
  details: text('details'), // JSON string
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Audit Events relations
export const auditEventsRelations = relations(auditEvents, ({ one }) => ({
  actor: one(admins, {
    fields: [auditEvents.actor_id],
    references: [admins.id],
  }),
  restaurant: one(restaurants, {
    fields: [auditEvents.target_id],
    references: [restaurants.id],
  }),
}));

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type Restaurant = typeof restaurants.$inferSelect;
export type NewRestaurant = typeof restaurants.$inferInsert;
export type RestaurantSetting = typeof restaurantSettings.$inferSelect;
export type NewRestaurantSetting = typeof restaurantSettings.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Entitlement = typeof entitlements.$inferSelect;
export type NewEntitlement = typeof entitlements.$inferInsert;
export type AuditEvent = typeof auditEvents.$inferSelect;
export type NewAuditEvent = typeof auditEvents.$inferInsert;