---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation-skipped', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
workflowStatus: 'complete'
completedAt: '2026-05-05'
releaseMode: 'phased'
inputDocuments:
  - 'docs/qr-restaurant-ordering-platform-prd.md'
  - 'docs/ui-design.md'
  - 'docs/ui-flow.md'
  - '_bmad-output/project-context.md'
documentCounts:
  productBriefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 4
workflowType: 'prd'
projectName: 'qr-resto-hub'
userName: 'Mr. JRW'
createdDate: '2026-05-05'
classification:
  projectType:
    primary: 'saas_b2b'
    secondary:
      - 'web_app'
      - 'realtime_operations_dashboard'
      - 'api_backend'
  domain:
    primary: 'hospitality_restaurant_operations'
    bmadFallback: 'general'
  complexity:
    bmadDomainComplexity: 'medium'
    operationalComplexity: 'medium_high'
  projectContext: 'greenfield_with_existing_planning_docs'
  classificationNotes:
    - 'A multi-tenant B2B SaaS web app for restaurant QR ordering and real-time order operations.'
    - 'Customer mobile QR ordering is a primary product surface, not a secondary afterthought.'
    - 'Customer ordering is mobile-first web because forcing app downloads would create friction and reduce dine-in adoption.'
    - 'Restaurant service speed, live order accuracy, and staff workflow clarity are domain-critical.'
    - 'Payment order status means offline bill request; PayMongo is subscription-only.'
    - 'MVP enforces one Restaurant Admin per restaurant, but schema should not prevent future multi-branch expansion.'
    - 'API backend is an implementation lens, not a customer-facing product.'
    - 'This is not a native mobile app, ecommerce checkout app, or fintech product in MVP.'
---

# Product Requirements Document - qr-resto-hub

**Author:** Mr. JRW
**Date:** 2026-05-05

## Executive Summary

QR Resto Hub is a multi-tenant B2B SaaS web app for restaurant QR ordering and real-time dine-in order operations. Restaurant Admins manage exactly one restaurant tenant, configure categories, dishes, add-ons, table/chair QR codes, subscription status, and live orders. Customers scan a QR code from a table or chair and order through a mobile-first browser experience without installing an app, creating an account, or going through online checkout.

The product solves the operational gap between manual dine-in ordering and heavy native-app ordering systems. Customers get a frictionless QR-to-menu-to-order flow, while restaurants get a live active order board that moves orders through `Pending -> Preparing -> To Serve -> optional Payment`, then sends completed orders into history/statistics. `Payment` is an optional offline bill-request status triggered by the customer from `To Serve`. PayMongo is used only for the restaurant no-ads subscription; customer food orders do not use online payment in MVP.

### What Makes This Special

The core insight is that restaurants can modernize dine-in ordering without forcing customers to download a native app. A QR-linked mobile web flow removes the biggest adoption blocker for first-time diners: app-install friction. This makes the customer experience lightweight, fast, and suitable for walk-in restaurant use.

The product is differentiated by combining a no-login customer ordering surface with a real-time restaurant operations dashboard. Live updates through Cloudflare Durable Objects/WebSocket behavior are core functionality, not a later enhancement. Tenant isolation, server-side order transition validation, and strict role separation are foundational because the same platform serves many restaurants.

## Project Classification

QR Resto Hub is classified as `saas_b2b` primary, with `web_app`, `realtime_operations_dashboard`, and `api_backend` as secondary project lenses. The domain is `hospitality_restaurant_operations`, with BMAD fallback domain `general` because the BMAD domain registry does not include restaurant operations as a specific row.

The project is a greenfield product with existing planning artifacts. Domain complexity is medium, while operational complexity is medium-high due to multi-tenancy, anonymous QR sessions, real-time order updates, restaurant status workflows, Cloudflare D1/Durable Objects/R2 integration, PayMongo subscription billing, AdSense/ad-block recovery, and mobile-first customer experience requirements.

This is not a native mobile app, ecommerce checkout app, or fintech product in MVP. API/backend concerns are an implementation lens for DDD, layered API design, validation, and integration boundaries, not the customer-facing product category.

## Success Criteria

### User Success

Customers succeed when they can scan a table or chair QR code, open the restaurant menu in their browser, place an anonymous order, and track live status without installing an app or creating an account.

Restaurant Admins succeed when they can configure their restaurant, menu, tables/chairs, QR codes, subscription status, and live order board without needing platform-level support for daily operations.

Platform Admins succeed when they can create, manage, suspend, and monitor Restaurant Admin accounts without accessing or modifying restaurant operational workflows.

Super Admin succeeds when the seeded owner account can manage Admin accounts and transfer ownership without participating in restaurant tenant operations.

### Business Success

The product is working when restaurants can use QR Resto Hub as a reliable dine-in ordering workflow during real service, not only as a menu viewer.

