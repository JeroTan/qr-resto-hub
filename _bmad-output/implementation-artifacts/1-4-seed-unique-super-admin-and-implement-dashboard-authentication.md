# Story 1.4: Seed Unique Super Admin and Implement Dashboard Authentication

Status: done

## Story

As a Super Admin or admin user,
I want secure login and logout with D1-backed sessions and a unique seeded Super Admin account,
so that protected dashboards are accessible only to valid platform users.

## Acceptance Criteria

1. Given the initial account/session schema exists, when the Super Admin seed is applied, then exactly one active Super Admin owner account exists.
2. Duplicate Super Admin owner creation is rejected or prevented by existing database constraints and seed idempotency.
3. Dashboard users can log in with valid credentials and receive an HttpOnly secure session cookie.
4. Dashboard users can log out and invalidate the active session.
5. Invalid credentials fail with a generic public message that does not reveal whether an email/account exists.
6. Password hashing is Workers-compatible and uses per-user salts plus configured secret pepper.
7. JWT signing and verification helpers use `jose` so token utilities work in the Cloudflare Workers runtime.
8. Seed and auth configuration use documented environment variables: `SEED_SUPER_ADMIN_EMAIL`, `SEED_SUPER_ADMIN_PASSWORD`, `AUTH_PASSWORD_PEPPER`, and `JWT_SECRET`.
9. Restaurant Admin, Platform Admin, and Super Admin sessions can be resolved server-side for protected requests.
10. Authentication failures and login/logout events are audit-ready.

## Tasks / Subtasks

- [x] Add red auth/seed tests before implementation. (AC: 1-10)
  - [x] Verify Super Admin seed inserts one active owner only and is idempotent.
  - [x] Verify duplicate owner attempts fail through schema constraints or seed guard logic.
  - [x] Verify password hashing uses random per-user salt plus `AUTH_PASSWORD_PEPPER`, never raw password storage.
  - [x] Verify valid login creates a hashed session row and secure cookie response.
  - [x] Verify invalid login response is generic for unknown email, wrong password, suspended user, and missing config.
  - [x] Verify logout revokes the active session and clears the cookie.
  - [x] Verify session resolver returns role/status/user context for active unexpired sessions and rejects expired/revoked/suspended sessions.
  - [x] Verify auth routes use TypeBox/Elysia schemas, OpenAPI metadata, and standardized API envelopes.
- [x] Harden Workers-compatible password and token helpers. (AC: 5-8)
  - [x] Replace or wrap `src/lib/crypto/hash.ts` with an auth-specific password hasher that uses Web Crypto PBKDF2 or equivalent Workers-compatible KDF, per-user random salt, configured pepper, iteration metadata, and constant-time verification where possible.
  - [x] Keep public password verification failures generic; do not leak hash parse errors, account existence, salt, pepper, or KDF internals.
  - [x] Keep `src/lib/crypto/jwt.ts` based on `jose`; normalize return types to project `Result` or safe `{ data, error }` shape without exposing token internals.
  - [x] Do not add Node-only password/JWT libraries such as `bcrypt`, `argon2`, `jsonwebtoken`, or `crypto` APIs unavailable in Workers.
- [x] Add seed configuration and seed service. (AC: 1, 2, 8, 10)
  - [x] Add config parsing for `SEED_SUPER_ADMIN_EMAIL`, `SEED_SUPER_ADMIN_PASSWORD`, `AUTH_PASSWORD_PEPPER`, and `JWT_SECRET`; Zod may be used here because this is non-Elysia config validation.
  - [x] Implement a Super Admin seed service under `src/server/services/**` or `src/server/db/**` that uses `createDatabase(env.DB)` and existing `roles` / `adminUsers` tables.
  - [x] Seed static role ids consistently with Story 1.3 migration values: `role_super_admin`, `role_platform_admin`, `role_restaurant_admin`.
  - [x] Use existing `ck_admin_users_super_admin_owner_role` and `uq_admin_users_super_admin_owner` constraints as last-line protection.
  - [x] Do not store real seed credentials in migrations, source files, tests, or docs.
  - [x] Record or emit audit-ready `auth.seed_super_admin` / `account.changed` style events through the Story 1.2 audit abstraction where practical.
