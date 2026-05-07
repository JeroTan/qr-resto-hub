# Story 1.2: Establish DDD, API, Middleware, Lib, Utils, and Component Structure

Status: ready-for-dev

## Story

As a developer,
I want the source tree organized around feature-based React, DDD, layered APIs, focused middleware, shared components, `src/lib/**`, and `src/utils/**`,
so that implementation remains consistent for future development work.

## Acceptance Criteria

1. Given the scaffolded project exists, when the application structure is created, then source folders separate domain, services, repositories, controllers, routes, middleware, features, shared components, libraries, and utilities according to the architecture.
2. API code follows Route -> Controller -> Service -> Domain/Repository boundaries.
3. Endpoint files are categorized by feature under `src/server/routes/**`, define the endpoints owned by that feature, and delegate to matching controllers.
4. Elysia route handlers contain only request adaptation, route contract metadata, controller calls, and response return logic.
5. Astro exposes the Elysia API through `src/pages/api/[...slug].ts` as a transport bridge only, using scoped Elysia `derive` decorations for Astro request data such as `urlData` and `astroCookies`.
6. Elysia route contracts use TypeBox/Elysia `t` schemas for params, query, body, headers, and responses.
7. OpenAPI/Swagger documentation is generated from route contracts with summary, description, tags, security metadata where applicable, and response schemas per status code.
8. Zod is reserved for non-Elysia validation such as environment/config parsing or isolated internal helpers.
9. Shared UI primitives live under `src/components/**`, feature-owned components live under `src/features/**/components/**`, Elysia/TypeBox/Zod/third-party wrappers live under `src/lib/**`, and atomic helpers live under `src/utils/**`.
10. Existing or future user-added files under `src/lib/**` and `src/utils/**` are treated as intentional project knowledge to inspect and reuse before duplication.
11. Standardized API success helpers under `src/lib/api/response.ts` produce `{ data, meta }` envelopes and standardized error helpers produce `{ error: { code, message, details } }` envelopes.
12. TypeBox/OpenAPI response helpers under `src/lib/typebox/api.ts` are used for route response maps.
13. Forbidden response mapping, public-safe error message mapping, request ID propagation, and OpenAPI error response metadata helpers are available for all later route groups.
14. An audit event writer interface and operational logging utility are available for later stories to record permission denials, auth failures, account changes, invalid transitions, provider failures, QR failures, R2 failures, and live reconnect failures without re-creating logging patterns.
15. Tailwind CSS v4 tokens and shared primitives incorporate `docs/ui-design.md` plus the Modern Epicurean guidance from `docs/reference-inspiration-2-google-stitch.md` with cream/parchment surfaces, cocoa ink, orange action/focus states, olive markers, and restrained status colors.
16. The visual system does not copy Apple-specific branding, SF Pro typography, Apple navigation patterns, negative tracking, or device/product-page composition.

## Tasks / Subtasks

- [ ] Add red tests that lock source boundaries before creating implementation files. (AC: 1-14)
  - [ ] Verify required directories exist for domain, server layers, middleware, features, shared components, `src/lib`, `src/utils`, and `src/test/fixtures`.
  - [ ] Verify API helper tests cover success envelopes, error envelopes, forbidden mapping, public-safe error messages, request ID behavior, and OpenAPI error metadata.
  - [ ] Verify route composition tests prove categorized `src/server/routes/**` files document endpoint contracts, delegate to controllers, and do not inline service/domain logic.
  - [ ] Verify middleware composition order and exports cover request ID, error boundary, auth session, tenant context, role guard, and ad entitlement.
- [ ] Create the source tree skeleton without moving or deleting existing scaffold files. (AC: 1, 7, 8)
  - [ ] Keep `src/pages/index.astro`, `src/styles/global.css`, `src/worker.ts`, and existing tests working.
  - [ ] Create feature folders: `customer-ordering`, `restaurant-orders`, `menu-management`, `seating-qr`, `subscriptions-ads`, `platform-admin`, and `super-admin`, each with `api`, `components`, `hooks`, and `types`.
  - [ ] Create domain folders: `auth`, `tenants`, `menu`, `seating`, `orders`, `subscriptions`, and `audit`.
  - [ ] Create shared component folders: `ui`, `layouts`, `feedback`, `navigation`, and `data-display`.
  - [ ] Create integration wrapper folders: `src/lib/ads`, `src/lib/cloudflare`, `src/lib/paymongo`, `src/lib/qr`, and `src/lib/r2`.
  - [ ] Create `src/utils` for atomic helpers and `src/test/fixtures` for shared test fixtures.