Primary business metrics:
- At least 10% of active restaurants upgrade to the PHP 100/month no-ads subscription.
- At least 70% of active restaurant tables or chairs receive one or more QR orders per service day.
- At least 90% of submitted orders reach `Completed` status.
- Restaurant Admins can move an order to the next valid status in 2 clicks or fewer.
- Free-tier restaurants can run with non-intrusive ads, while paid restaurants remove ads from both dashboard and customer-facing pages.

### Technical Success

The system succeeds technically when live ordering remains fast, tenant-safe, and resilient under restaurant service conditions.

Technical success criteria:
- Customer-facing menu initial load target is under 2.5 seconds on mobile 4G.
- Live order updates appear for Restaurant Admins and customers within 2 seconds under normal load.
- Order status transitions are validated server-side and cannot bypass domain rules.
- Tenant isolation prevents Admins, Restaurant Admins, and customer QR sessions from accessing unrelated restaurant data.
- PayMongo is used only for no-ads subscription billing and webhook handling is idempotent.
- Cloudflare Durable Objects/WebSocket behavior supports reconnects, stale-state handling, and live board updates.
- D1 migrations follow remote-first dev/prod workflow only.
- Dish images and persisted QR assets are stored through R2 integration.

### Measurable Outcomes

MVP launch is successful when:
- A restaurant can be onboarded by a Platform Admin.
- A Restaurant Admin can configure categories, dishes, add-ons, tables, chairs, and QR codes.
- A customer can scan a table/chair QR code and submit an anonymous order with an optional note up to 255 characters.
- The order appears in `Pending`, moves through active service statuses, and leaves the active board when completed.
- Customers can cancel only while `Pending`.
- Customers can request payment only when the order is `To Serve` and payment stage is enabled.
- Restaurant Admins can complete orders and view completed-order statistics.
- Out-of-stock dishes and add-ons remain visible but disabled.
- Paid tenants bypass ads and ad-block enforcement.
- Expired, failed, or cancelled subscriptions return the tenant to ads-enabled behavior.

## Product Scope

### MVP - Minimum Viable Product

MVP includes:
- Seeded Super Admin.
- Platform Admin account management for Restaurant Admins.
- One Restaurant Admin per restaurant tenant.
- Restaurant tenant setup.
- Category-first menu management.
- Dish management with picture, price, add-ons, and stock status.
- Add-on management with name, price, and stock status.
- R2-backed dish image upload.
- Table/chair management with chair grouping under tables.
- QR generation by table or chair.
- QR download and copy-link fallback for each generated table/chair QR code.
- Anonymous mobile-first customer ordering.
- Order note support with 255-character maximum.
- Live active order board with `Pending`, `Preparing`, `To Serve`, and optional `Payment`.
- Completed order history and statistics separate from the active board.
- Customer live order status view.
- Customer cancellation while `Pending` only.
- Optional payment-request stage controlled per restaurant.
- PayMongo no-ads subscription entitlement.
- Google AdSense free-tier ad placement and ad-block recovery.
- Remote-first D1 dev/prod migrations.

### Growth Features (Post-MVP)

Post-MVP growth features include:
- More detailed analytics by dish, category, table/chair, and service period.
- Staff permission presets beyond the single Restaurant Admin model.
- QR print layout templates.
- Restaurant operating hours and menu availability schedules.
- Advanced cancellation overrides.
- Subscription/payment history improvements.
- CSV export for order and analytics data.
- Better ad placement tuning based on real AdSense performance.

### Vision (Future)

Future vision includes:
- Multi-branch support without breaking the MVP one-restaurant ownership model.
- Kitchen display mode.
- Printer integrations.
- Reservation or waitlist module.
- Customer loyalty features.
- White-label domains for paid restaurants.
- Optional online food-order payment integration if the product direction later requires it.

## User Journeys

### Journey 1: Customer Success Path - Frictionless QR Ordering

Mika sits down at Table 5, Chair A during a busy lunch hour. She sees a QR code, scans it with her phone camera, and the restaurant menu opens directly in her browser. She does not need to install an app, create an account, or give her phone number.

She browses categories, opens a dish sheet, chooses add-ons, and sees out-of-stock items clearly marked but disabled. Before placing the order, she adds a short kitchen note within the 255-character limit. She submits the order and immediately lands on a live status screen showing the order as `Pending`.

The value moment happens when Mika sees the order move live from `Pending` to `Preparing` without needing to ask staff. Later, the order moves to `To Serve`. If payment stage is enabled, Mika can request the bill from the same page, and that customer action moves the order to `Payment`. After staff completes the order, the order is no longer visible to future diners who scan the same table/chair QR; only Mika's anonymous order token can show her final completed state. Her new reality is simple: scan, order, track, ask for the bill when food is ready, and finish without app friction.

This journey reveals requirements for mobile-first QR routing, anonymous customer sessions, menu browsing, cart/order notes, stock visibility, order submission, customer live updates, optional customer-triggered payment request, and completed-order privacy for reusable QR codes.

