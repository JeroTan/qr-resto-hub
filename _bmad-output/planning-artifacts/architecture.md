---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/prd-validation-report.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/ux-design-directions.html'
  - '_bmad-output/project-context.md'
  - 'docs/qr-restaurant-ordering-platform-prd.md'
  - 'docs/ui-design.md'
  - 'docs/ui-flow.md'
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-05-06'
project_name: 'qr-resto-hub'
user_name: 'Mr. JRW'
date: '2026-05-06'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The PRD defines 85 functional requirements across the complete QR dine-in ordering lifecycle. Architecturally, these split into twelve major capability areas: identity/RBAC, tenant management, menu and stock management, seating and QR management, anonymous customer ordering, order workflow, live updates, history/statistics, subscriptions and ads, asset storage, audit/observability, and error handling.

The most important domain rule is that orders are not arbitrary records with editable statuses. They must follow server-validated transitions: `Pending -> Preparing -> To Serve -> optional Payment`, then completion into history/statistics. `Payment` is customer-triggered only from `To Serve`, and `Completed` is not an active board lane.

**Non-Functional Requirements:**
Architecture must support mobile customer menu load within 2.5 seconds, live updates within 2 seconds, dashboard action feedback within 300ms, reconnect/resync behavior, tenant-safe authorization, anonymous customer order tokens, WCAG AA accessibility, Cloudflare integration boundaries, OpenAPI/Swagger endpoint documentation, and observable failures for live updates, PayMongo, R2, QR resolution, forbidden access, and invalid order transitions.

Business rules must remain testable without HTTP, D1, Durable Objects, R2, PayMongo, AdSense, or React. This pushes the architecture toward explicit domain services, repositories, and integration adapters.

**Scale & Complexity:**
QR Resto Hub is a full-stack B2B SaaS web application with real-time restaurant operations and anonymous customer sessions.

- Primary domain: restaurant QR ordering and live dine-in operations
- Complexity level: high for architecture, due to multi-tenancy, real-time state, role separation, subscriptions, ads, and Cloudflare platform integration
- Estimated architectural components: 12 major modules

### Technical Constraints & Dependencies

The platform must use Astro, React, Tailwind CSS v4, ElysiaJS, Cloudflare Workers, Cloudflare D1, Cloudflare Durable Objects/WebSockets, Cloudflare R2, PayMongo, and Google AdSense.

The codebase must follow feature-based React organization, Domain Driven Design, Route -> Controller -> Service layering, `src/utils/**` for atomic helpers, and `src/lib/**` for third-party wrappers. D1 migrations are remote-first and support only dev/prod environments.

PayMongo must be isolated to no-ads subscription billing and must never be used for customer food-order checkout in MVP. AdSense/ad-block behavior must be isolated behind an adapter so it can be replaced later.

### Cross-Cutting Concerns Identified

- Tenant isolation across all protected dashboard and API behavior
- RBAC separation for Super Admin, Platform Admin, Restaurant Admin, and anonymous Customer
- Anonymous QR/order-token privacy
- Server-side order transition validation
- Live update delivery, reconnect, stale-state reconciliation, and duplicate-event handling
- Optimistic UI rollback for rejected order actions
- Active order board separation from completed history/statistics
- R2 asset handling for dish images and persisted QR assets
- PayMongo webhook signature verification and idempotency
- Ad entitlement and ad-block recovery behavior for free vs paid tenants
- Audit logging for ownership transfer, account actions, permission denials, subscription changes, webhook processing, and invalid transitions
- Accessibility and responsive behavior across customer mobile, restaurant dashboard, and platform admin surfaces

## Starter Template Evaluation

### Primary Technology Domain

QR Resto Hub is a full-stack SaaS web application deployed to Cloudflare Workers. The primary starter foundation should be Astro on Cloudflare Workers, with React islands for interactive surfaces and ElysiaJS integrated into the Worker/API layer.

### Starter Options Considered

**Cloudflare C3 Astro Starter**
The strongest fit because Cloudflare's official Astro Workers guide uses `npm create cloudflare@latest -- my-astro-app --framework=astro`. This creates an Astro project configured for Cloudflare Workers and delegates to Astro's official setup flow.