- [x] Implement auth repository/service/controller boundary. (AC: 3-5, 9, 10)
  - [x] Add repository methods under `src/server/repositories/**` for admin lookup by normalized email, session insert, session lookup by hashed token, session revoke, and last login/last seen updates.
  - [x] Add service methods under `src/server/services/**` for login, logout, and session resolution. Services own credential checks and session lifecycle decisions.
  - [x] Add controllers under `src/server/controllers/**` that adapt HTTP input/output only, using `apiSuccess`, `apiError`, and `errorCodeToHttpStatus` helpers.
  - [x] Do not put credential checks, D1 queries, session hashing, or role decisions in Elysia route handlers.
- [x] Replace placeholder auth route metadata with real auth endpoints. (AC: 3-5, 7, 9)
  - [x] Update `src/server/routes/auth.routes.ts` to expose `POST /auth/login`, `POST /auth/logout`, and `GET /auth/session`.
  - [x] Use Elysia `t` / TypeBox schemas for body, headers/cookies where relevant, and response maps.
  - [x] Add OpenAPI `detail.summary`, `detail.description`, `tags: ["auth"]`, and auth/security metadata for protected routes where supported.
  - [x] Return standardized `{ data, meta }` and `{ error: { code, message, details } }` envelopes only.
- [x] Wire secure session cookies through the Astro/Elysia bridge. (AC: 3, 4, 9)
  - [x] Use the existing `astroCookies` bridge decoration from `src/lib/elysia/astroBridgeContext.ts`; do not mutate the module-scoped Elysia app per request.
  - [x] Set the session cookie as `HttpOnly`, `Secure`, `SameSite=Lax` or stricter, path `/`, with an explicit expiry/max age.
  - [x] Store only a random opaque session token in the cookie; store only its hash in D1.
  - [x] Logout must revoke the D1 session and clear the cookie with matching cookie attributes.
  - [x] Consider `Secure` behavior in local tests with explicit mock cookie assertions; do not weaken production cookie defaults.
- [x] Implement server-side session resolution foundation. (AC: 9)
  - [x] Update `src/middleware/auth-session.ts` or shared auth service helper so protected code can resolve the current admin user from the session cookie.
  - [x] Return role key, admin user id, account status, and assigned restaurant id if present.
  - [x] Keep RBAC/tenant permission enforcement out of this story except session context; Story 1.5 owns role and tenant guard behavior.
  - [x] Reject revoked, expired, missing, malformed, or suspended sessions through safe public errors.
- [x] Add optional dashboard shell pages only if needed to prove auth flow. (AC: 3, 4)
  - [x] If UI is added, keep it minimal and operational: login form and logout affordance only.
  - [x] Place Super Admin UI under `src/features/super-admin/**` or shared auth components only if reusable.
  - [x] Follow existing Tailwind tokens and shared primitives; no sparse marketing hero, no Apple-style product page.
- [x] Validate and update story record. (AC: 1-10)
  - [x] Run `npm test`.
  - [x] Run `npm run typecheck`.
  - [x] Run `npm run build`.
  - [x] Run touched-file Prettier check.
  - [x] Search auth/seed files for leaked seed passwords, raw password storage, Node-only auth libraries, and customer food-order PayMongo checkout wiring.

### Review Findings

- [x] [Review][Patch] Auth API route could not access Cloudflare runtime bindings through the Astro/Elysia bridge [src/pages/api/[...slug].ts:14] - fixed by importing `env` from `cloudflare:workers`, binding it as `runtimeEnv` per request, and extending `AstroBridgeDecorations` so auth routes can create D1-backed controllers while keeping OpenAPI composition stable.

- [x] [Review][Decision] Seed service has no runtime application path [src/server/services/super-admin-seed.service.ts:12] - resolved by adding local `seed:super-admin:dev` and `seed:super-admin:prod` commands that hash seed credentials locally, generate a temporary SQL file, execute it through Wrangler remote D1, then delete the temp file.
- [x] [Review][Patch] Auth route validation/runtime errors bypass the standardized API envelope [src/server/routes/auth.routes.ts:49] - fixed by adding app-level Elysia `onError` mapping for validation and unexpected route errors to standard API envelopes.
- [x] [Review][Patch] Malformed session expiry can be accepted [src/server/services/auth.service.ts:234] - fixed by requiring `expiresAt` to parse to a finite timestamp before accepting the session.
- [x] [Review][Patch] Local `/api/openapi` could fail from stale Vite optimized SSR dependency cache (`node_modules/.vite/deps_ssr/elysia.js`) - fixed by excluding `elysia` and `@elysiajs/openapi` from Vite dependency optimization in `astro.config.mjs`, clearing the stale cache, and verifying `/api/openapi` returns `200`.

