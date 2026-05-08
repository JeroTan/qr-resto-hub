import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import * as schema from "../src/server/db/schema";

function readText(path: string): string {
  return readFileSync(path, "utf8");
}

function readSchemaText(): string {
  const files = ["src/server/db/schema.ts"];
  const schemaDir = "src/server/db/schema";

  if (existsSync(schemaDir)) {
    files.push(
      ...readdirSync(schemaDir)
        .filter((file) => file.endsWith(".ts"))
        .map((file) => join(schemaDir, file)),
    );
  }

  return files.map((file) => readText(file)).join("\n");
}

function readMigrationSql(): string {
  const migrationsDir = "drizzle/migrations";
  expect(existsSync(migrationsDir), `${migrationsDir} should exist`).toBe(true);

  const migrationFiles = readdirSync(migrationsDir).filter((file) => file.endsWith(".sql"));
  expect(migrationFiles.length, "at least one generated migration SQL file").toBeGreaterThan(0);

  return migrationFiles.map((file) => readText(join(migrationsDir, file))).join("\n");
}

const requiredTables = {
  roles: "roles",
  adminUsers: "admin_users",
  adminSessions: "admin_sessions",
  restaurants: "restaurants",
  restaurantAdminAssignments: "restaurant_admin_assignments",
  tenantEntitlements: "tenant_entitlements",
  auditEvents: "audit_events",
} as const;

const forbiddenTableNames = [
  "paymongo_events",
  "paymongo_webhook_events",
  "ad_provider_states",
  "ad_impressions",
  "analytics_events",
  "menu_categories",
  "dishes",
  "dish_add_ons",
  "restaurant_tables",
  "chairs",
  "qr_codes",
  "orders",
  "order_items",
  "completed_orders",
  "anonymous_order_tokens",
  "customers",
  "customer_accounts",
] as const;

describe("Story 1.3 remote-first D1 configuration", () => {
  it("keeps D1 migration flows remote-only for dev and prod", () => {
    const packageJson = JSON.parse(readText("package.json")) as {
      scripts: Record<string, string>;
    };
    const wrangler = readText("wrangler.jsonc");
    const drizzleConfig = readText("drizzle.config.ts");

    expect(packageJson.scripts["db:migrate:dev"]).toContain("qr-resto-hub-dev");
    expect(packageJson.scripts["db:migrate:dev"]).toContain("--env dev");
    expect(packageJson.scripts["db:migrate:dev"]).toContain("--remote");
    expect(packageJson.scripts["db:migrate:prod"]).toContain("qr-resto-hub-prod");
    expect(packageJson.scripts["db:migrate:prod"]).toContain("--env prod");
    expect(packageJson.scripts["db:migrate:prod"]).toContain("--remote");

    for (const [name, script] of Object.entries(packageJson.scripts)) {
      if (name.includes("migrate")) {
        expect(script).not.toContain("--local");
        expect(script).not.toMatch(/\bpreview\b|\bstaging\b/);
      }
    }

    expect(wrangler).toContain('"dev"');
    expect(wrangler).toContain('"prod"');
    expect(wrangler).toContain('"remote": true');
    expect(wrangler).toContain('"migrations_dir": "drizzle/migrations"');
    expect(wrangler).not.toMatch(/"preview"|"staging"|--local/);
    expect(drizzleConfig).toContain("schema: './src/server/db/schema.ts'");
    expect(drizzleConfig).toContain("out: './drizzle/migrations'");
    expect(drizzleConfig).toContain("dialect: 'sqlite'");
  });
});

