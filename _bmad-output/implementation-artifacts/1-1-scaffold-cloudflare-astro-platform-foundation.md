# Story 1.1: Scaffold Cloudflare Astro Platform Foundation

Status: done

## Story

As a developer,
I want the project scaffolded with Astro, React, Tailwind CSS v4, Elysia, D1, R2, Durable Objects, Drizzle, Vitest, and OpenAPI support,
so that all future features follow the approved architecture from the start.

## Acceptance Criteria

1. Given the repository contains planning artifacts and no source implementation yet, when the foundation is scaffolded, then the project uses the current Cloudflare Astro starter and preserves existing planning artifacts.
2. Astro, React, Tailwind CSS v4, Elysia, `@elysiajs/openapi`, Drizzle, Drizzle Kit, Vitest, D1, R2, and Durable Object bindings are configured for Cloudflare Workers deployment.
3. Tailwind CSS v4 is configured through the approved Astro/Vite flow.
4. Package scripts exist for development, type checking, testing, building, and Wrangler deployment.
5. The setup supports only `dev` and `prod` D1 environments.
6. The generated structure does not add customer food-order PayMongo checkout.

## Tasks / Subtasks

- [x] Scaffold the Cloudflare Astro starter without deleting planning artifacts. (AC: 1)
  - [x] Preserve `.agents/**`, `_bmad/**`, `_bmad-output/**`, `docs/**`, `.github/**`, and `.gitignore`.
  - [x] If the C3 command wants an empty target directory, scaffold into a temporary sibling/subfolder, then merge only source/config files into the repo.
  - [x] Remove generic starter content that conflicts with QR Resto Hub naming, but do not remove planning artifacts.
- [x] Add the required runtime and development dependencies. (AC: 2, 3)
  - [x] Add Astro Cloudflare support, React, Tailwind CSS v4 with `@tailwindcss/vite`, Elysia, `@elysiajs/openapi`, TypeBox support through Elysia `t`, Drizzle ORM, Drizzle Kit, Vitest, Wrangler, and Cloudflare worker types.
  - [x] Use Zod only if needed for non-Elysia validation/config parsing; do not use it as an API contract source.
  - [x] Do not install PayMongo checkout dependencies or create any customer payment checkout route.
- [x] Configure Cloudflare Workers bindings and deployment config. (AC: 2, 5)
  - [x] Configure `wrangler.jsonc` with D1, R2, and Durable Object placeholders using explicit `dev` and `prod` environments only.
  - [x] Add binding/type definitions so Worker runtime access is type-checkable.
  - [x] Add D1 migration commands that target only `dev` and `prod` remote databases; no local-only migration source of truth.
- [x] Configure build, typecheck, test, and deploy scripts. (AC: 4)
  - [x] `dev`: Astro dev server.
  - [x] `typecheck`: Astro/TypeScript checks.
  - [x] `test`: Vitest.
  - [x] `build`: Astro build for Cloudflare Workers.
  - [x] `deploy:dev` and `deploy:prod`: Wrangler deploys with explicit env selection.
  - [x] `db:migrate:dev` and `db:migrate:prod`: remote D1 migration apply commands.
- [x] Add minimal foundation smoke tests/checks. (AC: 1, 2, 4, 6)
  - [x] Add or verify a Vitest smoke test that runs in the scaffold.
  - [x] Run typecheck, tests, and build.
  - [x] Verify no `paymongo` customer checkout dependency, route, or script exists.

## Dev Notes

### Scope Boundary

This story is the foundation scaffold only. Do not implement auth, account management, D1 tables, menu, seating, QR generation, ordering, live board behavior, subscription billing, ad loading, or customer checkout flows. Story 1.2 owns DDD/API/component folder structure and shared response/error/audit/logging primitives. Story 1.3 owns initial platform account schema and migrations.

### Required Starter

Use the Cloudflare C3 Astro starter:

```bash
npm create cloudflare@latest -- qr-resto-hub --framework=astro
```

If C3 cannot scaffold into the current non-empty repository, create a temporary scaffold and merge into this repo. The acceptance criterion is the final repo state, not the exact scaffold location used during implementation. Planning artifacts must survive unchanged unless the user explicitly asks to update them.

Cloudflare's Astro Workers guide documents C3 as the Astro-on-Workers path and explains that C3 configures the project for Cloudflare after invoking Astro setup. [Source: _bmad-output/planning-artifacts/architecture.md#Selected Starter: Cloudflare C3 Astro Starter; Cloudflare Astro Workers docs: https://developers.cloudflare.com/workers/frameworks/web-apps/astro/]