## Dev Notes

### Scope Boundary

Story 1.4 owns Super Admin credential seeding, dashboard login/logout, D1-backed sessions, secure cookies, Workers-compatible password hashing, JWT helper hardening, and session resolution.

Story 1.5 owns role-based and tenant-scoped authorization enforcement. Story 1.6 owns Super Admin management of Platform Admin accounts and ownership transfer. Story 1.7 owns Platform Admin management of Restaurant Admin accounts. Do not implement account CRUD, ownership transfer UI, tenant guard policy, restaurant settings, menu/seating/orders/subscriptions, or PayMongo customer checkout in this story.

### Current Implementation State

- `src/server/db/schema.ts` already defines `roles`, `admin_users`, `admin_sessions`, `restaurants`, `restaurant_admin_assignments`, `tenant_entitlements`, and `audit_events`.
- Existing role ids seeded by migration are `role_super_admin`, `role_platform_admin`, and `role_restaurant_admin`.
- `admin_users` has `email`, `role_id`, `status`, `password_hash`, `password_salt`, `is_super_admin_owner`, timestamps, and last login fields.
- `admin_sessions` stores `session_token_hash`, expiry, revoked timestamp, created timestamp, and last seen timestamp.
- Existing constraints already protect Super Admin owner uniqueness and owner role validity: `uq_admin_users_super_admin_owner` and `ck_admin_users_super_admin_owner_role`.
- Existing constraints protect Restaurant Admin assignment role validity: `fk_restaurant_admin_assignments_admin_user_role` and `ck_restaurant_admin_assignments_role`.
- `src/server/db/client.ts` exposes `createDatabase(db: D1Database)`; use this for repositories/services instead of importing raw D1 in domain modules.
- `src/server/routes/auth.routes.ts` is currently only a metadata route. Replace it with real auth endpoints while keeping route handlers thin.
- `src/middleware/auth-session.ts`, `tenant-context.ts`, and `role-guard.ts` are placeholders. This story may implement session resolution in `auth-session.ts`; leave tenant/role enforcement to Story 1.5.
- `src/lib/crypto/hash.ts` is a generic SHA-256 salt helper. It is not sufficient for credential storage because Story 1.4 requires peppered password hashing with auth-focused tests.
- `src/lib/crypto/jwt.ts` already uses `jose` but should be formatted/hardened before use in auth behavior.
- `.env.example` already documents `SEED_SUPER_ADMIN_EMAIL`, `SEED_SUPER_ADMIN_PASSWORD`, `AUTH_PASSWORD_PEPPER`, and `JWT_SECRET`; keep placeholders only.
- Story 1.2 fixed the Astro/Elysia per-request decoration issue. Keep the module-scoped `createApp()` pattern and use request-bound `astroCookies`.

### Required Auth Model

- Login body: email + password.
- Email handling: normalize for lookup (`trim().toLowerCase()`), but keep public error generic.
- Session cookie: opaque random token, not JWT and not user id. Store hash only in `admin_sessions.session_token_hash`.
- Session expiration: explicit expiry in D1 and cookie. Use one consistent duration constant.
- Logout: resolve active cookie token, hash it, set `revoked_at`, and clear cookie.
- Session resolver: read cookie, hash token, join session to admin user and role, reject expired/revoked/suspended users, update last seen when appropriate.
- JWT helpers: use `jose` only for token utilities if needed; do not replace opaque session cookie with a JWT unless the implementation gives a clear reason and still meets D1-backed session invalidation.
- Audit-ready events: login success, login failure, logout, seed created, seed skipped/idempotent, session rejected. Use safe metadata only; never include passwords, pepper, raw tokens, session token hashes, or JWTs.

### API Contract Requirements

Recommended endpoints:

- `POST /api/auth/login`
  - body: `{ email: string, password: string }`
  - success: `{ data: { adminUser: { id, email, roleKey, status }, session: { expiresAt } }, meta }`
  - errors: `400`, `401`, `403`, `500`; all use standard error envelope.