describe("Story 1.3 platform access schema", () => {
  it("exports the required initial D1 tables with plural snake_case names", () => {
    for (const [exportName, tableName] of Object.entries(requiredTables)) {
      expect(schema).toHaveProperty(exportName);
      expect(getTableName(schema[exportName as keyof typeof requiredTables])).toBe(tableName);
    }
  });

  it("defines required snake_case columns, indexes, and unique constraints", () => {
    const schemaText = readSchemaText();

    for (const tableName of Object.values(requiredTables)) {
      expect(schemaText).toMatch(new RegExp(`sqliteTable\\(\\s*"${tableName}"`));
      expect(schemaText).toContain('id: text("id")');
    }

    expect(schemaText).toContain('roleId: text("role_id")');
    expect(schemaText).toContain('adminUserId: text("admin_user_id")');
    expect(schemaText).toContain('adminUserRoleId: text("admin_user_role_id")');
    expect(schemaText).toContain('restaurantId: text("restaurant_id")');
    expect(schemaText).toContain('isSuperAdminOwner: integer("is_super_admin_owner"');
    expect(schemaText).toContain('metadataJson: text("metadata_json"');

    expect(schemaText).toContain("idx_admin_users_role_id");
    expect(schemaText).toContain("idx_admin_sessions_admin_user_id");
    expect(schemaText).toContain("idx_restaurant_admin_assignments_admin_user_role_id");
    expect(schemaText).toContain("idx_restaurant_admin_assignments_restaurant_id");
    expect(schemaText).toContain("idx_tenant_entitlements_restaurant_id");
    expect(schemaText).toContain("idx_audit_events_restaurant_id");

    expect(schemaText).toContain("uq_roles_key");
    expect(schemaText).toContain("uq_admin_users_email");
    expect(schemaText).toContain("uq_admin_users_id_role_id");
    expect(schemaText).toContain("uq_admin_users_super_admin_owner");
    expect(schemaText).toContain("uq_restaurants_slug");
    expect(schemaText).toContain("uq_restaurant_admin_assignments_admin_user_id");
    expect(schemaText).toContain("uq_restaurant_admin_assignments_restaurant_id");
    expect(schemaText).toContain("uq_tenant_entitlements_restaurant_id");
  });

  it("ties privileged flags and tenant assignments to their required roles", () => {
    const schemaText = readSchemaText();

    expect(schemaText).toContain("ck_admin_users_super_admin_owner_role");
    expect(schemaText).toContain("role_super_admin");
    expect(schemaText).toContain("fk_restaurant_admin_assignments_admin_user_role");
    expect(schemaText).toContain("ck_restaurant_admin_assignments_role");
    expect(schemaText).toContain("role_restaurant_admin");
  });

  it("contains only Story 1.3-owned tables", () => {
    const schemaText = readSchemaText();

    for (const forbiddenTable of forbiddenTableNames) {
      expect(schemaText).not.toContain(`sqliteTable("${forbiddenTable}"`);
      expect(schemaText).not.toContain(`"${forbiddenTable}"`);
    }
  });
});

describe("Story 1.3 generated migration SQL", () => {
  it("creates required tables and guardrail constraints", () => {
    const migrationSql = readMigrationSql();

    for (const tableName of Object.values(requiredTables)) {
      expect(migrationSql).toMatch(new RegExp(`CREATE TABLE .*${tableName}`));
    }

    expect(migrationSql).toContain("uq_admin_users_super_admin_owner");
    expect(migrationSql).toContain("ck_admin_users_super_admin_owner_role");
    expect(migrationSql).toContain("role_super_admin");
    expect(migrationSql).toContain("is_super_admin_owner");
    expect(migrationSql).toContain("admin_user_role_id");
    expect(migrationSql).toContain("FOREIGN KEY (`admin_user_id`,`admin_user_role_id`)");
    expect(migrationSql).toContain("REFERENCES `admin_users`(`id`,`role_id`)");
    expect(migrationSql).toContain("ck_restaurant_admin_assignments_role");
    expect(migrationSql).toContain("uq_restaurant_admin_assignments_admin_user_id");
    expect(migrationSql).toContain("uq_restaurant_admin_assignments_restaurant_id");
    expect(migrationSql).toContain("INSERT INTO");
    expect(migrationSql).toContain("super_admin");
    expect(migrationSql).toContain("platform_admin");
    expect(migrationSql).toContain("restaurant_admin");
  });

  it("does not create future story tables", () => {
    const migrationSql = readMigrationSql();

    for (const forbiddenTable of forbiddenTableNames) {
      expect(migrationSql).not.toMatch(new RegExp(`CREATE TABLE .*${forbiddenTable}`));
    }
  });
});