- [ ] Add Elysia API composition and route contract foundation. (AC: 2-8, 11-13)
  - [ ] Refactor the user-added `src/pages/api/[...slug].ts` catch-all into a build-safe Astro API bridge for Elysia; the bridge must only mount/delegate to the composed Elysia app and must not trigger Astro static `getStaticPaths()` errors during `npm run build`.
  - [ ] Add `src/server/app.ts` that composes Elysia, OpenAPI, and route modules, then have the Astro API bridge delegate to that app.
  - [ ] Keep the Elysia app initialized at module scope where possible, and inject per-request Astro data through scoped `derive` decorations.
  - [ ] Keep typed decoration helpers for `urlData` and `astroCookies` under `src/lib/elysia/**`.
  - [ ] Add categorized route modules under `src/server/routes/**` for auth, platform-admin, restaurant-admin, menu, seating-qr, customer-ordering, orders, subscriptions-ads, assets, and audit.
  - [ ] In each route module, define only the endpoints owned by that feature area, including OpenAPI `detail` metadata and request/response schemas per endpoint.
  - [ ] Add matching controller modules under `src/server/controllers/**`; routes must call controllers instead of services/domain modules directly.
  - [ ] Add service/repository folder conventions and placeholder examples only where they prove the boundary.
  - [ ] Add TypeBox/Elysia `t` schemas for a foundation health/metadata route and shared error response schemas.
  - [ ] Reuse `src/lib/typebox/wrapper.ts` for Elysia contract helpers where it fits, correcting encoding or typing issues before reuse.
  - [ ] Use `src/lib/zod/**` only for non-Elysia concerns; remove or quarantine any Zod API response wrappers that would create a parallel route contract system.
- [ ] Add standardized API envelope and error utilities. (AC: 11-13)
  - [ ] Implement typed success helper returning `{ data, meta }`.
  - [ ] Implement typed error helper returning `{ error: { code, message, details } }`.
  - [ ] Implement forbidden and public-safe error mapping with no leaked internal diagnostic detail.
  - [ ] Implement request ID utility/middleware integration so later routes can propagate one request ID.
  - [ ] Implement OpenAPI error response metadata helpers for route response maps.
- [ ] Add audit and operational logging foundations. (AC: 14)
  - [ ] Define an audit event writer interface under `src/domain/audit`.
  - [ ] Define operational logger types/helpers under `src/server/services` or `src/utils` only if atomic.
  - [ ] Include event categories for permission denials, auth failures, account changes, invalid transitions, provider failures, QR failures, R2 failures, and live reconnect failures.
  - [ ] Keep these interfaces dependency-free from HTTP, D1, R2, Durable Objects, PayMongo, AdSense, and React.
- [ ] Add middleware structure and composition. (AC: 1, 10)
  - [ ] Add `src/middleware/index.ts` as the composition point.
  - [ ] Add focused middleware files: `auth-session.ts`, `tenant-context.ts`, `role-guard.ts`, `ad-entitlement.ts`, `request-id.ts`, and `error-boundary.ts`.
  - [ ] Ensure middleware can be tested independently and does not own business rules.
- [ ] Add Tailwind v4 token foundation and minimal shared primitives. (AC: 15, 16)
  - [ ] Define CSS-first Tailwind v4 tokens in `src/styles/global.css` using the documented UI direction.
  - [ ] Add minimal primitives only where useful to prove structure, such as Button, Badge, and StatusBadge under `src/components/ui`.
  - [ ] Keep primitives local, accessible, and not tied to Apple-specific branding, SF Pro, negative tracking, or sparse product-page composition.
- [ ] Run verification and update the story record. (AC: 1-16)
  - [ ] `npm test`
  - [ ] `npm run typecheck`
  - [ ] `npm run build`
  - [ ] Search implementation/config files for forbidden customer food-order PayMongo checkout wiring.

## Dev Notes

### Scope Boundary

This story creates architecture structure, shared helpers, middleware composition, API contract scaffolding, and visual token/primitives foundation. It must not implement real auth flows, account CRUD, D1 schema/migrations, tenant onboarding behavior, menu management, seating/QR generation, order placement, live order board, PayMongo subscription flows, AdSense loading, or customer checkout.

Story 1.3 owns D1 schema and migrations. Story 1.4 owns Super Admin seeding and dashboard authentication. This story may add dependency-free interfaces and no-op/placeholder route/controller/service examples only to lock boundaries and tests.