### Architecture Requirements

- Runtime target: Astro app on Cloudflare Workers with React islands for interactive surfaces. [Source: _bmad-output/planning-artifacts/architecture.md#Primary Technology Domain]
- Build/deploy: Astro + Vite build pipeline, Wrangler deployment. [Source: _bmad-output/planning-artifacts/architecture.md#Architectural Decisions Provided by Starter]
- Infrastructure bindings: D1, R2, and Durable Objects are first-class Cloudflare bindings. Wrangler config owns environment bindings. [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure & Deployment]
- D1 strategy: only `dev` and `prod` remote D1 environments are supported. Do not create a local-only migration workflow as the source of truth. [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure & Deployment]
- Data source rule: D1 is durable source of truth; Durable Objects coordinate live sessions only; R2 stores uploaded dish images and persisted QR assets. [Source: _bmad-output/planning-artifacts/architecture.md#Data Boundaries]
- API future direction: Elysia routes use TypeBox/Elysia `t` route contracts and OpenAPI metadata, then delegate to controllers. This story only installs/configures the capability. [Source: _bmad-output/planning-artifacts/architecture.md#API Boundaries]

### Library / Framework Guardrails

Use the architecture's pinned versions as the baseline when installing, unless package resolution requires newer compatible versions from the official starter:

- `astro`, `@astrojs/cloudflare`, `@astrojs/react`, `react`, `react-dom`
- `tailwindcss`, `@tailwindcss/vite`
- `elysia`, `@elysiajs/openapi`
- `drizzle-orm`, `drizzle-kit`
- `vitest`
- `wrangler`
- `zod` only for non-Elysia validation/config if needed

Before finalizing implementation, run `npm view <package> version` or inspect the generated `package-lock.json` and record any version drift in the Dev Agent Record. The planning artifacts contain verified versions from 2026-05-05, but this story intentionally uses `@latest` for the Cloudflare starter. [Source: _bmad-output/project-context.md#Technology Stack & Versions]

Latest-doc notes checked during story creation:

- Cloudflare documents `npm create cloudflare@latest -- my-astro-app --framework=astro` for Astro Workers projects. [Source: https://developers.cloudflare.com/workers/frameworks/web-apps/astro/]
- Astro `>=5.2.0` supports Tailwind 4 through `astro add tailwind`, which installs the official Tailwind Vite plugin path. [Source: https://docs.astro.build/en/guides/styling/#tailwind]
- Tailwind CSS v4's preferred Vite setup uses `tailwindcss` plus `@tailwindcss/vite` and `@import "tailwindcss";`. [Source: https://tailwindcss.com/docs/installation/using-vite]
- Cloudflare D1 migrations are Wrangler-managed; migration files are `.sql` files and `wrangler d1 migrations apply` supports remote application. [Source: https://developers.cloudflare.com/d1/reference/migrations/; https://developers.cloudflare.com/d1/wrangler-commands/]
- Durable Object bindings are configured in Wrangler with binding `name` and `class_name`. [Source: https://developers.cloudflare.com/durable-objects/get-started/]

### File Structure Requirements

Expected root-level config after this story:

- `package.json`
- `package-lock.json`
- `astro.config.mjs`
- `tsconfig.json`
- `wrangler.jsonc`
- `vitest.config.ts`
- `drizzle.config.ts`
- Tailwind v4 CSS entry, usually `src/styles/global.css` with `@import "tailwindcss";`
- Generated or manually maintained Cloudflare environment type file, if required by the scaffold
- Minimal `src/**` and `public/**` starter files

Do not prematurely create the full target app structure in this story. Story 1.2 owns the feature/domain/API/component directory layout. This story may create only the minimal files needed for the scaffold and toolchain to build.

### D1 / Wrangler Environment Requirements

Configure environment names exactly as:

- `dev`
- `prod`

Do not add `preview`, `staging`, `local`, or ad hoc D1 environments. If placeholder database IDs are needed, use clear placeholders and document the commands the developer/operator must run to create real D1 databases. D1 migration scripts should include `--remote` and explicit `--env dev` / `--env prod` or equivalent Wrangler-supported environment selection.

### PayMongo Boundary

PayMongo is subscription-only for the platform no-ads plan in later Epic 7 stories. This story must not add:

- Customer food-order checkout pages.
- Customer food-order payment API routes.
- PayMongo checkout sessions for food orders.
- Cart payment dependencies or scripts.

The only allowed mention is a negative verification that customer food-order PayMongo checkout does not exist. [Source: _bmad-output/planning-artifacts/prd.md#Technical Assumptions; _bmad-output/planning-artifacts/epics.md#Story 1.1]

### Testing Requirements

Minimum verification before marking implementation complete:

- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run deploy:dev -- --dry-run` or a documented Wrangler dry-run/equivalent if available
- Search verification: no customer food-order PayMongo checkout route/dependency was introduced

If Cloudflare credentials or real D1/R2/DO IDs are unavailable, use placeholders and document the blocked external verification in the Dev Agent Record. Local build/type/test must still pass.

### Project Structure Notes

Current repo is greenfield and contains planning artifacts only. No existing source implementation, `package.json`, Astro config, Tailwind config, Wrangler config, D1 migrations, or test setup existed before this story. [Source: _bmad-output/project-context.md#Discovery Notes]

Existing dirty planning artifact changes may be present in git and must not be reverted. Work with the current files.

### References

- `_bmad-output/planning-artifacts/epics.md` - Story 1.1 acceptance criteria and Epic 1 implementation notes.
- `_bmad-output/planning-artifacts/architecture.md` - selected starter, architecture decisions, Cloudflare binding strategy, structure and boundary rules.
- `_bmad-output/planning-artifacts/prd.md` - Cloudflare/D1/DO/R2/PayMongo constraints and no customer food-order checkout rule.
- `_bmad-output/project-context.md` - greenfield state, technology stack, critical implementation rules.
- `docs/ui-design.md` and `docs/reference-inspiration-2-google-stitch.md` - future Tailwind token direction; Story 1.2 applies the full visual system.

## Dev Agent Record

### Agent Model Used

Codex (GPT-5)

### Debug Log References

- 2026-05-07T09:57:51+08:00 - Started dev-story implementation for scaffold foundation.
- 2026-05-07T10:27:00+08:00 - Official Astro minimal scaffold generated in `astro-scaffold`, then merged into repository root per user instruction.
- 2026-05-07T10:33:00+08:00 - Official `astro add react`, `astro add tailwind`, and `astro add cloudflare` integrations completed.
- 2026-05-07T10:45:00+08:00 - Added required Elysia/OpenAPI, Drizzle, Vitest, Wrangler, TypeScript, and Worker type dependencies.
- 2026-05-07T10:56:00+08:00 - Final validation passed: `npm run typecheck`, `npm test`, `npm run build`, `npm run deploy:dev:dry-run`, and `npm run deploy:prod:dry-run`.
- 2026-05-07T10:56:00+08:00 - `rg -i "paymongo|checkout"` across implementation/config files returned no matches.
- 2026-05-07T10:57:00+08:00 - `npm audit --audit-level=high` returned no high-severity findings; 9 moderate transitive advisories remain where npm recommends breaking `--force` changes.

### Implementation Plan

- Preserve existing planning artifacts while introducing a minimal Astro + Cloudflare Workers scaffold.
- Add required runtime/tooling dependencies and root configs only; defer full DDD/source layout to Story 1.2.
- Configure Wrangler placeholders for `dev` and `prod` D1/R2/Durable Object bindings only.
- Verify with typecheck, Vitest, build, and PayMongo checkout absence search.

### Completion Notes List

- Story context created by BMad create-story workflow.
- Ultimate context engine analysis completed - comprehensive developer guide created.
- Scaffolded the Astro foundation with official Astro installer/integration commands wherever possible.
- Configured React, Tailwind CSS v4, Cloudflare adapter, Elysia/OpenAPI, Drizzle, Vitest, Wrangler, D1/R2/Durable Object bindings, and generated Worker runtime types.
- Added direct built-entry deploy scripts plus explicit dry-run scripts so `dev` and `prod` deployments carry the configured D1/R2/Durable Object bindings.
- Verified typecheck, test, build, dev dry-run, prod dry-run, and absence of customer food-order PayMongo checkout references.

### File List

- .gitignore
- .vscode/extensions.json
- .vscode/launch.json
- README.md
- astro.config.mjs
- drizzle.config.ts
- package-lock.json
- package.json
- public/favicon.ico
- public/favicon.svg
- src/foundation.test.ts
- src/pages/index.astro
- src/server/db/schema.ts
- src/styles/global.css
- src/worker.ts
- tsconfig.json
- vitest.config.ts
- worker-configuration.d.ts
- wrangler.jsonc
- _bmad-output/implementation-artifacts/1-1-scaffold-cloudflare-astro-platform-foundation.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log

- 2026-05-07: Implemented Story 1.1 scaffold foundation and moved story to review.
- 2026-05-07: Code review completed with no actionable findings; story moved to done.