- `POST /api/auth/logout`
  - reads current session cookie.
  - success: `{ data: { loggedOut: true }, meta }`
  - should be idempotent enough that missing/expired session does not leak detail.
- `GET /api/auth/session`
  - reads current session cookie.
  - success: `{ data: { authenticated: true, adminUser, restaurantAssignment? }, meta }`
  - unauthenticated: standard `401` error envelope.

Use Elysia `t` schemas and `src/lib/typebox/api.ts` response helpers. Use `src/lib/api/response.ts` and `src/lib/api/errors.ts` for runtime envelopes/status mapping.

### Security Guardrails

- Do not expose whether an email exists, account is suspended, password is wrong, seed config is missing, hash parse failed, or a token failed verification.
- Do not log or audit raw passwords, raw session tokens, session token hashes, pepper, JWT secret, or seed credentials.
- Use `crypto.getRandomValues` / `crypto.randomUUID` where available for salts and session tokens.
- Use Web Crypto APIs available in Workers; avoid Node `crypto`, `bcrypt`, `argon2`, and `jsonwebtoken`.
- Prefer PBKDF2 through `crypto.subtle` for current Worker compatibility if no approved KDF library is added. Store enough metadata to verify future hashes.
- Cookie attributes must be production safe: `HttpOnly`, `Secure`, `SameSite=Lax` or stricter, path `/`, explicit expiry/max age.
- Preserve the existing D1 remote-first rule. Do not apply remote migrations unless the human explicitly asks.

### Latest Technical Notes

