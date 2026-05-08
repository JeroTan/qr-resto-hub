# Story 1.3: Configure Remote-First D1 Schema and Migrations for Platform Accounts

Status: done

## Story

As a developer,
I want remote-first D1 migration setup plus the initial account, role, session, tenant, restaurant, minimal entitlement visibility, and audit tables needed for platform access,
so that authentication and administration have a stable data foundation.

## Acceptance Criteria

1. Given the project foundation and Story 1.2 source structure exist, when initial database schema and migrations are added, then Drizzle schema and migration configuration support dev and prod remote D1 environments only.
2. Tables use plural `snake_case` names, `snake_case` columns, `id` primary keys, `{entity}_id` foreign keys, `idx_{table}_{columns}` indexes, and `uq_{table}_{columns}` unique constraints.
3. Schema supports Super Admin, Platform Admin, Restaurant Admin, roles, sessions, restaurant tenants, one Restaurant Admin to one restaurant in MVP, minimal subscription/ad entitlement visibility for account and tenant status screens, and audit event recording.
4. Schema and constraints support seeding exactly one Super Admin owner account without storing real seed credentials in source-controlled migrations.
5. Schema supports server-side tenant scoping for protected Restaurant Admin capabilities.
6. PayMongo subscription event tables, ad provider state tables, detailed analytics tables, menu tables, seating tables, QR tables, and order tables are not created in this story.
7. Tests prove migration/schema guardrails, naming conventions, dev/prod remote-only migration scripts, Super Admin owner uniqueness, Restaurant Admin one-to-one tenant assignment, tenant scoping columns, and forbidden table exclusions.

## Tasks / Subtasks

- [x] Add red Vitest schema/migration guardrail tests before implementation. (AC: 1-7)
  - [x] Verify `drizzle.config.ts`, `wrangler.jsonc`, and `package.json` expose only dev/prod remote D1 migration flows and do not add staging, preview, or local-only migration scripts.
  - [x] Verify schema exports required tables and uses plural `snake_case` table names/columns, `id` primary keys, `*_id` foreign keys, `idx_*` indexes, and `uq_*` unique constraints.
  - [x] Verify role/account/session/restaurant/entitlement/audit tables exist and forbidden future-owned tables do not exist.
  - [x] Verify uniqueness constraints model exactly one Super Admin owner and one Restaurant Admin assigned to one restaurant in MVP.
- [x] Implement Drizzle D1 schema for platform access foundation. (AC: 2-5)
  - [x] Replace current empty `src/server/db/schema.ts` with typed Drizzle SQLite/D1 schema exports, or split into `src/server/db/schema/*.ts` and re-export from `schema.ts` if that keeps the file readable.
  - [x] Add `roles` with fixed keys for `super_admin`, `platform_admin`, and `restaurant_admin`.
  - [x] Add `admin_users` for all dashboard/admin accounts with email, role, status, password hash placeholder fields, owner flag, audit timestamps, and no customer account columns.
  - [x] Add `admin_sessions` with hashed session token, expiry, revoke tracking, and last-seen data for Story 1.4 auth.
  - [x] Add `restaurants` for restaurant tenant identity/profile minimum required by admin onboarding and tenant scoping.
  - [x] Add `restaurant_admin_assignments` to enforce MVP one Restaurant Admin to one restaurant through unique constraints.
  - [x] Add `tenant_entitlements` or equivalent minimal table for free/paid/ad visibility status; do not add PayMongo event/provider tables yet.
  - [x] Add `audit_events` with actor, target, restaurant/tenant context, category/action, request ID, metadata JSON, and timestamp fields.
- [x] Generate and review initial migration SQL. (AC: 1-6)
  - [x] Use Drizzle Kit to generate SQL into the Wrangler-configured `drizzle/migrations` directory.
  - [x] Ensure migration SQL creates only Story 1.3 tables/indexes/constraints and static non-secret role seed rows if needed.
  - [x] Do not apply migrations to remote Cloudflare from the dev agent unless the human explicitly asks.
- [x] Harden migration scripts/config for remote-first D1. (AC: 1)
  - [x] Keep `wrangler.jsonc` D1 bindings under only `env.dev` and `env.prod`, each with `remote: true` and `migrations_dir: "drizzle/migrations"`.
  - [x] Keep migration apply scripts using database names `qr-resto-hub-dev` and `qr-resto-hub-prod`, `--env dev|prod`, and `--remote`.
  - [x] Add safe generation/listing scripts only if useful; do not add `--local`, preview DB, staging DB, or alternate migration source of truth.