### Journey 2: Customer Edge Case - Cancellation Race

Jun scans a table QR code, orders quickly, then realizes he selected the wrong dish. Because the order is still `Pending`, he opens the live status page and taps cancel. The app asks for confirmation, then server-side validation checks whether the order is still cancellable.

If the Restaurant Admin has not started preparation, the order becomes cancelled and disappears or changes state on the restaurant board live. If staff already moved the order to `Preparing`, Jun sees a clear message that cancellation is no longer allowed because preparation has started.

The critical moment is trust: the customer understands why cancellation succeeded or failed, and the restaurant does not lose operational control. This journey reveals requirements for cancellation rules, server-side transition validation, live board synchronization, conflict handling, and customer-friendly error messaging.

### Journey 3: Restaurant Admin Daily Operations

Ana owns one restaurant tenant and logs into the Restaurant Admin dashboard before opening. She checks completed-order stats, verifies today's menu categories, marks unavailable dishes and add-ons as out of stock, and confirms whether the payment-request stage is enabled for dine-in service.

During service, new QR orders appear in the `Pending` column. The active board shows `Pending`, `Preparing`, `To Serve`, and optional `Payment`; it does not show `Completed` as an active lane. Ana or her staff move orders through `Pending -> Preparing -> To Serve`. If payment stage is enabled, the order moves to `Payment` only when the customer requests the bill from the `To Serve` state. Restaurant Admins then complete the order after offline settlement. If payment stage is disabled, Restaurant Admins can complete the order directly after `To Serve`. Completing an order removes it from the active board and stores it in completed order history/statistics.

The value moment happens during peak time: the dashboard becomes the source of truth for service flow. This journey reveals requirements for menu management, table/chair QR management, order board UI, valid status transitions, optimistic UI with rollback, live WebSocket updates, completed-order statistics, and operational error recovery.

### Journey 4: Restaurant Admin Setup - Tables, Chairs, QR Codes, and Subscription

Before launch, Ana configures the restaurant seating plan. She creates tables, adds chairs under each table, reorders or moves chairs when needed, and generates QR codes either for the full table or for individual chairs. She downloads or prints the QR codes and places them physically in the restaurant. If printing or scanning is not practical, she can copy the QR URL and send it to a customer or staff member as a fallback.

Ana also reviews subscription status. On the free plan, non-intrusive ads appear in allowed placements. If she upgrades to the PHP 100/month no-ads plan through PayMongo, ads disappear from both the dashboard and customer-facing ordering pages. If the subscription expires, fails, or is cancelled, ads return automatically.

The critical moment is ownership: Ana can operate independently without asking the platform team to configure daily restaurant behavior. This journey reveals requirements for tenant setup, seating hierarchy, QR token generation, QR download/copy URL actions, QR archive/regeneration, R2 QR asset handling if persisted, subscription entitlement, PayMongo webhook handling, and ad/ad-block policy enforcement.

### Journey 5: Platform Admin Account Management

Marco is a Platform Admin. His job is not to run restaurants; it is to manage Restaurant Admin accounts. He logs into the platform administrator dashboard, creates a Restaurant Admin account for a new restaurant owner, checks account status, suspends or reactivates accounts when needed, and monitors free vs paid tenant status.

Marco cannot edit a restaurant's menu, seating, QR codes, or live orders. That restriction protects tenant autonomy and prevents platform-level users from accidentally interfering with restaurant service.

The value moment is clean separation of responsibility: Platform Admins can manage accounts without becoming restaurant operators. This journey reveals requirements for Platform Admin authentication, Restaurant Admin account CRUD, suspension/reactivation, tenant status visibility, role-based access control, audit logging, and forbidden-access handling.

### Journey 6: Super Admin Ownership Control

The seeded Super Admin account exists to control platform administration, not restaurant operations. The Super Admin creates Admin accounts and can transfer ownership when needed. During an ownership transfer, the system requires deliberate confirmation and preserves the rule that only one Super Admin owns the platform.

The critical moment is continuity: the platform can change owner without breaking tenant operations or exposing restaurant workflows. This journey reveals requirements for seed data, unique Super Admin enforcement, Admin account management, ownership transfer, privilege changes, and auditability.

### Journey Requirements Summary

The journeys reveal these capability areas:
- Mobile-first anonymous QR ordering.
- Table/chair-scoped QR sessions with separate anonymous order tokens.
- Menu, category, dish, add-on, image, and stock management.
- Cart, add-on selection, and 255-character order notes.
- Live order board with validated state transitions.
- Customer cancellation while `Pending` only.
- Optional customer-initiated payment request from `To Serve`.
- Restaurant Admin setup and daily operations.
- Platform Admin account management without restaurant operation permissions.
- Seeded Super Admin ownership and Admin management.
- PayMongo no-ads subscription entitlement.
- Google AdSense free-tier ads and ad-block recovery.
- Tenant isolation, RBAC, audit logging, and forbidden-access handling.
- Durable Objects/WebSocket reconnects, conflicts, and live synchronization.