- Cloudflare Workers support binding access via environment bindings and secrets; keep real secret values out of source control and `.env.example`. [Source: Cloudflare Workers environment variables and secrets docs: https://developers.cloudflare.com/workers/configuration/environment-variables/]
- Astro endpoint handlers can set cookies through `Astro.cookies.set()` / `ctx.cookies`, including attributes needed for session cookies. [Source: Astro cookies API docs: https://docs.astro.build/en/reference/api-reference/#astrocookies]
- Web Crypto `SubtleCrypto` supports PBKDF2 key derivation in browser/Worker-compatible runtimes; use this rather than Node-only hashing APIs. [Source: MDN SubtleCrypto deriveBits docs: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveBits]
- OWASP password storage guidance supports salted password hashing and peppering when the pepper is stored separately from password hashes. [Source: OWASP Password Storage Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html]
- `jose` is already the approved JWT library in project docs and package dependencies; keep JWT utilities Workers-compatible. [Source: `package.json`; `_bmad-output/planning-artifacts/architecture.md#Authentication & Security`]

### Previous Story Intelligence

- Story 1.2 created Route -> Controller -> Service -> Domain/Repository boundaries, standardized API envelopes, TypeBox/OpenAPI response helpers, request ID helper, audit primitives, operational logger primitives, and the safe Astro/Elysia bridge.
- Story 1.2 review fixed the Elysia app mutation issue. Do not call `.derive()` on the shared app per request; use `src/lib/elysia/astroBridgeContext.ts`.
- Story 1.2 fixed `zodArrayMinMax`; Zod remains allowed for non-Elysia config/internal helpers only.
- Story 1.3 created the auth persistence foundation and migration. It did not apply remote D1 migrations from the dev agent.
- Story 1.3 review added DB constraints tying Super Admin ownership to Super Admin role and Restaurant Admin assignments to Restaurant Admin role. Rely on those constraints rather than duplicating weaker application-only checks.
- During Story 1.4 verification, remote dev D1 `qr-resto-hub-dev` still had an old prototype schema. After explicit human approval, the dev D1 was reset, `0000_perpetual_scalphunter.sql` was applied, and the Super Admin seed was rerun. Prod was not touched.
- Local `npm run dev` now sets `CLOUDFLARE_ENV=dev`; `wrangler.jsonc` includes the non-secret account id so Wrangler can select the correct Cloudflare account non-interactively.

### Project Structure Notes

- New auth domain rules may live under `src/domain/auth/**` only if they stay infrastructure-free.
- Repositories live under `src/server/repositories/**` and may depend on Drizzle/D1.
- Services live under `src/server/services/**` and orchestrate repositories, hashing, session generation, and audit-ready events.
- Controllers live under `src/server/controllers/**` and adapt service results to public API envelopes.
- Elysia route contracts live under `src/server/routes/auth.routes.ts`; route handlers remain request adaptation only.
- Config/env helpers belong under `src/lib/cloudflare/**`, `src/server/config/**`, or `src/lib/zod/**` depending on final pattern; do not create duplicate env parsers without checking existing files.
- Tests should be focused under `tests/story-1-4-auth.test.ts` or equivalent.

### Testing Requirements

Use red/green/refactor.

- Prefer isolated service/repository tests with an in-memory SQLite/Drizzle-compatible approach where possible; do not require live Cloudflare network.
- Mock Astro cookies or test Elysia handlers with bound `astroCookies` when checking cookie writes.
- Test cookie attributes directly.
- Test session token storage uses hash only.
- Test idempotent Super Admin seed against duplicate invocation.
- Test generic invalid credential responses for unknown email, wrong password, suspended account, and malformed hash.
- Test session resolver rejects expired/revoked/suspended sessions.
- Test route files for TypeBox schemas, OpenAPI detail metadata, and controller delegation.
- Run `npm test`, `npm run typecheck`, `npm run build`, and touched-file Prettier check before moving to review.

### References

- `_bmad-output/planning-artifacts/epics.md` - Story 1.4 acceptance criteria and Epic 1 sequencing.
- `_bmad-output/planning-artifacts/architecture.md#Authentication & Security` - D1-backed sessions, HttpOnly cookies, peppered hashing, `jose`, and auth environment variables.
- `_bmad-output/planning-artifacts/architecture.md#API & Communication Patterns` - Route -> Controller -> Service, Elysia TypeBox/OpenAPI, and standardized API envelopes.
- `_bmad-output/planning-artifacts/prd.md#Security & Privacy` - protected dashboard auth, tenant isolation, generic errors, and audit requirements.
- `_bmad-output/project-context.md#Critical Implementation Rules` - Cloudflare env import, JWT helper choice, DDD boundaries, and `src/lib/**` / `src/utils/**` reuse rules.
- `_bmad-output/implementation-artifacts/1-2-establish-ddd-api-middleware-lib-utils-and-component-structure.md` - source layout, API helper, Elysia bridge, audit/logging, and review learnings.
- `_bmad-output/implementation-artifacts/1-3-configure-remote-first-d1-schema-and-migrations-for-platform-accounts.md` - D1 schema, constraints, migration, and review learnings.
- `src/server/db/schema.ts` - existing Drizzle auth/session/role tables and constraints.
- `src/server/db/client.ts` - D1/Drizzle adapter.
- `src/lib/elysia/astroBridgeContext.ts` - request-bound Astro URL/cookie decorations.
- `src/lib/api/response.ts`, `src/lib/api/errors.ts`, `src/lib/typebox/api.ts` - API envelope and OpenAPI schema standards.
- `src/domain/audit/index.ts` - audit event abstraction.
- `.env.example` - required auth/seed env placeholders.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm test -- tests/story-1-4-auth.test.ts` failed red before implementation because auth modules did not exist.
- `npm test` passed: 6 files, 42 tests.
- `npm run typecheck` passed: 0 errors.
- `npm run build` passed.
- Touched-file Prettier check passed.
- `rg` source scan found no Node-only auth libraries, leaked seed credentials, or PayMongo customer checkout wiring in `src`.
- 2026-05-08T22:18:41+08:00 - Documented quick API/OpenAPI fix: request-bound `runtimeEnv` now flows from Astro API bridge into Elysia auth routes via `AstroBridgeDecorations`.
- 2026-05-08T22:24:04+08:00 - Fixed auth API error envelope mapping and malformed session expiry rejection; `npm test`, `npm run typecheck`, and `npm run build` passed.
- 2026-05-08T22:55:32+08:00 - Added local runtime Super Admin seed path with temp SQL generation and dev/prod npm commands; `npm test`, `npm run typecheck`, and `npm run build` passed.
- 2026-05-08T23:10:58+08:00 - Reset remote dev D1 `qr-resto-hub-dev` after old schema blocked migration, applied `0000_perpetual_scalphunter.sql`, and verified expected auth tables exist.
- 2026-05-08T23:16:00+08:00 - Ran `npm run seed:super-admin:dev`; verified exactly one active Super Admin owner in remote dev D1 and temp SQL cleanup.
- 2026-05-08T23:22:00+08:00 - Verified seeded login and session resolution locally through `CLOUDFLARE_ENV=dev`; plain `astro dev` returned `401` because it did not select `env.dev` bindings.
- 2026-05-08T23:27:12+08:00 - Updated `npm run dev` to set `CLOUDFLARE_ENV=dev`, added project `account_id` to `wrangler.jsonc`, verified seed login/session, and ran `npm run typecheck`.
- 2026-05-08T23:31:36+08:00 - Fixed local `/api/openapi` Vite optimizer cache issue by adding Elysia optimizer exclusions; verified `/api/foundation/health` and `/api/openapi` return `200`, and `npm run typecheck` passed.

### Completion Notes List

- Story context created by BMad create-story workflow.
- Ultimate context engine analysis completed - comprehensive developer guide created.
- Added Workers-compatible PBKDF2 password hashing with per-user salts, configured pepper, generic verification failure behavior, and opaque session token hashing.
- Added auth config parsing, Super Admin seed service, D1 auth repository, auth service, auth controller, and real Elysia auth routes for login/logout/session.
- Wired Cloudflare runtime env through the safe Astro/Elysia bridge without mutating the module-scoped app per request.
- Recorded follow-up quick fix for API/OpenAPI auth route integration: `runtimeEnv` is passed through the existing request-bound bridge instead of mutating app composition.
- Added app-level Elysia error mapping so auth route validation/runtime failures use standardized API envelopes.
- Hardened session resolution so malformed D1 `expires_at` text is rejected.
- Added local seed script that reads seed env vars, hashes the password, writes temporary SQL, applies it through Wrangler remote D1, and deletes the temp SQL file after execution.
- Applied the current migration to remote dev D1 after resetting old dev-only schema drift, then seeded and verified one active Super Admin owner.
- Updated `npm run dev` to select the Cloudflare `dev` environment by default and documented why the project account id is present in Wrangler config.
- Fixed the local OpenAPI dev-server issue by excluding Elysia packages from Vite dependency optimization and verifying `/api/openapi` returns `200`.
- Added session middleware locals foundation for later protected-dashboard RBAC/tenant guards.
- Added Story 1.4 red/green coverage for seed idempotency, duplicate owner prevention, secure cookie attributes, generic login failures, logout revocation, session resolution rejection, route metadata, and security guardrails.

### File List

- `README.md`
- `astro.config.mjs`
- `.env.example`
- `package-lock.json`
- `package.json`
- `scripts/seed-super-admin.mjs`
- `src/lib/crypto/jwt.ts`
- `src/lib/crypto/password.ts`
- `src/lib/crypto/session-token.ts`
- `src/lib/elysia/decorationTypes.ts`
- `src/middleware/auth-session.ts`
- `src/pages/api/[...slug].ts`
- `src/server/app.ts`
- `src/server/config/auth.ts`
- `src/server/controllers/auth.controller.ts`
- `src/server/repositories/admin-auth.repository.ts`
- `src/server/routes/auth.routes.ts`
- `src/server/routes/index.ts`
- `src/server/services/auth.service.ts`
- `src/server/services/super-admin-seed.service.ts`
- `tests/story-1-4-auth.test.ts`
- `wrangler.jsonc`

### Change Log

- 2026-05-08: Created Story 1.4 context for unique Super Admin seed and dashboard authentication.
- 2026-05-08: Implemented Story 1.4 auth seed, password hashing, session lifecycle, auth routes, tests, and validation.
- 2026-05-08: Documented API/OpenAPI quick fix that passes Cloudflare runtime env through the Astro/Elysia bridge for auth route controller creation.
- 2026-05-08: Fixed Story 1.4 review patch findings for standardized auth route errors and malformed session expiry rejection.
- 2026-05-08: Replaced seed endpoint plan with local temp-SQL Wrangler seed commands, then moved story to done.
- 2026-05-08: Reset and migrated remote dev D1 after old schema drift, seeded Super Admin, and verified login/session locally.
- 2026-05-08: Updated local dev startup and documented the OpenAPI Vite optimizer fix.