- [x] Add developer-facing DB client/repository foundation only where it helps future stories. (AC: 3-5)
  - [x] If adding `src/server/db/client.ts`, keep it a thin D1/Drizzle adapter and keep domain logic out.
  - [x] If adding repository placeholders, keep them under `src/server/repositories/**` and dependency-inject D1/Drizzle; do not query D1 from domain modules.
- [x] Validate and update story record. (AC: 1-7)
  - [x] Run `npm test`.
  - [x] Run `npm run typecheck`.
  - [x] Run `npm run build`.
  - [x] Run touched-file Prettier check.
  - [x] Search schema/migration/config files for forbidden future-owned table names and customer food-order PayMongo checkout wiring.

### Review Findings

- [x] [Review][Patch] Super Admin owner flag is not constrained to Super Admin role [src/server/db/schema.ts:42] - fixed with `ck_admin_users_super_admin_owner_role`.
- [x] [Review][Patch] Restaurant Admin assignment table accepts non-Restaurant Admin users [src/server/db/schema.ts:110] - fixed with assignment role sentinel, composite FK, and `ck_restaurant_admin_assignments_role`.

## Dev Notes

### Scope Boundary

Story 1.3 owns the first D1/Drizzle schema and migration foundation only. It must not implement login/logout, password hashing, real Super Admin credential seeding, RBAC middleware behavior, account CRUD APIs, restaurant profile UI, menu/seating/QR/order/subscription provider behavior, PayMongo webhooks, AdSense provider state, analytics dashboards, or customer accounts.

Story 1.4 owns applying the real Super Admin seed, Workers-compatible password hashing with pepper, dashboard login/logout, secure session cookie behavior, and auth routes. Story 1.5 owns enforcing RBAC and tenant guards. This story creates the persistence shape those stories need.

### Current Implementation State

- `src/server/db/schema.ts` currently exports nothing; Story 1.3 should replace it or turn it into the schema barrel.
- `drizzle.config.ts` currently points to `./src/server/db/schema.ts`, outputs to `./drizzle/migrations`, and uses SQLite dialect.
- `wrangler.jsonc` already has dev/prod D1 bindings with `remote: true` and `migrations_dir: "drizzle/migrations"`.
- `package.json` already has remote migration apply scripts: `db:migrate:dev` and `db:migrate:prod`.
- Story 1.2 established API/domain/repository boundaries, response helpers, audit/logging primitives, request ID helpers, and the Astro/Elysia bridge.
- Story 1.2 is still in `review`, but its review patch for the Astro/Elysia bridge was marked fixed. Do not revert Story 1.2 files or generated context.

### Required Schema Shape

Use Drizzle SQLite/D1 schema under `src/server/db/**`. Recommended minimum tables:

- `roles`: fixed admin roles. Columns: `id`, `key`, `label`, `created_at`.
- `admin_users`: all dashboard/admin users. Columns: `id`, `email`, `role_id`, `status`, `password_hash`, `password_salt`, `is_super_admin_owner`, `created_at`, `updated_at`, `suspended_at`, `last_login_at`.
- `admin_sessions`: D1-backed admin sessions. Columns: `id`, `admin_user_id`, `session_token_hash`, `expires_at`, `revoked_at`, `created_at`, `last_seen_at`.
- `restaurants`: restaurant tenant identity. Columns: `id`, `name`, `slug`, `status`, `payment_stage_enabled`, `created_at`, `updated_at`.
- `restaurant_admin_assignments`: MVP one-to-one join. Columns: `id`, `admin_user_id`, `restaurant_id`, `created_at`, `updated_at`.
- `tenant_entitlements`: minimal account/status visibility. Columns: `id`, `restaurant_id`, `plan_key`, `ad_policy`, `status`, `current_period_ends_at`, `created_at`, `updated_at`.
- `audit_events`: persistent audit trail. Columns: `id`, `category`, `action`, `actor_admin_user_id`, `restaurant_id`, `target_type`, `target_id`, `request_id`, `metadata_json`, `occurred_at`.

Naming and constraints:

- Table names plural `snake_case`.
- Columns `snake_case`; TypeScript properties may use camelCase with column aliases only if generated SQL remains `snake_case`.
- Primary key column is always `id`.
- Foreign key columns use `{entity}_id`.
- Index names use `idx_{table}_{columns}`.
- Unique names use `uq_{table}_{columns}`.
- Use a unique/partial unique strategy for exactly one Super Admin owner. Preferred: `admin_users.is_super_admin_owner` boolean/int plus a partial unique index for rows where owner flag is true, if Drizzle/SQLite generation supports it cleanly. If not, use a small dedicated ownership table with a single constant key and explain why.
- Enforce Restaurant Admin one-to-one MVP through unique constraints on `restaurant_admin_assignments.admin_user_id` and `restaurant_admin_assignments.restaurant_id`.
- Include tenant scoping through `restaurant_id` on restaurant-owned foundation tables and audit events where applicable.

### Remote-First D1 Guardrails

- D1 migrations are remote-first and limited to dev/prod environments. No staging, preview, local-only migration source of truth, or local migration apply script should be introduced. [Source: `_bmad-output/planning-artifacts/epics.md#Story 1.3`; `_bmad-output/planning-artifacts/architecture.md#Infrastructure & Deployment`]
- Cloudflare D1 migration files are SQL files in the configured migrations folder; Wrangler can customize `migrations_dir` inside the D1 binding. [Source: Cloudflare D1 migrations docs: https://developers.cloudflare.com/d1/reference/migrations/]
- Wrangler `d1 migrations apply [DATABASE]` supports `--env` and `--remote`; use database names rather than mutable binding names for apply scripts. [Source: Cloudflare D1 Wrangler commands: https://developers.cloudflare.com/d1/wrangler-commands/]
- Do not run `wrangler d1 migrations apply` from dev-story without explicit human approval because it mutates remote databases.
- Drizzle Kit `generate` reads schema snapshots and writes SQL migration files under the configured migration folder. [Source: Drizzle Kit generate docs: https://orm.drizzle.team/docs/drizzle-kit-generate]

### Drizzle/D1 Implementation Guardrails

- Use `drizzle-orm/sqlite-core` for D1-compatible schema: `sqliteTable`, `text`, `integer`, `index`, `uniqueIndex`, and foreign keys where supported.
- Drizzle SQLite columns map to SQLite storage classes such as `INTEGER` and `TEXT`; use integer boolean mode for booleans where appropriate. [Source: Drizzle SQLite column docs: https://orm.drizzle.team/docs/column-types/sqlite]
- Drizzle supports Cloudflare D1 and mirrors SQLite-like query methods. Keep runtime D1/Drizzle adapter code in `src/server/db/**` or repositories; do not import Cloudflare bindings into domain modules. [Source: Drizzle Cloudflare D1 docs: https://orm.drizzle.team/docs/connect-cloudflare-d1]
- Database fields remain `snake_case`; API/domain DTOs use `camelCase`. [Source: `_bmad-output/planning-artifacts/architecture.md#Naming Patterns`]

### Forbidden Tables This Story

Do not create these tables or equivalents in Story 1.3:

- PayMongo subscription event tables or webhook event tables.
- Ad provider state/impression/click/block-detection tables.
- Detailed analytics/statistics tables.
- Menu/category/dish/add-on tables.
- Seating/table/chair/QR token tables.
- Active order, order item, completed order, or anonymous customer order token tables.
- Customer identity/account tables.

Minimal entitlement visibility is allowed only to support account/tenant status screens and future ad/subscription gating. Provider-specific PayMongo and AdSense details belong to Epic 7.

### Previous Story Intelligence

Story 1.2 established:

- Route -> Controller -> Service -> Domain/Repository boundaries.
- Public API envelopes in `src/lib/api/response.ts` and TypeBox/OpenAPI response schemas in `src/lib/typebox/api.ts`.
- Audit category primitives in `src/domain/audit/index.ts` and operational logging types in `src/server/services/operational-logger.ts`.
- `src/server/repositories/**` exists for persistence code; `src/domain/**` must stay infrastructure-free.
- `src/lib/elysia/astroBridgeContext.ts` owns runtime Astro/Elysia request binding; `src/lib/elysia/decorationTypes.ts` owns decoration types/helpers.
- Touched Story 1.2 files pass Prettier, tests, typecheck, and build; repo-wide format check may still fail on pre-existing unrelated formatting.

### Testing Requirements

Use red/green/refactor:

- Add a focused schema/migration guardrail test file, for example `tests/story-1-3-d1-schema.test.ts`.
- Test table export names and generated Drizzle table names.
- Test naming convention text by reading `schema.ts` or schema modules where runtime Drizzle metadata is hard to inspect.
- Test package/Wrangler scripts/config for remote-only dev/prod D1 migration behavior.
- Test migration SQL exists after generation and does not include forbidden future-owned tables.
- Tests must not require live Cloudflare network or mutate remote D1.
- Run `npm test`, `npm run typecheck`, and `npm run build` before completion.

### References

- `_bmad-output/planning-artifacts/epics.md` - Story 1.3 acceptance criteria and Epic 1 sequence.
- `_bmad-output/planning-artifacts/architecture.md` - D1/Drizzle, naming, API, repository, and infrastructure boundaries.
- `_bmad-output/planning-artifacts/prd.md` - role/account, tenant, migration, privacy, and audit requirements.
- `_bmad-output/project-context.md` - critical implementation rules, D1 remote-first rule, no-`any` guidance, and Cloudflare env import guidance.
- `_bmad-output/implementation-artifacts/1-2-establish-ddd-api-middleware-lib-utils-and-component-structure.md` - previous story context, created files, and review learning.
- Cloudflare D1 migrations docs: https://developers.cloudflare.com/d1/reference/migrations/
- Cloudflare D1 Wrangler commands: https://developers.cloudflare.com/d1/wrangler-commands/
- Drizzle Cloudflare D1 docs: https://orm.drizzle.team/docs/connect-cloudflare-d1
- Drizzle Kit generate docs: https://orm.drizzle.team/docs/drizzle-kit-generate
- Drizzle SQLite column docs: https://orm.drizzle.team/docs/column-types/sqlite

## Dev Agent Record

### Agent Model Used

Codex (GPT-5)

### Debug Log References

- 2026-05-08T20:30:11+08:00 - Started dev-story implementation for Story 1.3 after loading Story, Epic 1, PRD, Architecture, and project context.
- 2026-05-08T20:31:05+08:00 - Confirmed Story 1.3 red guardrail tests failed against empty schema and missing migration.
- 2026-05-08T20:32:37+08:00 - Focused Story 1.3 schema/migration guardrail tests passed after implementation.
- 2026-05-08T20:33:31+08:00 - Final validation passed: `npm test`, `npm run typecheck`, `npm run build`, touched-file Prettier check, and scoped forbidden table/checkout scan.
- 2026-05-08T21:10:53+08:00 - Review patch validation passed: focused Story 1.3 test, `npm test`, `npm run typecheck`, and `npm run build`.
- 2026-05-08T21:11:20+08:00 - SQLite migration smoke passed: invalid Super Admin owner role and wrong-role Restaurant Admin assignment were rejected.

### Completion Notes List

- Story context created by BMad create-story workflow.
- Ultimate context engine analysis completed - comprehensive developer guide created.
- Added Story 1.3 red/green guardrail tests for remote-only D1 migration scripts, schema exports, naming conventions, uniqueness constraints, migration SQL, and forbidden future-owned table exclusions.
- Replaced the empty D1 schema with Drizzle SQLite/D1 tables for roles, admin users, sessions, restaurants, Restaurant Admin assignments, tenant entitlements, and audit events.
- Generated initial Drizzle migration SQL and added static non-secret role seed rows for Super Admin, Platform Admin, and Restaurant Admin.
- Added a thin `createDatabase` D1/Drizzle adapter under `src/server/db/client.ts` without leaking D1 into domain modules.
- Resolved code review patch findings by tying Super Admin ownership to the Super Admin role and requiring Restaurant Admin assignments to reference Restaurant Admin users.
- No remote D1 migrations were applied.

### File List

- _bmad-output/implementation-artifacts/1-3-configure-remote-first-d1-schema-and-migrations-for-platform-accounts.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- drizzle/migrations/0000_perpetual_scalphunter.sql
- drizzle/migrations/meta/0000_snapshot.json
- drizzle/migrations/meta/_journal.json
- src/server/db/client.ts
- src/server/db/schema.ts
- tests/story-1-3-d1-schema.test.ts

### Change Log

- 2026-05-08: Implemented Story 1.3 remote-first D1/Drizzle platform account schema foundation and moved story to review.
- 2026-05-08: Applied review patches for role-bound ownership and Restaurant Admin assignment constraints; moved story to done.