## Domain-Specific Requirements

### Compliance & Regulatory

QR Resto Hub is not classified as a regulated healthcare, fintech, govtech, or native payment product in MVP. Customer food orders do not use online payment, and PayMongo is limited to platform no-ads subscription billing.

Domain compliance requirements:
- PayMongo webhook handling must verify signatures and process subscription events idempotently.
- Customer ordering must not require personal identity, phone number, or customer account creation.
- If analytics are stored, they should remain tenant-scoped and avoid collecting unnecessary customer personal data.
- AdSense/ad-block recovery must respect allowed ad placement behavior and must not obscure loaded ads or create deceptive ad interactions.

### Technical Constraints

Restaurant operations require speed, clarity, and reliable state changes during service.

Technical constraints:
- Customer ordering must remain mobile-first and browser-based.
- QR links must be non-guessable and bound to table/chair context.
- Each order must receive an anonymous order token separate from the QR token.
- Order status transitions must be validated server-side.
- `Payment` can only be triggered by the customer requesting the bill from `To Serve`.
- Restaurant Admins complete orders after offline settlement.
- Live order updates must handle reconnects, stale state, duplicate events, and conflict resolution.
- Out-of-stock dishes and add-ons must remain visible but disabled to reduce customer confusion.
- Restaurant Admin workflows must prioritize speed: drag/drop or button-based status movement, clear status colors, and immediate feedback.

### Integration Requirements

Core domain integrations:
- Cloudflare D1 stores tenant, role, menu, seating, QR, order, subscription, and audit data.
- Cloudflare Durable Objects coordinate live order board and customer order status updates.
- Cloudflare R2 stores dish images and persisted QR assets when needed.
- PayMongo handles no-ads subscription billing only.
- Google AdSense handles free-tier ad serving and ad-block recovery where approved.
- Tailwind CSS v4 implements the UI design tokens from `docs/ui-design.md`.

### Risk Mitigations

Restaurant-specific risks:
- QR reuse risk: QR codes are reusable by table/chair, but each submitted order must have a separate anonymous order token and completed orders must not be exposed to future diners who scan the same QR.
- Wrong status risk: Server-side domain rules must reject invalid transitions, especially cancellation after `Preparing` and payment request before `To Serve`.
- Role confusion risk: Platform Admins cannot edit restaurant operations; Restaurant Admins own exactly one restaurant tenant.
- Peak service risk: Live order board interactions should use optimistic UI with rollback if the server rejects a transition.
- Subscription confusion risk: PayMongo must never be wired to customer food-order checkout in MVP.
- Ad-block friction risk: Paid tenants bypass ad logic; free tenants see a clear recovery modal only when required ad loading is blocked.

## B2B SaaS Web App Specific Requirements

### Project-Type Overview

QR Resto Hub is a multi-tenant B2B SaaS web app for restaurant QR ordering and real-time dine-in order operations. The paying/managed tenant is the restaurant. The customer-facing experience is mobile-first web, opened from a table/chair QR code, and must avoid native app installation, customer accounts, and online food checkout in MVP.

The product has four role surfaces:
- Super Admin: seeded platform owner that manages Admin accounts and ownership transfer.
- Platform Admin: internal administrator that manages Restaurant Admin accounts only.
- Restaurant Admin: restaurant owner/operator for exactly one restaurant tenant.
- Customer: anonymous diner ordering through a table/chair QR session.

### Technical Architecture Considerations

The architecture must preserve strict separation between domain rules and technical implementation.

Required architecture patterns:
- Domain Driven Design for business rules and order workflow invariants.
- Layered API pattern: Route -> Controller -> Service -> Domain/Repository.
- Feature-based React organization for customer, restaurant admin, platform admin, menu, seating, QR, orders, subscriptions, and ads.
- `src/utils/**` only for atomic independent helpers.
- `src/lib/**` for third-party integrations and custom wrappers.
- Remote-first D1 migrations with dev/prod environments only.
- Tailwind CSS v4 for UI styling, with design tokens mapped from `docs/ui-design.md`.

### Tenant Model

Tenant model requirements:
- One Restaurant Admin owns exactly one restaurant tenant in MVP.
- Platform Admins create and manage Restaurant Admin accounts but cannot operate restaurants.
- Restaurant operational data must be tenant-scoped: categories, dishes, add-ons, tables, chairs, QR codes, orders, stats, subscription state, and ad state.
- Customer QR sessions must resolve only to the restaurant/table/chair context encoded by the QR token.
- Each submitted order must receive an anonymous order token separate from the reusable table/chair QR token.
- Schema should not block future multi-branch support, even though MVP enforces one Restaurant Admin per restaurant.

