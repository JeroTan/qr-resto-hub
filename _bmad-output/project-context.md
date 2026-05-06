---
project_name: "qr-resto-hub"
user_name: "Mr. JRW"
date: "2026-05-05"
sections_completed: ["technology_stack", "discovery"]
existing_patterns_found: 12
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

This project is currently greenfield. No `package.json`, source tree, or framework config exists yet, so scaffolding must pin the latest verified stable versions at implementation time.

Verified npm latest versions on 2026-05-05:

- `astro`: `6.2.2`
- `@astrojs/cloudflare`: `13.3.1`
- `@astrojs/react`: `5.0.4`
- `react`: `19.2.5`
- `react-dom`: `19.2.5`
- `elysia`: `1.4.28`
- `tailwindcss`: `4.2.4`
- `@tailwindcss/vite`: `4.2.4`
- `vite`: `8.0.10`
- `typescript`: `6.0.3`
- `wrangler`: `4.87.0`
- `vitest`: `4.1.5`
- `drizzle-orm`: `0.45.2`
- `drizzle-kit`: `0.31.10`
- `zod`: `4.4.3`
- `lucide-react`: `1.14.0`

Target platform:

- Astro app deployed to Cloudflare Workers.
- Cloudflare D1 as the relational database.
- Cloudflare Durable Objects for WebSocket/live order coordination.
- Cloudflare R2 for dish images and persisted QR assets.
- React for interactive customer and dashboard surfaces.
- ElysiaJS for API composition where compatible with Cloudflare Workers.
- Tailwind CSS v4 for styling through `@import "tailwindcss"` and `@tailwindcss/vite`.
- PayMongo only for platform no-ads subscriptions, never customer food-order payment in MVP.
- Google AdSense recommended for MVP ads and ad-block recovery.

Planning artifacts:

- Product requirements: `docs/qr-restaurant-ordering-platform-prd.md`
- UI design: `docs/ui-design.md`
- UI flow: `docs/ui-flow.md`
- Original raw request: `raw-query.txt`

Documents above might be deprecated but you can use it as legacy reference.

## Critical Implementation Rules

These standards come from the original request and must be preserved across implementation:

- Use feature-based React organization. Product areas own their components, hooks, routes, API clients, schemas, and tests.
- Use Domain Driven Design. Business rules must be testable without HTTP, D1, Durable Objects, R2, PayMongo, AdSense, or React.
- Use the layered API pattern: Route -> Controller -> Service -> Domain/Repository.
- Use fluent modular APIs only where they improve readability for validators, builders, query composition, or domain workflows.
- Atomic independent helpers must live in `src/utils/**`.
- Third-party integrations and custom wrappers must live in `src/lib/**`.
- D1 migrations are remote-first and must support only `dev` and `prod` D1 environments.
- Customer-facing ordering is mobile-first.
- Super Admin is seeded and unique.
- Super Admin manages Admin accounts.
- Admin accounts are internal platform administrators that manage Restaurant Admin accounts only.
- Restaurant Admin owns and manages exactly one restaurant tenant.
- Customers are anonymous and order through table/chair QR sessions.
- QR codes bind to table or chair; each submitted order must also receive its own anonymous order token for reconnecting live status.
- Orders follow `Pending -> Preparing -> To Serve -> Payment -> Completed`, with `Payment` optional per restaurant.
- Customers may request payment only when the order is `To Serve`.
- Customers may cancel only while the order is `Pending`; cancellation is rejected once `Preparing` begins.
- Out-of-stock dishes and add-ons remain visible but disabled.
- Dish creation requires a category first.
- Order notes have a hard maximum of 255 characters.
- Live updates must be visible to both customer and Restaurant Admin.
- Ads return automatically when the no-ads subscription expires, fails, or is cancelled.
- Paid tenants bypass ads and ad-block enforcement.

## Discovered UI Rules

- UI implementation must use `docs/ui-design.md` and `docs/ui-flow.md` as source artifacts.
- Customer flow: QR landing -> menu -> dish sheet -> cart -> live status.
- Restaurant Admin flow: dashboard -> live board -> menu management -> seating/QR -> subscription.
- Platform Admin flow: dashboard -> Restaurant Admin account management -> restaurant detail/status.
- Super Admin flow: admin management -> ownership transfer.
- Restaurant Admin order board uses Kanban-style drag/drop plus button actions.
- Use Inter typography, semantic color tokens, 4px spacing scale, and documented status colors from `docs/ui-design.md`.
- Respect accessibility requirements: WCAG AA contrast, 44px touch targets, keyboard navigation, screen reader labels for order cards, and `prefers-reduced-motion`.

## Discovery Notes

- No source implementation exists yet.
- No `package.json`, Astro config, Tailwind config, Wrangler config, or D1 migration files exist yet.
- No existing code naming conventions were found because the project has not been scaffolded.
- The repository already contains BMAD configuration and planning artifacts.
