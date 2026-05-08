import { sql } from "drizzle-orm";
import {
  check,
  foreignKey,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const ADMIN_ROLE_KEYS = ["super_admin", "platform_admin", "restaurant_admin"] as const;
export type AdminRoleKey = (typeof ADMIN_ROLE_KEYS)[number];

export const ADMIN_USER_STATUSES = ["active", "suspended"] as const;
export type AdminUserStatus = (typeof ADMIN_USER_STATUSES)[number];

export const RESTAURANT_STATUSES = ["pending_setup", "active", "suspended", "archived"] as const;
export type RestaurantStatus = (typeof RESTAURANT_STATUSES)[number];

export const ENTITLEMENT_PLAN_KEYS = ["free", "paid_no_ads"] as const;
export type EntitlementPlanKey = (typeof ENTITLEMENT_PLAN_KEYS)[number];

export const AD_POLICIES = ["ads_required", "ads_bypassed"] as const;
export type AdPolicy = (typeof AD_POLICIES)[number];

export const ENTITLEMENT_STATUSES = ["active", "past_due", "cancelled", "expired"] as const;
export type EntitlementStatus = (typeof ENTITLEMENT_STATUSES)[number];

const createdAt = () =>
  text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`);
const updatedAt = () =>
  text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`);

export const roles = sqliteTable(
  "roles",
  {
    id: text("id").primaryKey(),
    key: text("key", { enum: ADMIN_ROLE_KEYS }).notNull(),
    label: text("label").notNull(),
    createdAt: createdAt(),
  },
  (table) => [uniqueIndex("uq_roles_key").on(table.key)],
);

export const adminUsers = sqliteTable(
  "admin_users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "restrict", onUpdate: "cascade" }),
    status: text("status", { enum: ADMIN_USER_STATUSES }).notNull().default("active"),
    passwordHash: text("password_hash").notNull(),
    passwordSalt: text("password_salt").notNull(),
    isSuperAdminOwner: integer("is_super_admin_owner", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    suspendedAt: text("suspended_at"),
    lastLoginAt: text("last_login_at"),
  },
  (table) => [
    index("idx_admin_users_role_id").on(table.roleId),
    index("idx_admin_users_status").on(table.status),
    uniqueIndex("uq_admin_users_email").on(table.email),
    uniqueIndex("uq_admin_users_id_role_id").on(table.id, table.roleId),
    uniqueIndex("uq_admin_users_super_admin_owner")
      .on(table.isSuperAdminOwner)
      .where(sql`${table.isSuperAdminOwner} = 1`),
    check(
      "ck_admin_users_super_admin_owner_role",
      sql`${table.isSuperAdminOwner} = 0 OR ${table.roleId} = 'role_super_admin'`,
    ),
  ],
);

export const adminSessions = sqliteTable(
  "admin_sessions",
  {
    id: text("id").primaryKey(),
    adminUserId: text("admin_user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade", onUpdate: "cascade" }),
    sessionTokenHash: text("session_token_hash").notNull(),
    expiresAt: text("expires_at").notNull(),
    revokedAt: text("revoked_at"),
    createdAt: createdAt(),
    lastSeenAt: text("last_seen_at"),
  },
  (table) => [
    index("idx_admin_sessions_admin_user_id").on(table.adminUserId),
    index("idx_admin_sessions_expires_at").on(table.expiresAt),
    uniqueIndex("uq_admin_sessions_session_token_hash").on(table.sessionTokenHash),
  ],
);

export const restaurants = sqliteTable(
  "restaurants",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    status: text("status", { enum: RESTAURANT_STATUSES }).notNull().default("pending_setup"),
    paymentStageEnabled: integer("payment_stage_enabled", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("idx_restaurants_status").on(table.status),
    uniqueIndex("uq_restaurants_slug").on(table.slug),
  ],
);

export const restaurantAdminAssignments = sqliteTable(
  "restaurant_admin_assignments",
  {
    id: text("id").primaryKey(),
    adminUserId: text("admin_user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade", onUpdate: "cascade" }),
    restaurantId: text("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade", onUpdate: "cascade" }),
    adminUserRoleId: text("admin_user_role_id").notNull().default("role_restaurant_admin"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("idx_restaurant_admin_assignments_admin_user_id").on(table.adminUserId),
    index("idx_restaurant_admin_assignments_admin_user_role_id").on(table.adminUserRoleId),
    index("idx_restaurant_admin_assignments_restaurant_id").on(table.restaurantId),
    uniqueIndex("uq_restaurant_admin_assignments_admin_user_id").on(table.adminUserId),
    uniqueIndex("uq_restaurant_admin_assignments_restaurant_id").on(table.restaurantId),
    foreignKey({
      name: "fk_restaurant_admin_assignments_admin_user_role",
      columns: [table.adminUserId, table.adminUserRoleId],
      foreignColumns: [adminUsers.id, adminUsers.roleId],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    check(
      "ck_restaurant_admin_assignments_role",
      sql`${table.adminUserRoleId} = 'role_restaurant_admin'`,
    ),
  ],
);

export const tenantEntitlements = sqliteTable(
  "tenant_entitlements",
  {
    id: text("id").primaryKey(),
    restaurantId: text("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade", onUpdate: "cascade" }),
    planKey: text("plan_key", { enum: ENTITLEMENT_PLAN_KEYS }).notNull().default("free"),
    adPolicy: text("ad_policy", { enum: AD_POLICIES }).notNull().default("ads_required"),
    status: text("status", { enum: ENTITLEMENT_STATUSES }).notNull().default("active"),
    currentPeriodEndsAt: text("current_period_ends_at"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("idx_tenant_entitlements_restaurant_id").on(table.restaurantId),
    index("idx_tenant_entitlements_status").on(table.status),
    uniqueIndex("uq_tenant_entitlements_restaurant_id").on(table.restaurantId),
  ],
);

export const auditEvents = sqliteTable(
  "audit_events",
  {
    id: text("id").primaryKey(),
    category: text("category").notNull(),
    action: text("action").notNull(),
    actorAdminUserId: text("actor_admin_user_id").references(() => adminUsers.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    restaurantId: text("restaurant_id").references(() => restaurants.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    targetType: text("target_type"),
    targetId: text("target_id"),
    requestId: text("request_id"),
    metadataJson: text("metadata_json", { mode: "json" }).$type<Record<string, unknown>>(),
    occurredAt: text("occurred_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_audit_events_category").on(table.category),
    index("idx_audit_events_actor_admin_user_id").on(table.actorAdminUserId),
    index("idx_audit_events_restaurant_id").on(table.restaurantId),
    index("idx_audit_events_occurred_at").on(table.occurredAt),
  ],
);

export const schema = {
  roles,
  adminUsers,
  adminSessions,
  restaurants,
  restaurantAdminAssignments,
  tenantEntitlements,
  auditEvents,
};

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
export type AdminSession = typeof adminSessions.$inferSelect;
export type NewAdminSession = typeof adminSessions.$inferInsert;
export type Restaurant = typeof restaurants.$inferSelect;
export type NewRestaurant = typeof restaurants.$inferInsert;
export type RestaurantAdminAssignment = typeof restaurantAdminAssignments.$inferSelect;
export type NewRestaurantAdminAssignment = typeof restaurantAdminAssignments.$inferInsert;
export type TenantEntitlement = typeof tenantEntitlements.$inferSelect;
export type NewTenantEntitlement = typeof tenantEntitlements.$inferInsert;
export type AuditEventRow = typeof auditEvents.$inferSelect;
export type NewAuditEventRow = typeof auditEvents.$inferInsert;