### Permission Model

Permission requirements:
- Super Admin can create/manage Admin accounts and transfer ownership.
- Platform Admin can create, update, suspend, reactivate, and inspect Restaurant Admin accounts.
- Platform Admin cannot edit restaurant menu, seating, QR codes, live orders, or operational settings.
- Restaurant Admin can manage exactly one restaurant's profile, menu, stock, seating, QR codes, order board, payment-stage toggle, subscription, ads, and stats.
- Customer can browse menu, submit order, view own order status, cancel while `Pending`, and request payment only from `To Serve` when enabled.
- All role and tenant permissions must be enforced server-side, not only in UI.
- Forbidden access must return consistent errors and produce audit-relevant events.

### Subscription Tiers

MVP subscription model:
- Free tier: ads enabled on allowed dashboard/customer-facing placements; ad-block recovery can block functionality when required ads cannot load.
- Paid tier: PHP 100/month no-ads plan; removes ads from Restaurant Admin dashboard and customer-facing pages.
- PayMongo handles platform subscription billing only.
- PayMongo must not be used for customer food-order checkout in MVP.
- Failed, expired, or cancelled subscriptions return the restaurant tenant to ads-enabled behavior.
- Subscription webhook processing must be verified and idempotent.

### Integration List

Required integrations:
- Cloudflare Workers for Astro SSR/API runtime.
- Cloudflare D1 for tenant, role, menu, seating, QR, order, subscription, analytics, and audit data.
- Cloudflare Durable Objects for WebSocket/live order board and customer status synchronization.
- Cloudflare R2 for dish images and persisted QR assets when needed.
- PayMongo for no-ads subscription billing and webhook events.
- Google AdSense for free-tier ad serving and ad-block recovery, with implementation isolated behind `src/lib/ads/**`.
- Tailwind CSS v4 and `@tailwindcss/vite` for styling.
- React for interactive customer and dashboard surfaces.
- ElysiaJS for API composition where compatible with Cloudflare Workers.

### Compliance Requirements

Compliance is lightweight because MVP is not healthcare, fintech, govtech, native mobile, ecommerce checkout, or customer payment processing.

Compliance requirements:
- Avoid collecting unnecessary customer personal data.
- Keep analytics tenant-scoped.
- Verify PayMongo webhook signatures.
- Keep subscription billing events idempotent and auditable.
- Respect AdSense placement and recovery constraints.
- Do not make ads deceptive, layout-shifting, or obstructive when loaded successfully.
- Maintain accessibility expectations from `docs/ui-design.md`, including WCAG AA contrast, 44px touch targets, keyboard support, and reduced-motion handling.

### Implementation Considerations

SaaS implementation must not flatten restaurant operations into generic CRUD.

Implementation requirements:
- The order workflow must be modeled as domain transitions, not arbitrary status updates.
- `Payment` status is customer-triggered only from `To Serve`.
- Restaurant Admin completes orders after offline settlement.
- `Completed` is a terminal history/statistics state, not an active board column.
- New QR sessions for the same table/chair must not expose previous completed orders.
- Live order state must handle reconnects, duplicate events, stale state, and rejected optimistic updates.
- Out-of-stock dishes and add-ons remain visible but disabled.
- Customer-facing routes must be mobile-first and QR-context aware.
- Admin dashboard routes must prioritize speed, clear status colors, and low-click operational actions.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience + operations MVP.

The MVP must prove the full dine-in ordering loop: a restaurant can be onboarded, configure menu and QR seating, receive anonymous customer orders, manage those orders live, complete them after service/payment flow, and optionally remove ads through subscription.

This is not a menu-only MVP. The useful product is the complete loop from QR scan to completed order.

**Resource Requirements:** MVP requires frontend, backend/domain, Cloudflare infrastructure, database/migration, real-time systems, and product/design coverage. The same engineer may cover multiple areas, but the capability set must include React/Astro/Tailwind, DDD/API design, D1 migrations, Durable Objects/WebSocket behavior, R2 uploads, PayMongo webhooks, and AdSense integration.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Customer scans QR, orders anonymously, tracks live status, cancels while `Pending`, and requests payment from `To Serve` when enabled.
- Restaurant Admin configures restaurant menu, seating, QR codes, order board, subscription, and completed-order stats.
- Platform Admin creates and manages Restaurant Admin accounts without operating restaurants.
- Super Admin manages Platform Admin accounts and ownership transfer.