**Astro Minimal Starter**
A good generic Astro baseline, but it requires more Cloudflare setup afterward. It is less efficient for this project because Cloudflare Workers is a hard deployment constraint.

**Cloudflare SaaS Admin Template**
Useful as inspiration for admin dashboard patterns, but not selected because QR Resto Hub needs a mobile-first customer ordering surface, custom Tailwind primitives, strict DDD boundaries, Elysia integration, and restaurant-specific live operations.

**Cloudflare D1 / Durable Object Templates**
Useful as reference examples for D1 and Durable Objects, but not selected as the main starter because they are narrow infrastructure templates rather than the full Astro app foundation.

**Vite React Template**
Not selected because the product standard is Astro + React, not a pure Vite SPA.

### Selected Starter: Cloudflare C3 Astro Starter

**Rationale for Selection:**
This is the cleanest foundation because it aligns with the deployment target first: Astro running on Cloudflare Workers. It keeps Astro as the app shell, allows React for interactive customer/admin surfaces, and leaves room to add ElysiaJS, OpenAPI documentation, TypeBox schemas, D1, Durable Objects, R2, Drizzle, Tailwind CSS v4, and feature-based DDD structure without fighting a heavy boilerplate.

**Initialization Command:**

```bash
npm create cloudflare@latest -- qr-resto-hub --framework=astro
```

If the repository already contains planning artifacts, the first implementation story should scaffold safely and preserve existing docs/BMAD files.

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript-oriented Astro project targeting Cloudflare Workers runtime.

**Styling Solution:**
Tailwind CSS v4 should be added after initialization using Astro's current Tailwind flow:

```bash
npx astro add tailwind
```

**Build Tooling:**
Astro + Vite build pipeline with Cloudflare Workers deployment through Wrangler.

**Testing Framework:**
The starter does not fully solve testing. Add Vitest for domain/service tests and focused UI/component tests during foundation setup.

**Code Organization:**
The starter gives the app shell, but QR Resto Hub must replace generic structure with feature-based React and DDD modules.

**Development Experience:**
Use Astro dev server, Wrangler deployment commands, TypeScript checks, remote-first D1 migration scripts, and explicit Cloudflare binding types.

**Note:**
Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Use Cloudflare D1 as source of truth with Drizzle ORM `0.45.2` and Drizzle Kit `0.31.10`.
- Use Elysia TypeBox schemas through Elysia's `t` helper / `@sinclair/typebox 0.34.49` for request, response, params, query, and OpenAPI contract validation.
- Use `@elysiajs/openapi 1.4.15` for generated OpenAPI/Swagger documentation.
- Use Zod `4.4.3` only for non-Elysia concerns where it is a better fit, such as environment/config validation, internal form helpers, or isolated domain value parsing that does not need to generate OpenAPI schemas.
- Use custom dashboard session authentication with D1-backed sessions and HttpOnly secure cookies.
- Enforce RBAC and tenant scoping in services/domain guards, not only UI/routes.
- Use REST-style JSON APIs through ElysiaJS `1.4.28`.
- Use Durable Objects/WebSockets for live order coordination, with D1 as durable state.
- Use React `19.2.5` feature modules for interactive customer/admin surfaces.
- Use Tailwind CSS `4.2.4` and local UI primitives, not a heavy component framework.

**Important Decisions (Shape Architecture):**
- Use `@dnd-kit/core 6.3.1` and `@dnd-kit/sortable 10.0.0` for Restaurant Admin drag/drop, with button alternatives.
- Use `qrcode 1.5.4` for QR image generation/download.
- Keep active orders and completed history as separate operational concepts.
- Keep PayMongo, AdSense, R2, Durable Object, and QR wrappers under `src/lib/**`.

**Deferred Decisions (Post-MVP):**
- Native mobile app, kitchen display mode, printer integrations, white-label domains, online customer food payment, and multi-branch support.

### Data Architecture

D1 is the relational source of truth for tenants, roles, restaurant settings, categories, dishes, add-ons, seating, QR tokens, orders, completed history, subscriptions, analytics, and audit logs.