### Current Implementation State

Existing files from Story 1.1 that must keep working:

- `src/worker.ts` exports `OrderLiveCoordinator` and delegates Worker `fetch` handling to `@astrojs/cloudflare/handler`.
- `src/pages/index.astro` imports `src/styles/global.css` and renders the QR Resto Hub app shell.
- `src/server/db/schema.ts` is a minimal placeholder; do not replace it with real tables in this story.
- `src/foundation.test.ts` and `tests/foundation-config.test.ts` validate scaffold, Cloudflare bindings, deploy scripts, and no customer food-order PayMongo checkout wiring.
- `package.json` already includes Astro, React, Tailwind v4, Elysia, `@elysiajs/openapi`, `@sinclair/typebox`, Drizzle, Vitest, Wrangler, TypeScript, Prettier, and Cloudflare worker types.

Preserve existing Wrangler dev/prod remote bindings and deploy scripts. Do not add `staging`, `preview`, or local-only D1 migration environments.

User-added files now exist and must be treated as intentional project knowledge:

- `src/pages/api/[...slug].ts` is an Astro catch-all API bridge that creates an Elysia app with `/api` prefix, Cloudflare adapter, OpenAPI plugin, and scoped Astro context decorations. It currently needs build-safety work because `npm run build` reports Astro dynamic route static path requirements.
- `src/lib/elysia/decorationTypes.ts` provides typed Elysia decorations for `urlData` and `astroCookies`; preserve or replace only with a strictly clearer typed equivalent.
- `src/lib/typebox/wrapper.ts` provides TypeBox/Elysia `t` helper schemas. Reuse where compatible with API contracts, but fix mojibake/encoding in regex comments or messages before depending on those helpers.
- `src/lib/zod/formatter.ts`, `src/lib/zod/validator.ts`, and `src/lib/zod/wrappers.ts` provide non-Elysia validation helpers. Keep them out of Elysia route contracts and do not use `zodApiResponse` / `zodPaginatedResponse` as route response contracts.
- `src/lib/crypto/hash.ts` and `src/lib/crypto/jwt.ts` are early auth-related wrappers. `jwt.ts` uses `jose`, which matches the Workers-compatible token helper decision. `hash.ts` is acceptable as a placeholder helper but Story 1.4 must harden password hashing with configured pepper and auth-specific tests before real credential storage.
- `src/utils/general/error.ts`, `src/utils/general/result.ts`, and `src/utils/general/success.ts` provide atomic internal result and code primitives. Preserve them as service/domain workflow helpers where useful, but do not expose their `{ content, error }` shape directly as public API responses; controllers/routes must adapt results through `src/lib/api/response.ts` to the standardized `{ data, meta }` and `{ error: { code, message, details } }` API envelopes.
- `src/lib/api/response.ts` is the public API response adapter standard. Use `apiSuccess`, `apiError`, and `resultToApiResponse` at controller/route boundaries instead of returning internal `Result` objects directly.
- `resultToApiResponse` omits `GeneralError.data` by default; pass `exposeErrorDetails: true` only for public-safe details such as validation field errors.
- `src/lib/typebox/api.ts` is the OpenAPI/TypeBox schema standard for public response envelopes. Use `tboxApiSuccess`, `tboxApiError`, and `tboxApiResponse` in Elysia route response maps.
- `package.json` now includes `jose`; keep it if JWT helpers remain.

### Required Source Layout

Create the target structure in `src/**` while preserving existing scaffold files:

```text
src/
  pages/
  styles/
  components/
    ui/
    layouts/
    feedback/
    navigation/
    data-display/
  features/
    customer-ordering/
    restaurant-orders/
    menu-management/
    seating-qr/
    subscriptions-ads/
    platform-admin/
    super-admin/
  domain/
    auth/
    tenants/
    menu/
    seating/
    orders/
    subscriptions/
    audit/
  server/
    app.ts
    routes/
    controllers/
    services/
    repositories/
    db/
    durable-objects/
    openapi/
  middleware/
  lib/
    ads/
    cloudflare/
    paymongo/
    qr/
    r2/
  utils/
  test/
    fixtures/
```

Each feature folder should include `api`, `components`, `hooks`, and `types` subfolders. Use `.gitkeep` only when the folder must exist before a real file is available; prefer small typed foundation files where they add testable value.

### API and OpenAPI Guardrails