**Must-Have Capabilities:**
- Seeded unique Super Admin.
- Platform Admin management.
- Restaurant Admin account management.
- One Restaurant Admin per restaurant tenant.
- Tenant-scoped restaurant setup.
- Category-first menu management.
- Dish management with name, picture, price, add-ons, and stock status.
- Add-on management with name, price, and stock status.
- Out-of-stock dishes/add-ons visible but disabled.
- R2-backed dish image upload.
- Table/chair creation, grouping, reordering, editing, archiving.
- QR generation by table or chair.
- QR download and copy URL fallback for generated table/chair QR codes.
- Reusable table/chair QR tokens plus per-order anonymous order tokens.
- Mobile-first anonymous customer ordering.
- 255-character customer order notes.
- Live customer order status.
- Live Restaurant Admin order board.
- Server-validated active order workflow: `Pending -> Preparing -> To Serve -> optional Payment`, followed by completion into history/statistics.
- Customer cancellation while `Pending` only.
- Customer-triggered `Payment` only from `To Serve` when payment stage is enabled.
- Restaurant Admin completion after offline settlement, removing the order from the active board.
- Restaurant-level payment-stage enable/disable toggle.
- Completed-order statistics.
- Free-tier non-intrusive ads.
- Ad-block recovery modal for free tenants when required ads cannot load.
- PHP 100/month no-ads subscription.
- PayMongo subscription billing and idempotent webhook handling.
- Paid tenants bypass ads and ad-block enforcement.
- Expired/failed/cancelled subscriptions return ads.
- Cloudflare Workers deployment target.
- Cloudflare D1 remote-first dev/prod migrations.
- Cloudflare Durable Objects/WebSocket live updates.
- Cloudflare R2 asset storage.
- Astro + React + Tailwind CSS v4 + ElysiaJS architecture.
- Feature-based React, DDD, layered API, `src/utils/**`, and `src/lib/**` standards.

### Post-MVP Features

**Phase 2 (Post-MVP):**
- More detailed analytics by dish, category, table/chair, and service period.
- Staff permission presets beyond the single Restaurant Admin model.
- QR print layout templates.
- Restaurant operating hours and menu availability schedules.
- Advanced cancellation overrides.
- Subscription/payment history improvements.
- CSV export for orders and analytics.
- Ad placement optimization based on real AdSense data.

**Phase 3 (Expansion):**
- Multi-branch support.
- Kitchen display mode.
- Printer integrations.
- Reservation or waitlist module.
- Customer loyalty features.
- White-label domains for paid restaurants.
- Optional online food-order payment integration if product direction changes.

### Risk Mitigation Strategy

**Technical Risks:** Durable Objects/WebSocket behavior, D1 schema design, tenant isolation, and order transition validation are the highest technical risks. Mitigate by building domain tests first, modeling order transitions as explicit domain rules, and isolating Cloudflare/PayMongo/AdSense wrappers in `src/lib/**`.

**Market Risks:** The main market risk is restaurants treating QR ordering as optional novelty instead of daily service infrastructure. Mitigate by prioritizing speed, clear live status, low-click order movement, and frictionless customer ordering over decorative features.

**Resource Risks:** The MVP is broad because the complete value loop requires customer ordering, restaurant operations, platform admin, subscriptions, and infrastructure. If resources tighten, reduce polish and analytics depth first, but do not remove the core QR order loop, live board, tenant roles, or subscription/ad entitlement rules.

## Functional Requirements

### Role & Account Management

- FR1: Super Admin can authenticate as the unique seeded platform owner account.
- FR2: Super Admin can create, update, suspend, and manage Platform Admin accounts.
- FR3: Super Admin can transfer platform ownership to another eligible account.
- FR4: Platform Admin can create, update, suspend, reactivate, and inspect Restaurant Admin accounts.
- FR5: Platform Admin can view tenant account status without modifying restaurant operations.
- FR6: Restaurant Admin can authenticate and access only their assigned restaurant tenant.
- FR7: The system can enforce role-based and tenant-scoped permissions for all protected capabilities.
- FR8: The system can record audit-relevant account and permission events.

### Restaurant Tenant Management

- FR9: Restaurant Admin can manage their restaurant profile and operational settings.
- FR10: Restaurant Admin can enable or disable the payment-request stage for their restaurant.
- FR11: Restaurant Admin can view their subscription/ad entitlement state.
- FR12: The system can prevent a Restaurant Admin from accessing another restaurant tenant.
- FR13: The system can preserve an MVP rule where one Restaurant Admin owns exactly one restaurant tenant.

### Menu & Stock Management

- FR14: Restaurant Admin can create, update, reorder, archive, and view menu categories.
- FR15: Restaurant Admin can create a dish only after assigning it to a category.
- FR16: Restaurant Admin can manage dish name, picture, price, category, add-ons, and stock status.
- FR17: Restaurant Admin can upload and manage dish images.
- FR18: Restaurant Admin can create, update, archive, and view add-ons.
- FR19: Restaurant Admin can manage add-on name, price, and stock status.
- FR20: Customer can see out-of-stock dishes and add-ons as unavailable.
- FR21: Customer cannot select out-of-stock dishes or add-ons.
- FR22: The system can snapshot ordered item names, add-ons, prices, and notes at order submission.

### Seating & QR Management