Drizzle ORM will define schema and typed queries. D1 migrations are remote-first and limited to `dev` and `prod`. Durable Objects may hold live connection/session state, but D1 remains the recovery source after reconnects.

Validation uses Elysia TypeBox schemas at HTTP boundaries so route contracts, runtime validation, TypeScript inference, and OpenAPI documentation share one source of truth. Zod may be used outside Elysia routes for non-HTTP validation concerns such as environment/config parsing or isolated internal helpers, but it must not become a parallel API contract system. Domain command validation must still be enforced inside services/domain objects so business rules remain testable without HTTP or Elysia.

Caching should be conservative:
- Cache stable menu/asset metadata only when tenant stock state allows it.
- Do not cache active order state as authoritative.
- Reconcile all live reconnects from D1/domain state.

### Authentication & Security

Dashboard users use custom email/password authentication with D1-backed sessions and HttpOnly secure cookies. Password hashing should use a Workers-compatible Web Crypto strategy with per-user salts and secret pepper configuration.

Super Admin is seeded and unique. Platform Admins manage Restaurant Admin accounts only. Restaurant Admins are scoped to exactly one restaurant tenant in MVP. Customer sessions remain anonymous and use QR tokens plus separate per-order anonymous order tokens.

Authorization must be enforced server-side through role and tenant guards before service actions execute. Customer food-order PayMongo checkout is forbidden in MVP.

### API & Communication Patterns

APIs use REST-style JSON endpoints implemented through Route -> Controller -> Service -> Domain/Repository.

Elysia routes are contract and documentation declarations, not business-logic containers. Each endpoint must declare its TypeBox-backed `body`, `params`, `query`, `headers` when needed, `response` schemas per status code, `detail.summary`, `detail.description`, tags, and security metadata for OpenAPI/Swagger generation. Route handlers should only adapt the request, call the matching controller, and return the controller result.

OpenAPI documentation is generated with `@elysiajs/openapi` and should expose a Swagger/OpenAPI documentation surface for development and authorized internal use. The OpenAPI JSON should be treated as the API contract for frontend clients, QA checks, and implementation review.

Elysia route groups should map to feature areas:
- auth
- platform-admin
- restaurant-admin
- restaurant-settings
- menu
- seating-qr
- customer-ordering
- orders
- subscriptions-ads
- assets
- audit

Errors use a consistent response envelope with safe public messages and internal diagnostic codes, and those envelopes must be documented in each route's OpenAPI response map. Live updates use Durable Object WebSockets for restaurant boards and customer order status.

### Frontend Architecture

Astro owns routing and page shell. React islands own interactive surfaces.

Feature modules should organize React code by product area:
- `features/customer-ordering`
- `features/restaurant-orders`
- `features/menu-management`
- `features/seating-qr`
- `features/platform-admin`
- `features/super-admin`
- `features/subscriptions-ads`

Shared primitives stay small and local. Feature-specific components remain inside their feature folders. Customer UI is mobile-first; admin UI is dense, operational, and keyboard-accessible.

### Infrastructure & Deployment

Cloudflare Workers is the hosting target. D1, Durable Objects, and R2 are first-class bindings. Wrangler `4.88.0` manages deploys and environment bindings.

Environment strategy:
- `dev` D1 remote database
- `prod` D1 remote database
- no local-only migration source of truth

Observability must log live reconnect failures, webhook failures, forbidden access, invalid transitions, QR failures, and R2 upload failures with tenant/order context when applicable.

### Decision Impact Analysis

**Implementation Sequence:**
1. Scaffold Astro Cloudflare starter.
2. Add React, Tailwind CSS v4, Elysia, `@elysiajs/openapi`, TypeBox schemas, Zod for non-HTTP validation, Drizzle, Vitest, D1/R2/Durable Object bindings.
3. Establish DDD folders, route/controller/service/domain/repository layering, and shared utilities/lib boundaries.
4. Implement auth/RBAC/tenant guards before operational features.
5. Implement menu/seating/QR before customer ordering.
6. Implement order domain transitions before live board UI.
7. Implement Durable Object live updates after order state rules are testable.
8. Implement PayMongo subscription and AdSense entitlement adapters.