- API routes use REST-style JSON through Elysia and follow Route -> Controller -> Service -> Domain/Repository. Astro exposes the Elysia API through `src/pages/api/[...slug].ts`; this file is only the transport bridge and should delegate into `src/server/app.ts`. [Source: `_bmad-output/planning-artifacts/architecture.md#API & Communication Patterns`]
- The catch-all API bridge may keep the Elysia app at module scope for Worker performance and inject per-request Astro data through scoped `derive` decorations. Typed decoration helpers such as `urlData` and `astroCookies` live under `src/lib/elysia/**`.
- The catch-all API bridge must be compatible with Astro build output. If `src/pages/api/[...slug].ts` remains the bridge, configure it so Astro treats it as a server endpoint rather than a prerendered dynamic static route.
- Categorized route files under `src/server/routes/**` declare the endpoints owned by each API area, such as auth, platform-admin, restaurant-admin, menu, seating-qr, customer-ordering, orders, subscriptions-ads, assets, and audit.
- Route files declare TypeBox/Elysia `t` schemas, OpenAPI detail metadata, params/query/body/header contracts, response schemas per status code, and delegate to controllers. Routes contain no business logic. [Source: `_bmad-output/planning-artifacts/architecture.md#Architectural Boundaries`]
- Controllers live under `src/server/controllers/**` and translate validated HTTP route input into service commands. Services live under `src/server/services/**` and coordinate workflows. Domain modules under `src/domain/**` own business rules and must remain testable without HTTP, Elysia, Cloudflare bindings, D1, R2, Durable Objects, PayMongo, AdSense, or React.
- `@elysiajs/openapi` is the approved OpenAPI/Swagger plugin; route `detail` metadata is used for API documentation. [Source: Elysia OpenAPI plugin docs: https://elysiajs.com/plugins/openapi.html]
- TypeBox helper schemas live under `src/lib/typebox/**`. Zod may be used only outside Elysia route contracts for non-HTTP validation/config/internal helpers, with reusable wrappers/formatters under `src/lib/zod/**`. [Source: `_bmad-output/planning-artifacts/architecture.md#Data Architecture`]
- API success responses must use `{ data, meta }`; errors must use `{ error: { code, message, details } }`. [Source: `_bmad-output/planning-artifacts/epics.md#Story 1.2`]

### Cloudflare and Env Guardrails

- Cloudflare bindings remain in Wrangler config and generated Worker types.
- When platform access is needed in supported files, `import { env } from "cloudflare:workers"` is permitted by project rules and current Cloudflare docs for environment variables. Prefer wrapper modules under `src/lib/cloudflare/**` or server infrastructure files instead of pulling platform bindings into domain logic. [Source: `_bmad-output/project-context.md#Critical Implementation Rules`; Cloudflare env docs: https://developers.cloudflare.com/workers/configuration/environment-variables/]
- Business rules and audit interfaces must be testable without Cloudflare runtime bindings.

### Middleware Guardrails

- Middleware is composed through `src/middleware/index.ts`; focused files own auth session, tenant context, role guard, ad entitlement, request ID, and error boundary. [Source: `_bmad-output/planning-artifacts/architecture.md#Middleware Boundaries`]
- Astro supports `src/middleware.ts` or `src/middleware/index.ts`; use `src/middleware/index.ts` to match the architecture. [Source: Astro middleware docs: https://docs.astro.build/en/guides/middleware/]
- Middleware adapts cross-cutting request concerns and must not become the place where account, tenant, menu, order, subscription, or audit business rules are implemented.

### Component and Visual Guardrails

- Astro owns routing/page shells. React owns interactive islands inside feature folders. Shared primitives and layouts live under `src/components/**`; feature-owned components live under `src/features/**/components/**`. [Source: `_bmad-output/planning-artifacts/architecture.md#Component Boundaries`]
- Shared components are grouped by intent: `ui`, `layouts`, `feedback`, `navigation`, and `data-display`.
- Tailwind v4 customization is CSS-first through `@import "tailwindcss";` and theme variables. Define tokens in `src/styles/global.css`; do not introduce a heavy component framework. [Source: Tailwind theme variables docs: https://tailwindcss.com/docs/customizing-spacing/]
- Token direction: cream/parchment surfaces, cocoa ink, orange action/focus states, olive markers, restrained status colors, quiet chrome, stable dimensions, visible focus, WCAG AA target, and operational dashboard density. [Source: `docs/ui-design.md`; `docs/reference-inspiration-2-google-stitch.md`; `_bmad-output/planning-artifacts/architecture.md#Visual System Boundaries`]
- Do not copy Apple-specific branding, SF Pro typography, Apple navigation patterns, negative tracking, device/product-page composition, sterile cool-toned wellness palettes, heavy black shadows, or sparse marketing layouts.

### Lib and Utils Reuse Rules

- Third-party integrations and custom provider wrappers live under `src/lib/**`.
- Atomic independent helpers live under `src/utils/**`.
- General-purpose internal result/error/success code primitives live under `src/utils/general/**`. They can support service/domain flow control, but public HTTP responses must still use the standardized API success/error envelopes.
- Public API response adapter helpers live under `src/lib/api/response.ts`; public TypeBox/OpenAPI response schemas live under `src/lib/typebox/api.ts`.
- User-added files under `src/lib/**` and `src/utils/**` are intentional project knowledge. Inspect and reuse them before adding new wrappers/helpers. Do not duplicate, replace, or bypass them without a clear reason. [Source: `_bmad-output/planning-artifacts/epics.md#Non-Functional Requirements`]

### Audit and Logging Guardrails

Add dependency-free interfaces now so later stories do not recreate incompatible logging patterns:

- Audit event writer interface under `src/domain/audit`.
- Operational logger utility/types for permission denials, auth failures, account changes, invalid transitions, provider failures, QR failures, R2 failures, and live reconnect failures.
- Tenant/order context fields should be optional where not applicable, but supported by the type shape.
- No database persistence implementation in this story; repositories and D1 tables arrive later.

### Previous Story Intelligence

Story 1.1 established these patterns:

- Use official Astro/Cloudflare integration output where possible and keep planning artifacts intact.
- Keep Story 1.2 responsible for the full DDD/source layout; do not backfill Story 1.1.
- Tests are currently Vitest-based and include filesystem/config assertions under `tests/**`.
- Dry-run deploys passed for dev/prod with D1, R2, Durable Object, and Assets bindings.
- `npm audit --audit-level=high` had no high-severity findings; moderate transitive advisories remain and should not be force-upgraded in this story unless directly required.

Recent commits after Story 1.1 also added Prettier and `.env.example`; preserve that work and do not churn formatting beyond touched files.

User additions before Story 1.2 implementation changed the starting point:

- `npm test` passes: 2 files, 7 tests.
- `npm run typecheck` passes with one hint: unused `z` type import in `src/lib/zod/formatter.ts`.
- `npm run build` fails after adding `src/pages/api/[...slug].ts`: Astro reports `GetStaticPathsRequired` for the dynamic route during Cloudflare prerender. Story 1.2 should fix this before adding more API route modules.

### Testing Requirements

Use red/green/refactor:

- Start with Vitest tests that fail against the current scaffold because required folders/helpers/routes/middleware do not exist.
- Add unit tests for API envelope helpers, public-safe error mapping, request ID behavior, audit/logging type helpers, middleware composition, and route-controller-service delegation.
- Keep domain/service tests independent of HTTP, D1, Durable Objects, R2, PayMongo, AdSense, and React.
- Run `npm test`, `npm run typecheck`, and `npm run build` before completion.
- Maintain the existing forbidden PayMongo checkout checks; this story may create `src/lib/paymongo` as an empty subscription-provider boundary, but must not add customer food-order checkout logic or dependencies.

### Project Structure Notes

The current repo is no longer greenfield source-empty: Story 1.1 added the Astro/Cloudflare scaffold. This story should evolve the scaffold in place. The developer must work with the current dirty worktree and avoid reverting unrelated user or generated changes.

### References

- `_bmad-output/planning-artifacts/epics.md` - Story 1.2 acceptance criteria and architecture NFRs.
- `_bmad-output/planning-artifacts/architecture.md` - API, frontend, middleware, visual, deployment, and file organization boundaries.
- `_bmad-output/planning-artifacts/prd.md` - product constraints, tenant/RBAC/privacy rules, and subscription-only PayMongo boundary.
- `_bmad-output/project-context.md` - critical implementation rules, Cloudflare env import preference, and no-`any` guidance.
- `docs/ui-design.md` - visual tokens, typography, spacing, states, accessibility targets.
- `docs/reference-inspiration-2-google-stitch.md` - Modern Epicurean visual direction.
- `src/worker.ts`, `src/pages/index.astro`, `src/styles/global.css`, `src/server/db/schema.ts` - existing scaffold files to preserve.

## Dev Agent Record

### Agent Model Used

Codex (GPT-5)

### Debug Log References

### Completion Notes List

- Story context created by BMad create-story workflow.
- Ultimate context engine analysis completed - comprehensive developer guide created.

### File List