- FR23: Restaurant Admin can create, update, reorder, archive, and view tables.
- FR24: Restaurant Admin can create, update, reorder, archive, and view chairs.
- FR25: Restaurant Admin can group chairs under tables.
- FR26: Restaurant Admin can move chairs between tables.
- FR27: Restaurant Admin can generate QR codes by table.
- FR28: Restaurant Admin can generate QR codes by chair.
- FR29: Restaurant Admin can archive, regenerate, download, and copy the URL for table/chair QR codes.
- FR30: Customer can open a QR link that resolves to the correct restaurant and table/chair context.
- FR31: The system can keep QR tokens reusable for table/chair access while assigning a separate anonymous token per submitted order.
- FR32: Customer QR sessions can start a new order for a reusable table/chair QR without exposing previous completed orders from that table/chair.

### Customer Ordering

- FR33: Customer can browse a mobile-first restaurant menu from a table/chair QR link.
- FR34: Customer can add available dishes to an order.
- FR35: Customer can select available add-ons for ordered dishes.
- FR36: Customer can update item quantities before submitting an order.
- FR37: Customer can remove items before submitting an order.
- FR38: Customer can add an optional order note up to 255 characters.
- FR39: Customer can submit an anonymous order without creating an account.
- FR40: Customer can view a submitted order's live status using the anonymous order token.
- FR41: Customer can cancel an order only while it is `Pending`.
- FR42: Customer can request payment only when the order is `To Serve` and restaurant payment stage is enabled.

### Order Operations

- FR43: Restaurant Admin can view live incoming orders in `Pending`.
- FR44: Restaurant Admin can view order details including table/chair context, items, add-ons, notes, totals, and timestamps.
- FR45: Restaurant Admin can move an order from `Pending` to `Preparing`.
- FR46: Restaurant Admin can move an order from `Preparing` to `To Serve`.
- FR47: The system can move an order from `To Serve` to `Payment` only when triggered by customer payment request.
- FR48: Restaurant Admin can complete an order from `Payment`, moving it out of the active board into completed order history.
- FR49: Restaurant Admin can complete an order from `To Serve` when restaurant payment stage is disabled, moving it out of the active board into completed order history.
- FR50: The system can reject invalid order status transitions.
- FR51: The system can synchronize active order status updates between customer and Restaurant Admin views.
- FR52: The system can remove completed orders from active table/chair customer visibility while preserving them in Restaurant Admin history and statistics.
- FR53: The system can handle order cancellation conflicts when preparation begins before cancellation is confirmed.

### Dashboard & Statistics

- FR54: Restaurant Admin can view completed-order history.
- FR55: Restaurant Admin can view completed-order statistics.
- FR56: Restaurant Admin can filter or inspect completed orders by date range.
- FR57: Restaurant Admin can view operational order counts by active status.
- FR58: Platform Admin can view tenant-level account and subscription status.
- FR59: Platform Admin can view free vs paid tenant counts.
- FR60: Super Admin can view Admin account status.

### Subscription, Ads & Monetization

- FR61: Restaurant Admin can start a PHP 100/month no-ads subscription.
- FR62: Restaurant Admin can view current plan status.
- FR63: The system can process PayMongo subscription events.
- FR64: The system can remove ads for paid tenants.
- FR65: The system can restore ads when subscription fails, expires, or is cancelled.
- FR66: The system can display non-intrusive ads for free tenants.
- FR67: The system can detect blocked required ads for free tenants.
- FR68: The system can show an ad-block recovery modal when required ads cannot load.
- FR69: The system can block selected free-tenant functionality until ads are allowed or the tenant subscribes.
- FR70: The system can bypass ad loading and ad-block enforcement for paid tenants.

### Live Updates & Resilience

- FR71: Customer can see live order status updates after submitting an order.
- FR72: Restaurant Admin can see live board updates for new and changed active orders.
- FR73: The system can reconnect live sessions after temporary disconnection.
- FR74: The system can reconcile stale order state after reconnect.
- FR75: The system can prevent duplicate live events from creating duplicate orders or invalid state.
- FR76: The system can notify users when an optimistic order action is rejected.

### Asset & Data Management

- FR77: The system can store dish images in R2.
- FR78: The system can store persisted QR assets when required.
- FR79: The system can store tenant, role, menu, seating, QR, active order, completed order, subscription, analytics, and audit data.
- FR80: The system can run D1 migrations against dev and prod environments only.
- FR81: The system can keep customer order sessions anonymous and scoped to QR/order tokens.

### Access Control & Error Handling

- FR82: The system can return consistent forbidden responses for unauthorized actions.
- FR83: The system can show customer-friendly errors for archived QR codes, inactive restaurants, unavailable items, invalid notes, and failed order submission.
- FR84: The system can show Restaurant Admin-friendly errors for rejected order transitions, upload failures, and subscription issues.
- FR85: The system can prevent customer food-order checkout through PayMongo in MVP.