**Cross-Component Dependencies:**
Order board UI depends on domain transition rules. Customer live status depends on anonymous order tokens and Durable Object channels. QR reuse privacy depends on separating QR tokens from order tokens. Subscription/ad behavior depends on tenant entitlement state. Platform Admin boundaries depend on RBAC and tenant-scope enforcement.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
AI agents could conflict on database naming, API contracts, route logic boundaries, file placement, error formats, live event names, validation tools, loading states, and tenant/RBAC enforcement.

### Naming Patterns

**Database Naming Conventions:**
- Tables use plural `snake_case`: `restaurant_admins`, `order_items`, `qr_codes`.
- Columns use `snake_case`: `restaurant_id`, `created_at`, `is_out_of_stock`.
- Primary keys use `id`.
- Foreign keys use `{entity}_id`.
- Indexes use `idx_{table}_{columns}`.
- Unique constraints use `uq_{table}_{columns}`.

**API Naming Conventions:**
- REST endpoints use plural kebab-case nouns: `/api/restaurant-admins`, `/api/qr-codes`.
- Route params use Elysia param syntax and camelCase names in code: `/:restaurantId`.
- Query fields use camelCase in public JSON/query contracts.
- OpenAPI tags match feature areas: `auth`, `menu`, `seating-qr`, `orders`.

**Code Naming Conventions:**
- React components use `PascalCase`.
- Component files use `PascalCase.tsx`.
- Non-component files use `kebab-case.ts`.
- Functions and variables use `camelCase`.
- Domain entities/value objects use `PascalCase`.
- Database fields remain `snake_case`; API/domain DTOs use `camelCase`.

### Structure Patterns

**Project Organization:**
- Feature code lives under `src/features/{feature-name}`.
- Domain logic lives under `src/domain/**`.
- API route declarations live under `src/server/routes/**`.
- Controllers live under `src/server/controllers/**`.
- Services live under `src/server/services/**`.
- Repositories live under `src/server/repositories/**`.
- Atomic helpers live under `src/utils/**`.
- Third-party wrappers live under `src/lib/**`.

**File Structure Patterns:**
- Tests are co-located as `*.test.ts` or `*.test.tsx`.
- Feature-specific schemas/components/hooks stay inside the feature folder.
- Shared UI primitives live under `src/components/ui/**`.
- Durable Objects live under `src/server/durable-objects/**`.
- D1 schema and migrations live under `src/server/db/**`.

### Format Patterns

**API Response Formats:**
Success responses use:

```json
{ "data": {}, "meta": {} }
```

Error responses use:

```json
{
  "error": {
    "code": "ORDER_INVALID_TRANSITION",
    "message": "This order cannot be moved to that status.",
    "details": {}
  }
}
```

**Data Exchange Formats:**
- API JSON uses `camelCase`.
- Database rows use `snake_case`.
- Dates use ISO 8601 strings in API responses.
- Money is stored as integer minor units, e.g. centavos.
- Boolean values use `true` / `false`.

### Communication Patterns

**Event System Patterns:**
Live event names use dot notation:

- `order.created`
- `order.status_changed`
- `order.cancelled`
- `order.completed`
- `board.resynced`

Event payloads include:
- `eventId`
- `eventType`
- `restaurantId`
- `orderId`
- `version`
- `occurredAt`
- `payload`

**State Management Patterns:**
- Server/domain state is authoritative.
- Optimistic UI updates must support rollback.
- React state stays feature-local unless shared state is truly needed.
- Live reconnect must resync from authoritative D1/domain state.

### Process Patterns

**Error Handling Patterns:**
- Domain errors use stable error codes.
- Controllers translate domain errors into API response envelopes.
- Routes document error responses in OpenAPI.
- Customer errors use plain language.
- Internal logs include diagnostic context without leaking it to users.

**Loading State Patterns:**
- Action buttons use local pending states.
- Boards and menus use skeletons.
- Live surfaces show `connected`, `reconnecting`, `stale`, and `disconnected`.
- Invalid optimistic actions roll back with a toast or inline message.