## Non-Functional Requirements

### Performance

- Customer-facing menu pages must reach usable initial load within 2.5 seconds on a typical mobile 4G connection.
- Live order status updates must appear to customers and Restaurant Admins within 2 seconds under normal operating load.
- Restaurant Admin order board actions must show visual feedback within 300ms after a valid click, drag, or drop action.
- If the server rejects an optimistic board action, the UI must roll back and show the rejection reason within 2 seconds.
- QR links must resolve to the correct restaurant/table/chair page with no more than 1 redirect after opening the QR URL.
- Archived, inactive, or invalid QR links must show a customer-friendly error page within 2.5 seconds.
- Active board views must remain usable with at least 50 active orders per restaurant and 5 concurrent Restaurant Admin dashboard clients.
- Live order status updates must still appear within 2 seconds while the restaurant has up to 50 active orders and 5 concurrent Restaurant Admin dashboard clients.

### Reliability & Resilience

- Live order sessions must attempt reconnect automatically after temporary network loss.
- If the network is restored, live customer and Restaurant Admin sessions must reconnect within 10 seconds.
- Reconnected customer sessions must resync to the current order state within 2 seconds using the anonymous order token.
- Reconnected Restaurant Admin boards must resync active orders within 3 seconds.
- Reconnect and resync must not duplicate orders or duplicate status events.
- Optimistic order updates must roll back or show a clear rejection state when server-side validation fails.
- Completed orders must remain available in Restaurant Admin history/statistics even after leaving the active board.
- Reusable table/chair QR codes must never expose previous completed orders to a new customer session.

### Security & Privacy

- All protected dashboard capabilities must enforce role and tenant authorization server-side.
- Customer ordering must remain anonymous in MVP and must not require name, phone number, email, or account creation.
- QR tokens and anonymous order tokens must be non-guessable.
- Customer order visibility must be scoped to the anonymous order token, not only the table/chair QR token.
- Restaurant tenant data must not be accessible across tenants.
- PayMongo webhooks must be signature-verified and idempotent.
- Customer food-order checkout through PayMongo must not exist in MVP.
- Audit events must be recorded for Super Admin ownership transfer, Platform Admin account create/update/suspend/reactivate, Restaurant Admin login/auth failures, permission denials, subscription state changes, PayMongo webhook processing, and invalid order status transition attempts.
- Audit logs must be retained for at least 180 days.

### Accessibility

- Customer-facing pages and dashboards must meet WCAG AA contrast expectations.
- Interactive customer-facing controls must provide at least 44px touch targets.
- Touch-target exceptions are allowed only for non-primary decorative controls or dense admin table controls where an equivalent keyboard or action-menu path is available.
- Order status must not rely on color alone; status text or icons must also be present.
- Keyboard navigation must support core dashboard flows: login, menu CRUD forms, order status movement buttons, and modal actions.
- Motion must respect `prefers-reduced-motion`.
- Form errors and blocked actions must state what failed, why it failed when known, and what the user can do next.
- Customer-facing errors must avoid stack traces, HTTP codes, database errors, provider internals, and other technical wording.

### Integration

- Cloudflare D1 migrations must support dev and prod remote environments only.
- Cloudflare Durable Objects must be treated as the coordination layer for live order/customer status updates.
- Cloudflare R2 must store dish images and persisted QR assets when used.
- PayMongo integration must be isolated to subscription billing and webhook processing.
- Google AdSense/ad-block recovery logic must be isolated so the provider can be replaced if needed.
- Third-party integrations and wrappers must live under `src/lib/**`.

### Maintainability & Architecture

- Business rules must be testable without HTTP, D1, Durable Objects, R2, PayMongo, AdSense, or React.
- APIs must follow Route -> Controller -> Service -> Domain/Repository.
- React code must follow feature-based organization.
- Atomic independent helpers must live under `src/utils/**`.
- Tailwind CSS v4 design tokens must map from `docs/ui-design.md` rather than using scattered one-off styling values.
- Order status transitions must be modeled as explicit domain rules, not arbitrary status mutation.
- Active orders and completed order history must be modeled as separate operational concepts.

### Data Retention & Observability

- Completed orders must be retained for Restaurant Admin history/statistics.
- Analytics must remain tenant-scoped.
- Anonymous customer ordering may store only the anonymous order token, QR/table/chair context, ordered items/add-ons, order note, order status history, timestamps, and technical request metadata needed for abuse/security logs.
- Customer ordering must not store or require customer name, phone, email, password, or account identity in MVP.
- Live update reconnect failures, PayMongo webhook failures, forbidden access attempts, invalid order transitions, QR token resolution failures, and R2 upload failures must be logged with tenant/order context where applicable.
- Critical integration failures must be visible in operational logs within 1 minute of occurrence.
- Subscription state changes must be traceable from PayMongo event to tenant entitlement update.