### Enforcement Guidelines

**All AI Agents MUST:**
- Keep Elysia routes free of business logic.
- Use TypeBox/Elysia `t` for API request/response contracts.
- Use OpenAPI metadata on every endpoint.
- Enforce tenant/RBAC rules server-side.
- Keep integrations in `src/lib/**`.
- Keep atomic helpers in `src/utils/**`.
- Treat user-added files under `src/lib/**` and `src/utils/**` as intentional project knowledge. Before changing, replacing, or duplicating them, inspect the file, understand why it exists, and prefer reusing it when it fits the current task.
- Agents may promote repeated logic into `src/utils/**` or integration/custom-wrapper logic into `src/lib/**` when it clearly improves reuse, consistency, or boundary separation. Promotion is allowed when the logic is genuinely shared or belongs behind a provider/library wrapper, not merely because it is convenient for one feature.
- Model order transitions as domain rules, not direct status mutation.

**Pattern Enforcement:**
- Domain rules must have unit tests.
- API routes must expose OpenAPI schemas.
- PR/code review should reject route handlers containing business rules.
- Any new pattern must update this architecture document before implementation spreads.
- AI agents must not delete or bypass unfamiliar helpers, wrappers, or utilities just because they were not generated by the agent. If a user-added utility or library conflicts with a task, document the conflict and adapt deliberately.
- When promoting code into `src/utils/**` or `src/lib/**`, update imports at call sites, keep tests with the behavior being moved, and ensure no feature-specific business rule is hidden inside a generic helper.

### Pattern Examples

**Good Examples:**
- `POST /api/orders/:orderId/request-payment`
- `order.status_changed`
- `restaurant_id` in D1, `restaurantId` in API JSON
- `src/lib/paymongo/paymongo-client.ts`
- `src/features/seating-qr/components/QRDisplay.tsx`

**Anti-Patterns:**
- Putting order transition logic inside an Elysia route handler.
- Returning undocumented ad hoc API errors.
- Using Zod for Elysia API schemas.
- Showing `Completed` as an active board column.
- Letting Platform Admin routes mutate restaurant menu/order data.
- Reimplementing or ignoring a user-added `src/lib/**` wrapper or `src/utils/**` helper without first checking whether it already solves the current need.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
qr-resto-hub/
├── .github/
│   └── workflows/
│       └── ci.yml
├── _bmad-output/
├── docs/
├── public/
│   └── assets/
├── src/
│   ├── env.d.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── qr/
│   │   │   └── [qrToken].astro
│   │   ├── order/
│   │   │   └── [orderToken].astro
│   │   ├── restaurant-admin/
│   │   │   └── index.astro
│   │   ├── platform-admin/
│   │   │   └── index.astro
│   │   └── super-admin/
│   │       └── index.astro
│   ├── styles/
│   │   └── global.css
│   ├── components/
│   │   ├── ui/
│   │   ├── layouts/
│   │   ├── feedback/
│   │   ├── navigation/
│   │   └── data-display/
│   ├── features/
│   │   ├── customer-ordering/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   ├── restaurant-orders/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   ├── menu-management/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   ├── seating-qr/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   ├── subscriptions-ads/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   ├── platform-admin/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   └── super-admin/
│   │       ├── api/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── types/
│   ├── domain/
│   │   ├── auth/
│   │   ├── tenants/
│   │   ├── menu/
│   │   ├── seating/
│   │   ├── orders/
│   │   ├── subscriptions/
│   │   └── audit/
│   ├── server/
│   │   ├── app.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── platform-admin.routes.ts
│   │   │   ├── restaurant-admin.routes.ts
│   │   │   ├── menu.routes.ts
│   │   │   ├── seating-qr.routes.ts
│   │   │   ├── customer-ordering.routes.ts
│   │   │   ├── orders.routes.ts
│   │   │   ├── subscriptions-ads.routes.ts
│   │   │   └── assets.routes.ts
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── db/
│   │   │   ├── schema/
│   │   │   ├── migrations/
│   │   │   └── client.ts
│   │   ├── durable-objects/
│   │   │   └── restaurant-order-room.ts
│   │   └── openapi/
│   │       ├── tags.ts
│   │       └── errors.ts
│   ├── middleware/
│   │   ├── index.ts
│   │   ├── auth-session.ts
│   │   ├── tenant-context.ts
│   │   ├── role-guard.ts
│   │   ├── ad-entitlement.ts
│   │   ├── request-id.ts
│   │   └── error-boundary.ts
│   ├── lib/
│   │   ├── ads/
│   │   ├── cloudflare/
│   │   ├── paymongo/
│   │   ├── qr/
│   │   └── r2/
│   ├── utils/
│   └── test/
│       ├── fixtures/
│       └── setup.ts
├── astro.config.mjs
├── drizzle.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── wrangler.jsonc
```

### Architectural Boundaries

**API Boundaries:**
Elysia route files declare TypeBox schemas, OpenAPI metadata, route params/query/body/response contracts, and delegate to controllers. Routes contain no business logic.

**Component Boundaries:**
Astro owns routing and page shells. React owns interactive islands inside feature folders. Shared reusable app primitives and layout pieces live under `src/components/**`. Feature-specific components live under `src/features/**/components/**`.

`src/components/**` is intentionally structured to avoid a generic component dump:
- `src/components/ui/**` for shared primitives such as buttons, inputs, modals, tabs, and badges.
- `src/components/layouts/**` for app shells, dashboard layouts, and page frames.
- `src/components/feedback/**` for toasts, skeletons, empty states, and error states.
- `src/components/navigation/**` for shared nav, breadcrumbs, tabs, and menus.
- `src/components/data-display/**` for shared tables, status indicators, metric cards, and list primitives.

If a component is only used by one feature, it stays in that feature. Promote a component to `src/components/**` only after it is genuinely shared by multiple features.

**Middleware Boundaries:**
Middleware is composed through `src/middleware/index.ts`. Each middleware file owns one concern: auth session, tenant context, role guard, ad entitlement, request ID, or error boundary. New middleware must be added as a focused file and composed in `index.ts`.

**Service Boundaries:**
Controllers translate HTTP concerns into service calls. Services orchestrate use cases. Domain modules enforce business rules. Repositories handle D1 persistence.

**Data Boundaries:**
D1 is durable source of truth. Durable Objects coordinate live sessions only. R2 stores dish images and persisted QR assets. External providers stay behind `src/lib/**`.

### Requirements to Structure Mapping

- Role/account management: `src/domain/auth`, `src/server/routes/auth.routes.ts`, `src/features/platform-admin`, `src/features/super-admin`
- Restaurant tenant settings: `src/domain/tenants`, `src/features/restaurant-admin`
- Menu/stock: `src/domain/menu`, `src/features/menu-management`
- Seating/QR: `src/domain/seating`, `src/features/seating-qr`, `src/lib/qr`
- Customer ordering: `src/features/customer-ordering`, `src/domain/orders`
- Live order board: `src/features/restaurant-orders`, `src/server/durable-objects`
- Subscriptions/ads: `src/domain/subscriptions`, `src/features/subscriptions-ads`, `src/lib/paymongo`, `src/lib/ads`
- Assets: `src/lib/r2`, `src/server/routes/assets.routes.ts`
- Audit/observability: `src/domain/audit`, `src/server/services/audit-service.ts`

### Integration Points

**Internal Communication:**
Frontend features call API clients. API routes call controllers. Controllers call services. Services use domain modules and repositories. Live updates publish through Durable Object rooms.

**External Integrations:**
PayMongo, AdSense, R2, Durable Objects, and QR generation are wrapped in `src/lib/**`.

**Data Flow:**
Customer QR token resolves seating context. Order submission snapshots menu data into D1. Durable Object broadcasts live events. Completed orders leave active board visibility and remain in history/statistics.

### File Organization Patterns

**Configuration Files:**
Root config owns Astro, Wrangler, Drizzle, TypeScript, Tailwind, and Vitest.

**Source Organization:**
Feature UI, shared components, domain rules, API layers, repositories, integrations, middleware, and utilities remain physically separate.

**Test Organization:**
Domain/service tests are co-located. Shared fixtures live in `src/test/fixtures`.

**Asset Organization:**
Static public assets live in `public/assets`. Uploaded dish images and persisted QR assets live in R2.

### Development Workflow Integration

**Development Server Structure:**
Astro dev runs page and React development. Elysia API composition lives under `src/server/app.ts`.

**Build Process Structure:**
Astro builds for Cloudflare Workers. Wrangler deploys with D1, R2, and Durable Object bindings.

**Deployment Structure:**
Only `dev` and `prod` D1 migration targets are supported. Environment bindings are defined in Wrangler config and typed for Worker runtime use.

## Architecture Validation Results

### Coherence Validation

**Decision Compatibility:**
All major technology choices work together: Astro + React for UI, ElysiaJS for API composition, TypeBox for Elysia route contracts, OpenAPI/Swagger for documentation, D1/Drizzle for persistence, Durable Objects for live coordination, R2 for assets, and Cloudflare Workers for deployment.

**Pattern Consistency:**
Implementation patterns support the decisions. Routes are documentation/contract layers only, controllers delegate to services, domain rules stay testable, integrations stay in `src/lib/**`, and atomic helpers stay in `src/utils/**`.

**Structure Alignment:**
The project structure supports feature-based React, DDD boundaries, layered API design, middleware separation, shared components, feature-owned components, and Cloudflare-specific infrastructure.

### Requirements Coverage Validation

**Feature Coverage:**
All major product areas are mapped: auth/RBAC, tenant management, menu/stock, seating/QR, customer ordering, live order board, subscriptions/ads, assets, audit, and observability.

**Functional Requirements Coverage:**
All 85 FRs are architecturally supported by the mapped domains, features, routes, services, repositories, integrations, and live-update boundaries.

**Non-Functional Requirements Coverage:**
Performance, reliability, security, privacy, accessibility, integration, maintainability, data retention, observability, and remote-first D1 migration requirements are supported.

### Implementation Readiness Validation

**Decision Completeness:**
Critical decisions are documented with versions where needed, including Astro, React, Elysia, TypeBox/OpenAPI, Drizzle, Tailwind, Wrangler, dnd-kit, QR generation, and Vitest.

**Structure Completeness:**
The directory structure is specific enough for implementation and includes pages, features, domain modules, API layers, middleware, integrations, database, Durable Objects, shared components, utilities, tests, and config.

**Pattern Completeness:**
Naming, file placement, API formats, live event formats, loading states, error handling, OpenAPI documentation, user-added utilities, and promotion rules are defined.

### Gap Analysis Results

**Critical Gaps:**
None.

**Important Gaps:**
None blocking. Exact D1 schema tables, route lists, and CI job commands should be detailed during implementation stories.

**Nice-to-Have Gaps:**
Future implementation can add more detailed API endpoint tables, schema diagrams, and deployment runbooks.

### Validation Issues Addressed

- Clarified TypeBox as the Elysia API contract source.
- Kept Zod available for non-Elysia validation only.
- Added OpenAPI/Swagger documentation requirements.
- Added `src/components/**` shared component boundaries.
- Replaced single middleware file with composed middleware folder.
- Added rules for user-added `src/lib/**` and `src/utils/**` files.

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Strong DDD and layered API boundaries
- Clear OpenAPI/TypeBox route contract rule
- Strong tenant, role, QR-token, and order-token separation
- Live updates tied to Durable Objects with D1 as recovery source
- Feature-based frontend with shared component guardrails
- Clear rules for user-added libraries and utilities

**Areas for Future Enhancement:**
- Detailed D1 schema design
- Full endpoint catalog
- CI workflow command details
- Deployment runbook
- Observability dashboard specification

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently across all components.
- Respect project structure and boundaries.
- Keep Elysia routes free of business logic.
- Use this document as the source of truth for architectural questions.

**First Implementation Priority:**
Initialize the Astro Cloudflare foundation while preserving existing planning artifacts:

```bash
npm create cloudflare@latest -- qr-resto-hub --framework=astro
```
