---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - 'docs/ui-design.md'
  - 'docs/ui-flow.md'
  - 'docs/reference-inspiration.md'
  - 'docs/reference-inspiration-2-google-stitch.md'
workflowType: 'epics-and-stories'
projectName: 'qr-resto-hub'
createdDate: '2026-05-06'
lastEdited: '2026-05-07'
editHistory:
  - date: '2026-05-07'
    changes: 'Resolved implementation-readiness sequencing issues: moved cross-cutting response/error, request ID, audit writer, and operational logging primitives into Epic 1 foundation; clarified Story 1.3 schema scope; converted Epic 8 into validation/hardening and Story 8.5 into a readiness gate.'
  - date: '2026-05-06'
    changes: 'Aligned stories and requirements with brand-adapted visual guidance from docs/reference-inspiration.md without changing product behavior.'
  - date: '2026-05-06'
    changes: 'Applied an interim Apple-inspired visual story pass, later superseded by the Modern Epicurean direction.'
  - date: '2026-05-06'
    changes: 'Replaced the previous visual story guidance with Modern Epicurean direction from docs/reference-inspiration-2-google-stitch.md.'
---

# qr-resto-hub - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for qr-resto-hub, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Super Admin can authenticate as the unique seeded platform owner account.
FR2: Super Admin can create, update, suspend, and manage Platform Admin accounts.
FR3: Super Admin can transfer platform ownership to another eligible account.
FR4: Platform Admin can create, update, suspend, reactivate, and inspect Restaurant Admin accounts.
FR5: Platform Admin can view tenant account status without modifying restaurant operations.
FR6: Restaurant Admin can authenticate and access only their assigned restaurant tenant.
FR7: The system can enforce role-based and tenant-scoped permissions for all protected capabilities.
FR8: The system can record audit-relevant account and permission events.
FR9: Restaurant Admin can manage their restaurant profile and operational settings.
FR10: Restaurant Admin can enable or disable the payment-request stage for their restaurant.
FR11: Restaurant Admin can view their subscription/ad entitlement state.
FR12: The system can prevent a Restaurant Admin from accessing another restaurant tenant.
FR13: The system can preserve an MVP rule where one Restaurant Admin owns exactly one restaurant tenant.
FR14: Restaurant Admin can create, update, reorder, archive, and view menu categories.
FR15: Restaurant Admin can create a dish only after assigning it to a category.
FR16: Restaurant Admin can manage dish name, picture, price, category, add-ons, and stock status.
FR17: Restaurant Admin can upload and manage dish images.
FR18: Restaurant Admin can create, update, archive, and view add-ons.
FR19: Restaurant Admin can manage add-on name, price, and stock status.
FR20: Customer can see out-of-stock dishes and add-ons as unavailable.
FR21: Customer cannot select out-of-stock dishes or add-ons.
FR22: The system can snapshot ordered item names, add-ons, prices, and notes at order submission.
FR23: Restaurant Admin can create, update, reorder, archive, and view tables.
FR24: Restaurant Admin can create, update, reorder, archive, and view chairs.
FR25: Restaurant Admin can group chairs under tables.
FR26: Restaurant Admin can move chairs between tables.
FR27: Restaurant Admin can generate QR codes by table.
FR28: Restaurant Admin can generate QR codes by chair.
FR29: Restaurant Admin can archive, regenerate, download, and copy the URL for table/chair QR codes.
FR30: Customer can open a QR link that resolves to the correct restaurant and table/chair context.
FR31: The system can keep QR tokens reusable for table/chair access while assigning a separate anonymous token per submitted order.
FR32: Customer QR sessions can start a new order for a reusable table/chair QR without exposing previous completed orders from that table/chair.
FR33: Customer can browse a mobile-first restaurant menu from a table/chair QR link.
FR34: Customer can add available dishes to an order.
FR35: Customer can select available add-ons for ordered dishes.
FR36: Customer can update item quantities before submitting an order.
FR37: Customer can remove items before submitting an order.
FR38: Customer can add an optional order note up to 255 characters.
FR39: Customer can submit an anonymous order without creating an account.
FR40: Customer can view a submitted order's live status using the anonymous order token.
FR41: Customer can cancel an order only while it is `Pending`.
FR42: Customer can request payment only when the order is `To Serve` and restaurant payment stage is enabled.
FR43: Restaurant Admin can view live incoming orders in `Pending`.
FR44: Restaurant Admin can view order details including table/chair context, items, add-ons, notes, totals, and timestamps.
FR45: Restaurant Admin can move an order from `Pending` to `Preparing`.
FR46: Restaurant Admin can move an order from `Preparing` to `To Serve`.
FR47: The system can move an order from `To Serve` to `Payment` only when triggered by customer payment request.
FR48: Restaurant Admin can complete an order from `Payment`, moving it out of the active board into completed order history.
FR49: Restaurant Admin can complete an order from `To Serve` when restaurant payment stage is disabled, moving it out of the active board into completed order history.
FR50: The system can reject invalid order status transitions.
FR51: The system can synchronize active order status updates between customer and Restaurant Admin views.
FR52: The system can remove completed orders from active table/chair customer visibility while preserving them in Restaurant Admin history and statistics.
FR53: The system can handle order cancellation conflicts when preparation begins before cancellation is confirmed.
FR54: Restaurant Admin can view completed-order history.
FR55: Restaurant Admin can view completed-order statistics.
FR56: Restaurant Admin can filter or inspect completed orders by date range.
FR57: Restaurant Admin can view operational order counts by active status.
FR58: Platform Admin can view tenant-level account and subscription status.
FR59: Platform Admin can view free vs paid tenant counts.
FR60: Super Admin can view Admin account status.
FR61: Restaurant Admin can start a PHP 100/month no-ads subscription.
FR62: Restaurant Admin can view current plan status.
FR63: The system can process PayMongo subscription events.
FR64: The system can remove ads for paid tenants.
FR65: The system can restore ads when subscription fails, expires, or is cancelled.
FR66: The system can display non-intrusive ads for free tenants.
FR67: The system can detect blocked required ads for free tenants.
FR68: The system can show an ad-block recovery modal when required ads cannot load.
FR69: The system can block selected free-tenant functionality until ads are allowed or the tenant subscribes.
FR70: The system can bypass ad loading and ad-block enforcement for paid tenants.
FR71: Customer can see live order status updates after submitting an order.
FR72: Restaurant Admin can see live board updates for new and changed active orders.
FR73: The system can reconnect live sessions after temporary disconnection.
FR74: The system can reconcile stale order state after reconnect.
FR75: The system can prevent duplicate live events from creating duplicate orders or invalid state.
FR76: The system can notify users when an optimistic order action is rejected.
FR77: The system can store dish images in R2.
FR78: The system can store persisted QR assets when required.
FR79: The system can store tenant, role, menu, seating, QR, active order, completed order, subscription, analytics, and audit data.
FR80: The system can run D1 migrations against dev and prod environments only.
FR81: The system can keep customer order sessions anonymous and scoped to QR/order tokens.
FR82: The system can return consistent forbidden responses for unauthorized actions.
FR83: The system can show customer-friendly errors for archived QR codes, inactive restaurants, unavailable items, invalid notes, and failed order submission.
FR84: The system can show Restaurant Admin-friendly errors for rejected order transitions, upload failures, and subscription issues.
FR85: The system can prevent customer food-order checkout through PayMongo in MVP.

### NonFunctional Requirements

NFR1: Customer-facing menu pages must reach usable initial load within 2.5 seconds on a typical mobile 4G connection.
NFR2: Live order status updates must appear to customers and Restaurant Admins within 2 seconds under normal operating load.
NFR3: Restaurant Admin order board actions must show visual feedback within 300ms after a valid click, drag, or drop action.
NFR4: If the server rejects an optimistic board action, the UI must roll back and show the rejection reason within 2 seconds.
NFR5: QR links must resolve to the correct restaurant/table/chair page with no more than 1 redirect after opening the QR URL.
NFR6: Archived, inactive, or invalid QR links must show a customer-friendly error page within 2.5 seconds.
NFR7: Active board views must remain usable with at least 50 active orders per restaurant and 5 concurrent Restaurant Admin dashboard clients.
NFR8: Live order status updates must still appear within 2 seconds while the restaurant has up to 50 active orders and 5 concurrent Restaurant Admin dashboard clients.
NFR9: Live order sessions must attempt reconnect automatically after temporary network loss.
NFR10: If the network is restored, live customer and Restaurant Admin sessions must reconnect within 10 seconds.
NFR11: Reconnected customer sessions must resync to the current order state within 2 seconds using the anonymous order token.
NFR12: Reconnected Restaurant Admin boards must resync active orders within 3 seconds.
NFR13: Reconnect and resync must not duplicate orders or duplicate status events.
NFR14: Optimistic order updates must roll back or show a clear rejection state when server-side validation fails.
NFR15: Completed orders must remain available in Restaurant Admin history/statistics even after leaving the active board.
NFR16: Reusable table/chair QR codes must never expose previous completed orders to a new customer session.
NFR17: All protected dashboard capabilities must enforce role and tenant authorization server-side.
NFR18: Customer ordering must remain anonymous in MVP and must not require name, phone number, email, or account creation.
NFR19: QR tokens and anonymous order tokens must be non-guessable.
NFR20: Customer order visibility must be scoped to the anonymous order token, not only the table/chair QR token.
NFR21: Restaurant tenant data must not be accessible across tenants.
NFR22: PayMongo webhooks must be signature-verified and idempotent.
NFR23: Customer food-order checkout through PayMongo must not exist in MVP.
NFR24: Audit events must be recorded for Super Admin ownership transfer, Platform Admin account create/update/suspend/reactivate, Restaurant Admin login/auth failures, permission denials, subscription state changes, PayMongo webhook processing, and invalid order status transition attempts.
NFR25: Audit logs must be retained for at least 180 days.
NFR26: Customer-facing pages and dashboards must meet WCAG AA contrast expectations.
NFR27: Interactive customer-facing controls must provide at least 44px touch targets.
NFR28: Touch-target exceptions are allowed only for non-primary decorative controls or dense admin table controls where an equivalent keyboard or action-menu path is available.
NFR29: Order status must not rely on color alone; status text or icons must also be present.
NFR30: Keyboard navigation must support core dashboard flows: login, menu CRUD forms, order status movement buttons, and modal actions.
NFR31: Motion must respect `prefers-reduced-motion`.
NFR32: Form errors and blocked actions must state what failed, why it failed when known, and what the user can do next.
NFR33: Customer-facing errors must avoid stack traces, HTTP codes, database errors, provider internals, and other technical wording.
NFR34: Cloudflare D1 migrations must support dev and prod remote environments only.
NFR35: Cloudflare Durable Objects must be treated as the coordination layer for live order/customer status updates.
NFR36: Cloudflare R2 must store dish images and persisted QR assets when used.
NFR37: PayMongo integration must be isolated to subscription billing and webhook processing.
NFR38: Google AdSense/ad-block recovery logic must be isolated so the provider can be replaced if needed.
NFR39: Third-party integrations and wrappers must live under `src/lib/**`.
NFR40: Elysia API endpoints must generate OpenAPI/Swagger documentation that includes request body, route params, query params, response schemas per status code, summary, description, tags, and security metadata where applicable.
NFR41: Elysia route contracts must use TypeBox/Elysia `t` schemas as the source for API validation and documentation.
NFR42: Business rules must be testable without HTTP, D1, Durable Objects, R2, PayMongo, AdSense, or React.
NFR43: APIs must follow Route -> Controller -> Service -> Domain/Repository.
NFR44: Elysia route handlers must only adapt the request, call controllers, and return controller results; business logic must live in services/domain modules.
NFR45: TypeBox/Elysia `t` must be used for Elysia API schemas; Zod is allowed only for non-Elysia validation such as environment/config parsing or isolated internal helpers.
NFR46: React code must follow feature-based organization.
NFR47: Atomic independent helpers must live under `src/utils/**`.
NFR48: User-added files in `src/utils/**` and `src/lib/**` must be treated as intentional project knowledge; agents must inspect and prefer reuse before duplicating, replacing, or bypassing them.
NFR49: Agents may promote genuinely shared atomic logic into `src/utils/**` or integration/provider wrappers into `src/lib/**` when it improves reuse, consistency, or boundary separation.
NFR50: Tailwind CSS v4 design tokens must map from `docs/ui-design.md` rather than using scattered one-off styling values.
NFR51: Order status transitions must be modeled as explicit domain rules, not arbitrary status mutation.
NFR52: Active orders and completed order history must be modeled as separate operational concepts.
NFR53: Completed orders must be retained for Restaurant Admin history/statistics.
NFR54: Analytics must remain tenant-scoped.
NFR55: Anonymous customer ordering may store only the anonymous order token, QR/table/chair context, ordered items/add-ons, order note, order status history, timestamps, and technical request metadata needed for abuse/security logs.
NFR56: Customer ordering must not store or require customer name, phone, email, password, or account identity in MVP.
NFR57: Live update reconnect failures, PayMongo webhook failures, forbidden access attempts, invalid order transitions, QR token resolution failures, and R2 upload failures must be logged with tenant/order context where applicable.
NFR58: Critical integration failures must be visible in operational logs within 1 minute of occurrence.
NFR59: Subscription state changes must be traceable from PayMongo event to tenant entitlement update.

### Additional Requirements

AR1: Initialize the project from the Cloudflare C3 Astro starter using `npm create cloudflare@latest -- qr-resto-hub --framework=astro`, preserving existing planning artifacts.
AR2: Add Tailwind CSS v4 through Astro's current Tailwind integration flow after starter initialization.
AR3: Add React, ElysiaJS, `@elysiajs/openapi`, TypeBox schemas, Drizzle, Drizzle Kit, Vitest, D1, R2, and Durable Object bindings during foundation setup.
AR4: Use D1 as the source of truth; Durable Objects coordinate live sessions and recover state from D1 after reconnects.
AR5: Use Drizzle ORM and Drizzle Kit for schema, typed queries, and remote-first dev/prod D1 migrations.
AR6: Use TypeBox/Elysia `t` as the HTTP contract source for request, params, query, headers, and response schemas.
AR7: Use `@elysiajs/openapi` to generate OpenAPI/Swagger documentation from route contracts.
AR8: Keep Elysia route handlers free of business logic; route handlers adapt requests, call controllers, and return controller results.
AR9: Use Zod only outside Elysia route contracts, such as environment/config parsing or isolated internal helpers.
AR10: Implement custom dashboard authentication with D1-backed sessions, HttpOnly secure cookies, Workers-compatible password hashing, per-user salts, and secret pepper configuration.
AR11: Enforce role and tenant guards server-side before protected service actions execute.
AR12: Use REST-style JSON APIs grouped by feature areas: auth, platform-admin, restaurant-admin, restaurant-settings, menu, seating-qr, customer-ordering, orders, subscriptions-ads, assets, and audit.
AR13: Standardize API responses as `{ data, meta }` for success and `{ error: { code, message, details } }` for errors.
AR14: Document all error envelopes in each Elysia route's OpenAPI response map.
AR15: Use feature-based React modules for customer-ordering, restaurant-orders, menu-management, seating-qr, platform-admin, super-admin, and subscriptions-ads.
AR16: Use `src/components/**` for shared primitives/layouts/feedback/navigation/data-display and `src/features/**/components/**` for feature-owned components.
AR17: Compose middleware through `src/middleware/index.ts` with focused middleware files for auth session, tenant context, role guard, ad entitlement, request ID, and error boundary.
AR18: Keep third-party integrations and custom provider wrappers under `src/lib/**`.
AR19: Keep atomic independent helpers under `src/utils/**`; agents must inspect and prefer reuse of user-added helpers/wrappers before duplicating them.
AR20: Agents may promote shared atomic logic into `src/utils/**` or integration/provider wrappers into `src/lib/**` when it improves reuse and preserves boundaries.
AR21: Use plural `snake_case` database tables, `snake_case` columns, `id` primary keys, `{entity}_id` foreign keys, `idx_{table}_{columns}` indexes, and `uq_{table}_{columns}` unique constraints.
AR22: Use plural kebab-case REST endpoints, Elysia params like `/:restaurantId`, camelCase public JSON/query fields, and feature-matched OpenAPI tags.
AR23: Use dot notation for live event names, including `order.created`, `order.status_changed`, `order.cancelled`, `order.completed`, and `board.resynced`.
AR24: Live event payloads include `eventId`, `eventType`, `restaurantId`, `orderId`, `version`, `occurredAt`, and `payload`.
AR25: Use `@dnd-kit/core` and `@dnd-kit/sortable` for Restaurant Admin drag/drop with button and keyboard alternatives.
AR26: Use `qrcode` for QR image generation and download.
AR27: Domain rules must have unit tests before live board and Durable Object behavior depend on them.
AR28: Build foundation stories before feature stories: scaffold, dependencies, DDD folders, auth/RBAC, menu/seating/QR, order transitions, Durable Objects, PayMongo, and ads.
AR29: Observability must include live reconnect failures, webhook failures, forbidden access, invalid transitions, QR resolution failures, and R2 upload failures with tenant/order context.
AR30: Tailwind CSS v4 tokens and shared primitives must incorporate the Modern Epicurean direction from `docs/reference-inspiration-2-google-stitch.md`: cream/parchment surfaces, cocoa ink, orange action/focus states, olive dietary/secondary markers, Plus Jakarta Sans headings, Inter body/UI text, restrained status colors, and operational dashboard density.

### UX Design Requirements

UX-DR1: Implement a custom Tailwind CSS v4 design system using documented tokens for color, status color, typography, spacing, radius, elevation, and motion.
UX-DR2: Build shared primitives for Button, IconButton, Input, Textarea, Select, Checkbox, Toggle, Badge, StatusBadge, Card, Modal, BottomSheet, Toast, Tabs, SegmentedControl, DropdownMenu, DataTable, EmptyState, Skeleton, LiveStatusIndicator, and ConfirmDialog.
UX-DR3: Implement DishCard with image, name, description, price, add-on indicator, stock badge, selected/disabled/loading/archive states, and screen-reader-readable stock status.
UX-DR4: Implement DishDetailSheet as a mobile bottom sheet with image, description, add-ons, quantity stepper, note field, sticky add-to-order button, focus trap, and 255-character note counter behavior.
UX-DR5: Implement CartFooter with item count, total, sticky mobile placement, valid/empty/submitting states, and accessible action label.
UX-DR6: Implement OrderTimeline for customer live status with Pending, Preparing, To Serve, optional Payment, Completed, Cancelled, reconnecting, and stale states.
UX-DR7: Implement OrderBoard with active columns only, status counts, filters, sound toggle, reconnect indicator, optimistic movement, rollback, loading, empty, connected, reconnecting, and disconnected states.
UX-DR8: Implement BoardColumn with status header, count, valid/invalid drag-over states, disabled state when status is unavailable, and screen-reader-readable status/count.
UX-DR9: Implement OrderCard with order number, table/chair context, elapsed time, item count, note indicator, total, status badge, next action, dragging/updating/rejected/stale/new states, and accessible action announcement.
UX-DR10: Implement OrderDetailModal with metadata, itemized list, add-ons, note, totals, valid status actions, close behavior, loading/action-pending/action-rejected/completed states, and focus management.
UX-DR11: Implement SeatingMap for table cards, chair chips, chair grouping, reorder/move behavior, archive/selected/editing states, and edit-menu alternatives to drag operations.
UX-DR12: Implement QRDisplay with QR image, table/chair label, URL preview, copy URL, download, print, regenerate, archive, copied/generated/loading/archived/print-ready states, and visible text context.
UX-DR13: Implement AccountTable for Platform Admin and Super Admin with search, filters, sortable columns, status badges, row actions, pagination, loading, empty, filtered empty, active/suspended, and action-pending states.
UX-DR14: Implement AdBlockRecoveryModal for free tenants with explanation, allow-ads refresh action, subscribe/remove-ads path, detected/rechecking/resolved/paid-bypass states, focus trap, and clear blocking copy.
UX-DR15: Customer flow must remain shallow and mobile-first: QR context/menu, dish sheet, cart/review, and live status.
UX-DR16: Customer pages must show restaurant and table/chair context before ordering actions.
UX-DR17: Customer menu must use sticky restaurant/table/chair header, horizontal category tabs, mobile-optimized dish cards, bottom sheets, and sticky bottom cart/action bars.
UX-DR18: Out-of-stock dishes and add-ons remain visible but disabled, with text/icon treatment and screen-reader announcement.
UX-DR19: Customer cancellation appears only while Pending; payment request appears only at To Serve when enabled; disabled actions must explain why unavailable.
UX-DR20: Restaurant Admin live board must show Pending, Preparing, To Serve, and optional Payment only; Completed appears in history/statistics and customer final state, not as an active lane.
UX-DR21: Restaurant Admin order movement must support drag/drop and keyboard/button alternatives.
UX-DR22: Live surfaces must show connected, reconnecting, stale/disconnected, last-updated, and rollback/rejection feedback.
UX-DR23: Invalid optimistic board actions must roll back and show a toast or inline explanation.
UX-DR24: Platform Admin navigation must remain account-focused and must not expose restaurant operation controls.
UX-DR25: Super Admin navigation must remain narrow: Admin Accounts, Ownership Transfer, Audit/Activity where available, and Settings.
UX-DR26: Use consistent status names everywhere: Pending, Preparing, To Serve, Payment, Completed, and Cancelled.
UX-DR27: Button hierarchy must distinguish primary, secondary, danger, icon, and disabled states with tooltips/accessible labels where needed.
UX-DR28: Forms must keep visible labels, required markers, field-level errors, stable save button width, and preserve input after validation errors.
UX-DR29: Customer order note fields must show a 255-character counter and warning behavior near the limit.
UX-DR30: Image upload UX must show preview, uploading, failure, and remove states.
UX-DR31: Confirmation dialogs must be used for destructive, irreversible, or authority-changing actions, including QR archive/regenerate, account suspension, cancellation, and ownership transfer.
UX-DR32: Ownership transfer must explain consequences, require deliberate confirmation, require password re-entry, and record an audit event.
UX-DR33: Empty states must explain what appears and how to create first items for orders, categories, tables, and QR codes.
UX-DR34: Loading states must use skeletons for menus, boards, tables, and cards, and button-level loading for actions.
UX-DR35: Recovery states must cover network reconnect, invalid QR, archived QR, inactive restaurant, rejected order transition, cancellation race, PayMongo/subscription issue, R2 upload failure, and forbidden access.
UX-DR36: Free-tier ad placements must be non-intrusive and must not cover primary ordering actions when ads load successfully.
UX-DR37: Paid tenants must bypass all ad loading and ad-block recovery friction.
UX-DR38: Customer surfaces must be fully usable from 320px width; Restaurant Admin board may horizontally scroll below desktop; Platform/Super Admin tables may collapse on tablet while preserving desktop table priority.
UX-DR39: Fixed-format UI elements such as boards, QR previews, toolbars, counters, and cards must use stable dimensions to avoid layout shift.
UX-DR40: Accessibility target is WCAG AA, including contrast, visible focus, 44px customer touch targets, keyboard navigation, labeled icons, field-associated errors, modal/sheet focus trap, reduced-motion support, and polite live regions.
UX-DR41: Responsive testing must cover customer flow at 320px, 375px, 390px, 430px, 768px, and desktop widths.
UX-DR42: Accessibility testing must cover keyboard-only navigation, screen reader labels, reduced motion, status badges, disabled action explanations, and touch target sizes.
UX-DR43: Performance/resilience UX testing must verify menu load target, live updates within target, reconnect state/resync behavior, and optimistic rollback explanation.
UX-DR44: Customer-facing menu, dish detail, cart, QR, live status, subscription, empty, and onboarding surfaces should use Modern Epicurean product-first presentation: cream/parchment surfaces, cocoa ink, orange CTAs, olive markers, crisp food/restaurant imagery, quiet chrome, glassy overlays, restrained warm elevation, and confident spacing.
UX-DR45: Admin operational surfaces must not copy sparse Apple-style marketing layouts; Restaurant Admin, Platform Admin, and Super Admin screens must preserve compact scanability, explicit labels, status clarity, and low-click operations.
UX-DR46: Sterile cool-toned wellness palettes and cool gradients must be avoided; olive is allowed only for dietary tags, sustainable/health markers, and subtle confirmed/secondary states.

### FR Coverage Map

FR1: Epic 1 - Super Admin authentication.
FR2: Epic 1 - Super Admin Platform Admin account management.
FR3: Epic 1 - Super Admin ownership transfer.
FR4: Epic 1 - Platform Admin Restaurant Admin account management.
FR5: Epic 1 - Platform Admin tenant account status visibility.
FR6: Epic 1 - Restaurant Admin tenant-scoped authentication.
FR7: Epic 1 - Role and tenant permission enforcement.
FR8: Epic 1 and Epic 8 - Audit-relevant account and permission events.
FR9: Epic 1 - Restaurant profile and operational settings.
FR10: Epic 1 - Restaurant payment-stage setting.
FR11: Epic 1 - Restaurant subscription/ad entitlement visibility.
FR12: Epic 1 - Cross-tenant access prevention.
FR13: Epic 1 - One Restaurant Admin per restaurant tenant.
FR14: Epic 2 - Menu category management.
FR15: Epic 2 - Category-required dish creation.
FR16: Epic 2 - Dish details, image, price, add-ons, and stock management.
FR17: Epic 2 - Dish image upload and management.
FR18: Epic 2 - Add-on management.
FR19: Epic 2 - Add-on price and stock management.
FR20: Epic 4 - Customer out-of-stock visibility.
FR21: Epic 4 - Customer out-of-stock selection prevention.
FR22: Epic 4 - Ordered item snapshot at submission.
FR23: Epic 3 - Table management.
FR24: Epic 3 - Chair management.
FR25: Epic 3 - Chair grouping under tables.
FR26: Epic 3 - Chair movement between tables.
FR27: Epic 3 - Table QR generation.
FR28: Epic 3 - Chair QR generation.
FR29: Epic 3 - QR archive, regenerate, download, and copy URL.
FR30: Epic 3 - QR link restaurant/table/chair resolution.
FR31: Epic 3 - Reusable QR tokens plus per-order anonymous tokens.
FR32: Epic 3 - Reusable QR privacy for future sessions.
FR33: Epic 4 - Mobile-first customer menu browsing.
FR34: Epic 4 - Customer available dish selection.
FR35: Epic 4 - Customer available add-on selection.
FR36: Epic 4 - Customer item quantity updates.
FR37: Epic 4 - Customer item removal.
FR38: Epic 4 - Customer 255-character order note.
FR39: Epic 4 - Anonymous order submission.
FR40: Epic 4 - Customer live status via anonymous order token.
FR41: Epic 5 - Customer cancellation while Pending.
FR42: Epic 5 - Customer payment request from To Serve when enabled.
FR43: Epic 5 - Restaurant Admin live Pending orders.
FR44: Epic 5 - Restaurant Admin order details.
FR45: Epic 5 - Pending to Preparing transition.
FR46: Epic 5 - Preparing to To Serve transition.
FR47: Epic 5 - Customer-triggered To Serve to Payment transition.
FR48: Epic 5 - Payment to completed history.
FR49: Epic 5 - To Serve to completed history when payment stage disabled.
FR50: Epic 5 - Invalid status transition rejection.
FR51: Epic 5 - Customer/admin active order synchronization.
FR52: Epic 5 - Completed order removal from active customer visibility.
FR53: Epic 5 - Cancellation conflict handling.
FR54: Epic 6 - Completed-order history.
FR55: Epic 6 - Completed-order statistics.
FR56: Epic 6 - Completed-order date filtering/inspection.
FR57: Epic 6 - Active status operational counts.
FR58: Epic 1 - Platform Admin tenant/subscription status visibility.
FR59: Epic 1 - Platform Admin free vs paid tenant counts.
FR60: Epic 1 - Super Admin Admin account status visibility.
FR61: Epic 7 - Restaurant Admin no-ads subscription start.
FR62: Epic 7 - Current plan status visibility.
FR63: Epic 7 - PayMongo subscription event processing.
FR64: Epic 7 - Paid tenant ad removal.
FR65: Epic 7 - Ad restoration after failed/expired/cancelled subscription.
FR66: Epic 7 - Free-tenant non-intrusive ads.
FR67: Epic 7 - Free-tenant ad-block detection.
FR68: Epic 7 - Ad-block recovery modal.
FR69: Epic 7 - Free-tenant functionality blocking when ads are blocked.
FR70: Epic 7 - Paid tenant ad/ad-block bypass.
FR71: Epic 5 - Customer live status updates.
FR72: Epic 5 - Restaurant Admin live board updates.
FR73: Epic 5 - Live session reconnect.
FR74: Epic 5 - Stale state reconciliation after reconnect.
FR75: Epic 5 - Duplicate live event prevention.
FR76: Epic 5 - Rejected optimistic action notification.
FR77: Epic 2 - R2 dish image storage.
FR78: Epic 3 - Persisted QR asset storage.
FR79: Epic 8 - Tenant, role, menu, seating, QR, order, subscription, analytics, and audit data storage.
FR80: Epic 1 - D1 dev/prod migration support.
FR81: Epic 4 - Anonymous customer order sessions scoped to QR/order tokens.
FR82: Epic 1 and Epic 8 - Consistent forbidden responses.
FR83: Epic 4 - Customer-friendly errors.
FR84: Epic 1, feature stories, and Epic 8 - Restaurant Admin-friendly errors.
FR85: Epic 7 - No customer food-order checkout through PayMongo.

## Epic List

### Epic 1: Platform Foundation, Authentication & Tenant Administration

Super Admin and Platform Admins can securely initialize the platform, manage admin accounts, onboard Restaurant Admins, and enforce tenant/role boundaries.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR58, FR59, FR60, FR80, FR82, FR84

**Implementation notes:** This epic establishes the Cloudflare Astro foundation, D1/Drizzle migration base, authentication/session model, server-side RBAC/tenant guards, OpenAPI/TypeBox route contract rules, standardized response/error envelopes, forbidden response mapping, request ID propagation, audit writer primitives, operational logging primitives, and the account administration surfaces needed by all later epics.

### Epic 2: Restaurant Menu, Add-ons, Stock & Asset Management

Restaurant Admins can build a category-first menu, manage dishes/add-ons, upload images, and control stock state.

**FRs covered:** FR14, FR15, FR16, FR17, FR18, FR19, FR77

**Implementation notes:** This epic delivers the menu domain before customer ordering so orders can snapshot dish/add-on names, prices, notes, and stock state correctly.

### Epic 3: Seating Plan & QR Access Management

Restaurant Admins can create tables/chairs, group and move chairs, generate reusable QR codes, download/copy QR links, and manage QR lifecycle.

**FRs covered:** FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR78

**Implementation notes:** This epic delivers QR context routing and QR privacy rules before anonymous ordering. QR tokens remain reusable, while submitted orders receive separate anonymous order tokens.

### Epic 4: Anonymous Customer Menu, Cart & Order Submission

Customers can scan QR codes, browse a mobile-first menu, select available dishes/add-ons, submit anonymous orders, and track their own order token without account friction.

**FRs covered:** FR20, FR21, FR22, FR33, FR34, FR35, FR36, FR37, FR38, FR39, FR40, FR81, FR83

**Implementation notes:** This epic delivers the first complete customer value loop up to submitted order and order-token status view, using the menu and QR foundations from Epics 2 and 3.

### Epic 5: Live Order Workflow & Real-Time Status Operations

Restaurant Admins and customers can see synchronized live order states, with valid transitions, cancellation/payment rules, conflict handling, reconnects, and optimistic rollback.

**FRs covered:** FR41, FR42, FR43, FR44, FR45, FR46, FR47, FR48, FR49, FR50, FR51, FR52, FR53, FR71, FR72, FR73, FR74, FR75, FR76

**Implementation notes:** This epic turns submitted orders into the operational service board. It depends on domain transition rules, Durable Object live coordination, and D1 as the recovery source after reconnects.

### Epic 6: Completed Order History & Restaurant Statistics

Restaurant Admins can review completed orders, inspect history, filter by date range, and view operational counts/statistics outside the active board.

**FRs covered:** FR54, FR55, FR56, FR57

**Implementation notes:** This epic uses completed order data from Epic 5 and keeps `Completed` out of the active board while preserving restaurant history/statistics.

### Epic 7: Subscription, Ads & No-Ads Entitlement

Restaurant Admins can subscribe to the PHP 100/month no-ads plan, while the platform manages PayMongo events, free-tier ads, ad-block recovery, and paid-tenant bypass.

**FRs covered:** FR61, FR62, FR63, FR64, FR65, FR66, FR67, FR68, FR69, FR70, FR85

**Implementation notes:** This epic keeps PayMongo limited to subscription billing and isolates PayMongo/AdSense behind provider wrappers. Paid tenants bypass all ad loading and ad-block enforcement.

### Epic 8: Audit, Data Governance & Operational Hardening

The platform verifies and hardens audit-relevant events, tenant/order/subscription/audit data safety, consistent forbidden/admin errors, and production operational behavior after the shared primitives have been established in Epic 1 and used by feature stories.

**FRs covered:** FR8, FR79, FR82, FR84

**Implementation notes:** This epic validates and hardens cross-cutting concerns already established by Epic 1 and threaded through feature stories. It should verify coverage, close gaps, and strengthen retention/data-governance behavior rather than introducing shared error, audit, or logging primitives for the first time.

## Epic 1: Platform Foundation, Authentication & Tenant Administration

Super Admin and Platform Admins can securely initialize the platform, manage admin accounts, onboard Restaurant Admins, and enforce tenant/role boundaries.

### Story 1.1: Scaffold Cloudflare Astro Platform Foundation

As a developer,
I want the project scaffolded with Astro, React, Tailwind CSS v4, Elysia, D1, R2, Durable Objects, Drizzle, Vitest, and OpenAPI support,
So that all future features follow the approved architecture from the start.

**Acceptance Criteria:**

**Given** the repository contains planning artifacts and no source implementation yet
**When** the foundation is scaffolded
**Then** the project uses the current Cloudflare Astro starter and preserves existing planning artifacts
**And** Astro, React, Tailwind CSS v4, Elysia, `@elysiajs/openapi`, Drizzle, Drizzle Kit, Vitest, D1, R2, and Durable Object bindings are configured for Cloudflare Workers deployment
**And** Tailwind CSS v4 is configured through the approved Astro/Vite flow
**And** package scripts exist for development, type checking, testing, building, and Wrangler deployment
**And** the setup supports only `dev` and `prod` D1 environments
**And** the generated structure does not add customer food-order PayMongo checkout.

### Story 1.2: Establish DDD, API, Middleware, Lib, Utils, and Component Structure

As a developer,
I want the source tree organized around feature-based React, DDD, layered APIs, focused middleware, shared components, `src/lib/**`, and `src/utils/**`,
So that implementation remains consistent for future development work.

**Acceptance Criteria:**

**Given** the scaffolded project exists
**When** the application structure is created
**Then** source folders separate domain, services, repositories, controllers, routes, middleware, features, shared components, libraries, and utilities according to the architecture
**And** API code follows Route -> Controller -> Service -> Domain/Repository boundaries
**And** Elysia route handlers contain only request adaptation, route contract metadata, controller calls, and response return logic
**And** Elysia route contracts use TypeBox/Elysia `t` schemas for params, query, body, headers, and responses
**And** OpenAPI/Swagger documentation is generated from route contracts with summary, description, tags, security metadata where applicable, and response schemas per status code
**And** Zod is reserved for non-Elysia validation such as environment/config parsing or isolated internal helpers
**And** shared UI primitives live under `src/components/**`, feature-owned components live under `src/features/**/components/**`, third-party wrappers live under `src/lib/**`, and atomic helpers live under `src/utils/**`
**And** existing or future user-added files under `src/lib/**` and `src/utils/**` are treated as intentional project knowledge to inspect and reuse before duplication
**And** standardized API success helpers produce `{ data, meta }` envelopes and standardized error helpers produce `{ error: { code, message, details } }` envelopes
**And** forbidden response mapping, public-safe error message mapping, request ID propagation, and OpenAPI error response metadata helpers are available for all later route groups
**And** an audit event writer interface and operational logging utility are available for later stories to record permission denials, auth failures, account changes, invalid transitions, provider failures, QR failures, R2 failures, and live reconnect failures without re-creating logging patterns
**And** Tailwind CSS v4 tokens and shared primitives incorporate `docs/ui-design.md` plus the Modern Epicurean guidance from `docs/reference-inspiration-2-google-stitch.md` with cream/parchment surfaces, cocoa ink, orange action/focus states, olive markers, and restrained status colors
**And** the visual system does not copy Apple-specific branding, SF Pro typography, Apple navigation patterns, negative tracking, or device/product-page composition.

### Story 1.3: Configure Remote-First D1 Schema and Migrations for Platform Accounts

As a developer,
I want remote-first D1 migration setup plus the initial account, role, session, tenant, restaurant, minimal entitlement visibility, and audit tables needed for platform access,
So that authentication and administration have a stable data foundation.

**Acceptance Criteria:**

**Given** the project foundation and structure exist
**When** the initial database schema and migrations are added
**Then** Drizzle schema and migration configuration support dev and prod remote D1 environments only
**And** tables use plural `snake_case` names, `snake_case` columns, `id` primary keys, `{entity}_id` foreign keys, `idx_{table}_{columns}` indexes, and `uq_{table}_{columns}` unique constraints
**And** the schema supports Super Admin, Platform Admin, Restaurant Admin, restaurant tenant, one Restaurant Admin to one restaurant in MVP, sessions, minimal subscription/ad entitlement visibility needed for account and tenant status screens, and audit event recording
**And** the migration can seed exactly one Super Admin owner account
**And** the schema supports server-side tenant scoping for protected Restaurant Admin capabilities
**And** PayMongo subscription event tables, ad provider state tables, detailed analytics tables, menu tables, seating tables, QR tables, and order tables are not created before their owning stories need them.

### Story 1.4: Seed Unique Super Admin and Implement Dashboard Authentication

As a Super Admin or admin user,
I want secure login and logout with D1-backed sessions and a unique seeded Super Admin account,
So that protected dashboards are accessible only to valid platform users.

**Acceptance Criteria:**

**Given** the initial account/session schema exists
**When** the Super Admin seed is applied
**Then** exactly one active Super Admin owner account exists
**And** duplicate Super Admin owner creation is rejected or prevented by constraints
**And** dashboard users can log in with valid credentials and receive an HttpOnly secure session cookie
**And** dashboard users can log out and invalidate the active session
**And** invalid credentials fail without exposing whether an email/account exists
**And** password hashing is Workers-compatible and uses per-user salts plus configured secret pepper
**And** Restaurant Admin, Platform Admin, and Super Admin sessions can be resolved server-side for protected requests
**And** authentication failures and login events are audit-ready.

### Story 1.5: Enforce Role-Based and Tenant-Scoped Authorization

As the platform,
I want server-side role and tenant guards on all protected capabilities,
So that Super Admin, Platform Admin, and Restaurant Admin permissions cannot leak across boundaries.

**Acceptance Criteria:**

**Given** authenticated dashboard sessions can be resolved
**When** a protected API or page action is requested
**Then** the system enforces role permissions before protected service actions execute
**And** Restaurant Admin requests are scoped to only their assigned restaurant tenant
**And** Platform Admin users can manage Restaurant Admin account records but cannot modify restaurant operations
**And** Super Admin users can manage Platform Admin accounts and ownership transfer but do not bypass tenant-operation rules unless explicitly required by a platform administration story
**And** cross-tenant access attempts are rejected with a consistent forbidden response
**And** unauthorized actions return the standardized error envelope
**And** permission denials are recorded as audit-relevant events.

### Story 1.6: Manage Platform Admin Accounts as Super Admin

As a Super Admin,
I want to create, update, suspend, reactivate, inspect, and transfer ownership to eligible Platform Admin accounts,
So that platform ownership and administration can be controlled safely.

**Acceptance Criteria:**

**Given** a Super Admin is authenticated
**When** the Super Admin manages Platform Admin accounts
**Then** the Super Admin can create, update, suspend, reactivate, and inspect Platform Admin accounts
**And** suspended Platform Admins cannot authenticate or perform protected actions
**And** the Super Admin can view Platform Admin account status
**And** ownership transfer is allowed only to an eligible active account
**And** ownership transfer requires deliberate confirmation and password re-entry
**And** ownership transfer preserves the unique Super Admin owner rule
**And** account management and ownership transfer actions are recorded as audit-relevant events
**And** API routes for these actions include OpenAPI documentation for request body, route params, response schemas, summary, description, tags, and relevant error statuses.

### Story 1.7: Manage Restaurant Admin Accounts as Platform Admin

As a Platform Admin,
I want to create, update, suspend, reactivate, and inspect Restaurant Admin accounts,
So that restaurants can be onboarded and managed without touching restaurant operations.

**Acceptance Criteria:**

**Given** a Platform Admin is authenticated
**When** the Platform Admin manages Restaurant Admin accounts
**Then** the Platform Admin can create, update, suspend, reactivate, and inspect Restaurant Admin accounts
**And** each Restaurant Admin is assigned to exactly one restaurant tenant in MVP
**And** the Platform Admin can view tenant-level account and subscription status
**And** the Platform Admin can view free vs paid tenant counts
**And** Platform Admin screens do not expose menu, seating, QR, order board, or restaurant operation controls
**And** suspended Restaurant Admins cannot authenticate or perform protected restaurant actions
**And** account create, update, suspend, and reactivate actions are recorded as audit-relevant events
**And** API routes for these actions use standardized success and error envelopes.

### Story 1.8: Manage Restaurant Profile and Operational Settings

As a Restaurant Admin,
I want to manage my assigned restaurant profile, payment-stage setting, and subscription/ad entitlement visibility,
So that my restaurant can control operational behavior within its own tenant.

**Acceptance Criteria:**

**Given** a Restaurant Admin is authenticated and assigned to one restaurant tenant
**When** the Restaurant Admin views restaurant settings
**Then** only the assigned restaurant profile and settings are visible
**And** the Restaurant Admin can update permitted restaurant profile fields
**And** the Restaurant Admin can enable or disable the customer-triggered payment-request stage
**And** the Restaurant Admin can view current subscription/ad entitlement state without direct PayMongo customer food-order checkout
**And** payment-stage changes affect later order workflow rules without creating customer payment collection in MVP
**And** cross-tenant settings access is rejected with a consistent forbidden response
**And** settings update failures show Restaurant Admin-friendly errors
**And** settings changes are audit-ready where relevant.

## Epic 2: Restaurant Menu, Add-ons, Stock & Asset Management

Restaurant Admins can build a category-first menu, manage dishes/add-ons, upload images, and control stock state.

### Story 2.1: Manage Menu Categories

As a Restaurant Admin,
I want to create, update, reorder, archive, and view menu categories,
So that dishes can be organized before they are added.

**Acceptance Criteria:**

**Given** a Restaurant Admin is authenticated and scoped to their assigned restaurant
**When** the Restaurant Admin creates a menu category
**Then** the category is created only for that restaurant tenant
**And** the category can be viewed in restaurant menu management
**And** the Restaurant Admin can update the category name and display order
**And** the Restaurant Admin can archive a category without deleting historical references
**And** archived categories are excluded from active menu creation choices unless explicitly shown by an admin filter
**And** category management forms show visible labels, required markers, field-level errors, and stable save button behavior
**And** cross-tenant category access is rejected with a consistent forbidden response.

### Story 2.2: Create and Manage Dishes Under Categories

As a Restaurant Admin,
I want to create and update dishes only after assigning them to a category,
So that the menu stays structured and customer browsing remains clear.

**Acceptance Criteria:**

**Given** at least one active category exists for the restaurant
**When** the Restaurant Admin creates a dish
**Then** the dish requires an active category assignment
**And** the dish can store name, description where supported by the UI, price, category, display order, and archive state
**And** the Restaurant Admin can update dish details without affecting historical order snapshots
**And** dish prices are validated as valid non-negative PHP currency values according to the approved money model
**And** dish creation is rejected when no category is selected or when the selected category belongs to another tenant
**And** menu management shows loading, empty, filtered empty, validation-error, and save-pending states
**And** API routes for dish actions use TypeBox/Elysia schemas and documented success/error responses.

### Story 2.3: Upload and Manage Dish Images in R2

As a Restaurant Admin,
I want to upload, preview, replace, and remove dish images,
So that customers can visually inspect menu items.

**Acceptance Criteria:**

**Given** a Restaurant Admin is editing a dish in their restaurant tenant
**When** the Restaurant Admin uploads a valid dish image
**Then** the image is stored in Cloudflare R2 through a wrapper under `src/lib/**`
**And** the dish record stores the image reference needed to render the image later
**And** the UI shows preview, uploading, successful replacement, removal, and failure states
**And** invalid file type, oversized file, provider failure, and cross-tenant dish access are rejected with Restaurant Admin-friendly errors
**And** R2 upload failures are logged with tenant and dish context
**And** replacing or removing an image does not break historical order snapshots
**And** customer-facing image reads do not expose private R2 implementation details.

### Story 2.4: Manage Dish Stock Visibility

As a Restaurant Admin,
I want to mark dishes as in stock or out of stock while keeping them visible,
So that customers know the item exists but cannot select unavailable dishes.

**Acceptance Criteria:**

**Given** a dish exists for the Restaurant Admin's tenant
**When** the Restaurant Admin changes the dish stock state
**Then** the dish can be marked in stock or out of stock
**And** out-of-stock dishes remain visible in menu management and customer-facing menu data
**And** out-of-stock dishes are clearly labeled with status text or icon treatment and do not rely on color alone
**And** customer-facing selection of out-of-stock dishes is blocked by the domain/service layer, not only by the UI
**And** stock changes are tenant-scoped and reject cross-tenant dish access
**And** stock controls are accessible by keyboard and expose a clear disabled/loading state during updates
**And** changes appear in customer menu reads within the normal data-refresh expectations for the app.

### Story 2.5: Manage Dish Add-ons

As a Restaurant Admin,
I want to create, update, archive, price, and stock-control add-ons for dishes,
So that customers can customize available menu items later.

**Acceptance Criteria:**

**Given** a dish exists for the Restaurant Admin's tenant
**When** the Restaurant Admin manages add-ons for that dish
**Then** add-ons can store name, price, stock state, display order where supported, and archive state
**And** add-ons are scoped to their parent dish and restaurant tenant
**And** out-of-stock add-ons remain visible but disabled in customer-facing menu data
**And** customer-facing selection of out-of-stock add-ons is blocked by the domain/service layer
**And** archived add-ons are not offered for new customer selections
**And** add-on prices are validated as valid non-negative PHP currency values according to the approved money model
**And** add-on management uses accessible controls with visible labels, field-level errors, and clear save/remove states
**And** API routes for add-on actions document route params, body, success responses, and relevant validation/forbidden errors.

### Story 2.6: Expose Menu Data for Customer Ordering

As the system,
I want customer-facing menu reads to return categories, dishes, images, add-ons, prices, and stock states,
So that the customer ordering flow can safely use menu data without allowing out-of-stock selections.

**Acceptance Criteria:**

**Given** a customer-facing menu page requests menu data for a valid restaurant context
**When** the menu data is returned
**Then** active categories, active dishes, dish images, available add-ons, prices, and stock states are included
**And** out-of-stock dishes and add-ons are included as visible but unavailable
**And** archived categories, dishes, and add-ons are excluded from customer ordering selections
**And** customer-facing menu responses avoid exposing dashboard-only fields, internal R2 details, and cross-tenant data
**And** the response shape supports mobile-first DishCard and DishDetailSheet UI requirements
**And** customer-friendly errors are returned for inactive restaurants, archived resources, unavailable menu data, and invalid tenant context
**And** menu read performance supports the customer-facing usable initial load target.

## Epic 3: Seating Plan & QR Access Management

Restaurant Admins can create tables/chairs, group and move chairs, generate reusable QR codes, download/copy QR links, and manage QR lifecycle.

### Story 3.1: Manage Restaurant Tables

As a Restaurant Admin,
I want to create, update, reorder, archive, and view tables,
So that my restaurant seating structure can be represented in the dashboard.

**Acceptance Criteria:**

**Given** a Restaurant Admin is authenticated and scoped to their assigned restaurant
**When** the Restaurant Admin manages tables
**Then** tables can be created only within the assigned restaurant tenant
**And** tables can store a visible label/name, display order, active/archive state, and timestamps
**And** the Restaurant Admin can update, reorder, archive, and view tables
**And** archived tables are excluded from new customer QR access unless explicitly viewed by an admin
**And** table management screens show loading, empty, editing, archive-confirmation, validation-error, and save-pending states
**And** destructive table archive actions require confirmation
**And** cross-tenant table access is rejected with a consistent forbidden response.

### Story 3.2: Manage Chairs and Group Them Under Tables

As a Restaurant Admin,
I want to create, update, reorder, archive, and group chairs under tables,
So that QR access can target either a full table or a specific chair.

**Acceptance Criteria:**

**Given** at least one active table exists for the restaurant
**When** the Restaurant Admin manages chairs
**Then** chairs can be created under a table within the same restaurant tenant
**And** chairs can store a visible label/name, display order, active/archive state, parent table, and timestamps
**And** the Restaurant Admin can update, reorder, archive, and view chairs grouped under tables
**And** archived chairs are excluded from new customer QR access unless explicitly viewed by an admin
**And** SeatingMap UI represents tables as table cards and chairs as chair chips
**And** chair grouping remains accessible through edit-menu alternatives, not only drag/drop
**And** cross-tenant table/chair grouping is rejected with a consistent forbidden response.

### Story 3.3: Move Chairs Between Tables

As a Restaurant Admin,
I want to move chairs between tables using drag/drop or edit controls,
So that seating layouts can be adjusted without recreating QR access.

**Acceptance Criteria:**

**Given** a Restaurant Admin has at least two active tables and at least one active chair
**When** the Restaurant Admin moves a chair from one table to another
**Then** the chair's parent table is updated within the same restaurant tenant
**And** the move can be performed through drag/drop where available
**And** the move can also be performed through keyboard-accessible edit controls
**And** invalid moves, archived targets, and cross-tenant targets are rejected
**And** the UI shows valid drag-over, invalid drag-over, updating, rejected, and saved states
**And** moving a chair does not invalidate reusable QR access unless the Restaurant Admin explicitly regenerates or archives QR access
**And** the seating display remains stable without layout shift during drag/drop and updates.

### Story 3.4: Generate Table and Chair QR Codes

As a Restaurant Admin,
I want to generate reusable QR codes for tables and chairs,
So that customers can open the correct anonymous ordering context.

**Acceptance Criteria:**

**Given** active tables and/or chairs exist for the restaurant
**When** the Restaurant Admin generates QR access
**Then** the system can generate a reusable QR token for a table
**And** the system can generate a reusable QR token for a chair
**And** QR tokens are non-guessable and scoped to the correct restaurant and table/chair context
**And** QR generation uses the approved QR generation library/wrapper and can persist QR assets when required
**And** QRDisplay shows the QR image, table/chair label, URL preview, generated/loading state, and archived state
**And** generation is rejected for archived tables/chairs and cross-tenant seating resources
**And** generated QR URLs resolve with no more than one redirect.

### Story 3.5: Download, Copy, Print, Archive, and Regenerate QR Access

As a Restaurant Admin,
I want to download QR images, copy QR URLs, print QR assets, archive QR codes, and regenerate QR access,
So that I can manage real-world restaurant QR usage and fallbacks.

**Acceptance Criteria:**

**Given** QR access exists for a table or chair
**When** the Restaurant Admin views the QRDisplay controls
**Then** the Restaurant Admin can download the QR image
**And** the Restaurant Admin can copy the QR URL as a fallback for indirect sharing
**And** the Restaurant Admin can print a QR-ready asset with visible restaurant and table/chair context
**And** the Restaurant Admin can archive QR access after confirmation
**And** the Restaurant Admin can regenerate QR access after confirmation, invalidating the previous QR token for future scans
**And** copied, downloading, print-ready, archived, regenerating, and failed states are visible and accessible
**And** archived QR links show customer-friendly errors instead of exposing technical details
**And** QR archive/regenerate actions are audit-ready where relevant.

### Story 3.6: Resolve QR Links to Customer Context

As a customer,
I want a scanned QR link to resolve to the correct restaurant and table/chair context,
So that I can order without creating an account.

**Acceptance Criteria:**

**Given** a customer opens a table or chair QR link
**When** the QR token is valid and active
**Then** the customer is routed to the mobile-first customer menu context for the correct restaurant and table/chair
**And** the customer does not need to create an account, enter a name, phone number, email, or password
**And** customer pages show restaurant and table/chair context before ordering actions
**And** invalid, archived, inactive restaurant, or inactive seating QR links show customer-friendly error pages within the target load time
**And** QR resolution does not expose internal tenant IDs, database errors, stack traces, or provider internals
**And** QR resolution failures are logged with safe tenant/QR context where available
**And** QR access remains reusable for future customer sessions until archived or regenerated.

### Story 3.7: Protect Reusable QR Privacy With Separate Order Tokens

As the system,
I want reusable table/chair QR tokens to be separate from per-order anonymous tokens,
So that new customers never see previous completed orders for the same table or chair.

**Acceptance Criteria:**

**Given** a reusable table or chair QR token is scanned by multiple customers over time
**When** a customer submits an order later in the customer ordering flow
**Then** the submitted order receives a separate non-guessable anonymous order token
**And** customer order visibility is scoped to the anonymous order token, not only the table/chair QR token
**And** completed orders are removed from active table/chair customer visibility while remaining available in Restaurant Admin history and statistics
**And** a new customer who scans the same reusable QR after a previous order is completed cannot see the previous order
**And** reusable QR access cannot be used by itself to inspect historical completed orders
**And** reconnect and status lookup behavior must use the anonymous order token once an order exists
**And** privacy behavior is enforced by the domain/service layer and covered by tests before live order behavior depends on it.

## Epic 4: Anonymous Customer Menu, Cart & Order Submission

Customers can scan QR codes, browse a mobile-first menu, select available dishes/add-ons, submit anonymous orders, and track their own order token without account friction.

### Story 4.1: Render Mobile-First QR Customer Menu

As an anonymous customer,
I want to open a QR link and browse a mobile-first menu with restaurant and table/chair context,
So that I can start ordering without downloading an app or creating an account.

**Acceptance Criteria:**

**Given** a customer opens a valid table or chair QR link on a mobile browser
**When** the customer menu loads
**Then** the page shows the restaurant name and table/chair context before ordering actions
**And** the customer can browse active categories and dishes in a mobile-first layout
**And** the customer does not need to download an app or create an account
**And** the menu uses sticky restaurant/table/chair context, horizontal category tabs, mobile-optimized dish cards, and a sticky cart/action area
**And** the customer menu uses Modern Epicurean product-first presentation with cream/parchment surfaces, cocoa ink, orange primary actions, crisp food imagery, quiet chrome, restrained warm elevation, and enough whitespace for ordering confidence
**And** sterile cool-toned wellness colors do not appear as menu backgrounds, food image treatments, category tab color, or primary action color
**And** the customer-facing page is usable from 320px width
**And** usable initial load meets the customer-facing performance target under typical mobile conditions
**And** invalid or inactive QR contexts are handled by the customer-friendly error story instead of exposing technical details.

### Story 4.2: View Dish Details and Select Available Items

As an anonymous customer,
I want to open dish details, choose quantities, and select available add-ons,
So that I can customize my order.

**Acceptance Criteria:**

**Given** the customer is viewing the mobile-first menu
**When** the customer opens an available dish
**Then** the DishDetailSheet shows dish image, name, description where available, price, available add-ons, quantity controls, and add-to-order action
**And** dish imagery receives visual priority without hiding required price, add-on, stock, note, quantity, or action controls
**And** available add-ons can be selected before adding the dish to the cart
**And** quantity controls support increasing and decreasing quantity within valid limits
**And** the bottom sheet provides focus management, accessible labels, and reduced-motion support
**And** the add-to-order action shows valid, disabled, and submitting states
**And** selected dish and add-on prices are calculated from current menu data before submission
**And** the UI does not allow archived dishes or add-ons to be selected.

### Story 4.3: Prevent Unavailable Item and Add-on Selection

As the system,
I want out-of-stock dishes and add-ons to remain visible but unselectable,
So that customers understand availability without submitting invalid orders.

**Acceptance Criteria:**

**Given** a menu contains out-of-stock dishes or add-ons
**When** the customer browses the menu
**Then** out-of-stock dishes and add-ons remain visible
**And** out-of-stock dishes and add-ons are labeled with text or icon treatment and do not rely on color alone
**And** out-of-stock dishes cannot be added to the cart
**And** out-of-stock add-ons cannot be selected
**And** disabled states explain why the action is unavailable
**And** server-side submission validation rejects any out-of-stock dish or add-on even if the client state is stale
**And** rejected stale selections show customer-friendly recovery messaging.

### Story 4.4: Manage Cart and Order Note Before Submission

As an anonymous customer,
I want to review cart items, update quantities, remove items, and leave an optional note up to 255 characters,
So that I can confirm the order before sending it.

**Acceptance Criteria:**

**Given** the customer has added one or more available dishes to the cart
**When** the customer reviews the cart
**Then** the cart shows item names, quantities, selected add-ons, item totals, and order total
**And** the customer can update item quantities before submitting
**And** the customer can remove items before submitting
**And** the customer can add an optional order note with a hard maximum of 255 characters
**And** the note field shows a character counter and near-limit warning behavior
**And** empty cart, valid cart, submitting, validation-error, and failed-submission states are visible
**And** cart controls use mobile-friendly touch targets and accessible labels.

### Story 4.5: Submit Anonymous Order With Snapshot Pricing

As an anonymous customer,
I want to submit my cart without an account,
So that the restaurant receives my order with table/chair context and stable item snapshots.

**Acceptance Criteria:**

**Given** the customer has a valid QR context and a valid cart
**When** the customer submits the order
**Then** an anonymous order is created without customer name, phone, email, password, or account identity
**And** the order stores restaurant, table/chair context, ordered item snapshots, add-on snapshots, prices, order note, totals, status history, timestamps, and the technical request metadata needed for abuse/security logs
**And** the order starts in `Pending`
**And** the submitted order receives a separate non-guessable anonymous order token
**And** ordered item names, add-on names, prices, and notes are snapshotted at submission
**And** invalid notes, unavailable items, archived QR contexts, inactive restaurants, and stale menu prices are rejected with customer-friendly errors
**And** no PayMongo customer food-order checkout is created in MVP.

### Story 4.6: View Submitted Order Status by Anonymous Order Token

As an anonymous customer,
I want to see my submitted order status using my anonymous order token,
So that I can track progress without exposing other table/chair orders.

**Acceptance Criteria:**

**Given** the customer successfully submitted an order
**When** the customer opens the order status view
**Then** the status view resolves the order by anonymous order token
**And** the customer can see the current order status and item summary for only that submitted order
**And** the OrderTimeline supports Pending, Preparing, To Serve, optional Payment, Completed, Cancelled, reconnecting, and stale states
**And** order visibility is scoped to the anonymous order token, not only the reusable table/chair QR token
**And** completed orders can be shown as the final state for that order token but are not exposed to future customers scanning the same table/chair QR
**And** invalid or expired order tokens show customer-friendly errors
**And** live-update behavior can be added by the later live order workflow epic without changing the token privacy model.

### Story 4.7: Handle Customer-Friendly QR/Menu/Submission Errors

As an anonymous customer,
I want clear mobile-friendly errors for invalid QR, inactive restaurant, archived QR, unavailable item, invalid note, or failed submission,
So that I know what to do next.

**Acceptance Criteria:**

**Given** a customer-facing QR, menu, cart, or submission action fails
**When** the error is shown to the customer
**Then** the message states what failed and what the customer can do next when known
**And** the error avoids stack traces, HTTP codes, database errors, provider internals, and technical wording
**And** invalid QR, archived QR, inactive restaurant, unavailable item, invalid note, failed order submission, and network failure states are handled
**And** failed order submission preserves the customer's cart and note where safe
**And** the customer can retry recoverable actions
**And** customer error pages and modals remain usable on mobile screens from 320px width
**And** QR token resolution failures and failed submissions are logged with safe tenant/order context where applicable.

## Epic 5: Live Order Workflow & Real-Time Status Operations

Restaurant Admins and customers can see synchronized live order states, with valid transitions, cancellation/payment rules, conflict handling, reconnects, and optimistic rollback.

### Story 5.1: Model Order Status Transition Domain Rules

As the system,
I want explicit domain rules for order transitions,
So that invalid moves like customer-triggered Payment from the wrong state or cancellation after Preparing are rejected consistently.

**Acceptance Criteria:**

**Given** an order exists with a current status
**When** a status transition is requested
**Then** the domain layer validates the transition against explicit order workflow rules
**And** valid active statuses include `Pending`, `Preparing`, `To Serve`, and optional `Payment`
**And** `Completed` is modeled as a terminal history state, not an active board lane
**And** Restaurant Admin can move `Pending` to `Preparing`
**And** Restaurant Admin can move `Preparing` to `To Serve`
**And** only a customer payment request can move `To Serve` to `Payment` when payment stage is enabled
**And** Restaurant Admin can complete from `Payment`, or from `To Serve` when payment stage is disabled
**And** customer cancellation is valid only while the order is `Pending`
**And** invalid transitions are rejected consistently and recorded as audit-relevant events.

### Story 5.2: Build Restaurant Admin Active Order Board

As a Restaurant Admin,
I want to view active orders in Pending, Preparing, To Serve, and optional Payment columns,
So that I can operate the restaurant workflow in real time.

**Acceptance Criteria:**

**Given** a Restaurant Admin is authenticated and scoped to their restaurant
**When** the Restaurant Admin opens the active order board
**Then** active orders are grouped into `Pending`, `Preparing`, `To Serve`, and `Payment` only when payment stage is enabled
**And** completed orders do not appear as an active board column
**And** each order card shows order number, table/chair context, elapsed time, item count, note indicator, total, status badge, and next valid action
**And** the board shows status counts, filters where supported, sound toggle where supported, reconnect indicator, loading, empty, connected, reconnecting, and disconnected states
**And** order status does not rely on color alone
**And** board actions are keyboard accessible through button alternatives
**And** the board remains usable with at least 50 active orders and 5 concurrent Restaurant Admin dashboard clients.

### Story 5.3: Move Orders by Button and Drag/Drop With Rollback

As a Restaurant Admin,
I want to move orders using buttons or drag/drop,
So that I can progress orders quickly while invalid actions roll back clearly.

**Acceptance Criteria:**

**Given** active orders are visible on the Restaurant Admin board
**When** the Restaurant Admin moves an order using a valid button action or drag/drop action
**Then** the order status is updated according to domain transition rules
**And** valid movement shows visual feedback within the target interaction time
**And** drag/drop uses the approved DnD library with keyboard/button alternatives
**And** invalid movement targets show invalid drag-over or disabled states before submission where possible
**And** if the server rejects an optimistic board action, the UI rolls back and shows the rejection reason within the target rollback time
**And** duplicate clicks, stale order versions, and race conditions cannot create invalid state transitions
**And** rejected optimistic actions notify the Restaurant Admin with a toast or inline explanation.

### Story 5.4: View Active Order Details and Complete Eligible Orders

As a Restaurant Admin,
I want to inspect order details and complete eligible To Serve or Payment orders into history,
So that completed orders leave the active board and table/chair customer view.

**Acceptance Criteria:**

**Given** a Restaurant Admin opens an active order
**When** the order detail modal is displayed
**Then** the modal shows table/chair context, itemized dishes, add-ons, notes, totals, timestamps, and current status
**And** only valid next actions are available for the order's current status
**And** Restaurant Admin can complete an order from `Payment`
**And** Restaurant Admin can complete an order from `To Serve` when payment stage is disabled
**And** completed orders move out of the active board into completed order history
**And** completed orders are removed from reusable table/chair customer visibility while preserving the original order-token final state
**And** completed modal state, action-pending state, rejected state, and focus management are handled accessibly
**And** completion emits the required live update event.

### Story 5.5: Customer Pending Cancellation

As an anonymous customer,
I want to cancel my order only while it is Pending,
So that I can correct mistakes before preparation starts.

**Acceptance Criteria:**

**Given** a customer is viewing their submitted order by anonymous order token
**When** the order is `Pending`
**Then** the customer can request cancellation
**And** the cancellation action requires clear confirmation
**And** a successful cancellation moves the order to `Cancelled`
**And** cancelled orders stop appearing as active kitchen work
**And** when the order has already moved to `Preparing`, cancellation is rejected
**And** cancellation race conflicts show a customer-friendly message explaining that preparation has already started
**And** cancellation updates are synchronized to the Restaurant Admin board.

### Story 5.6: Customer Payment Request From To Serve

As an anonymous customer,
I want to request payment only when my order is To Serve and the restaurant has payment stage enabled,
So that Payment is customer-triggered and not an admin lane move.

**Acceptance Criteria:**

**Given** a customer is viewing their submitted order by anonymous order token
**When** the order is `To Serve` and the restaurant payment stage is enabled
**Then** the customer can request payment
**And** the payment request moves the order from `To Serve` to `Payment`
**And** Restaurant Admin cannot move an order from `To Serve` to `Payment` directly
**And** payment request is not shown before `To Serve`
**And** payment request is not shown when the restaurant payment stage is disabled
**And** customer food-order checkout through PayMongo is not created in MVP
**And** the payment request emits live updates to both customer and Restaurant Admin views
**And** invalid payment requests are rejected with customer-friendly errors.

### Story 5.7: Durable Object Live Order Events and Board Sync

As the system,
I want Durable Objects to coordinate live order events for customers and Restaurant Admin dashboards,
So that new orders and status changes appear quickly.

**Acceptance Criteria:**

**Given** orders are created or changed for a restaurant
**When** a live event is emitted
**Then** Durable Objects coordinate live delivery to connected Restaurant Admin boards and customer order-status views
**And** live event names use dot notation, including `order.created`, `order.status_changed`, `order.cancelled`, `order.completed`, and `board.resynced`
**And** live event payloads include `eventId`, `eventType`, `restaurantId`, `orderId`, `version`, `occurredAt`, and `payload`
**And** new customer orders appear in the Restaurant Admin `Pending` column within the live update target
**And** status changes appear to customers and Restaurant Admins within the live update target under normal load
**And** D1 remains the source of truth while Durable Objects coordinate live sessions
**And** live delivery failures are logged with tenant/order context where applicable.

### Story 5.8: Reconnect, Resync, and Duplicate Event Protection

As the system,
I want live sessions to reconnect, resync from D1, and ignore duplicate events,
So that temporary network failures do not corrupt order state.

**Acceptance Criteria:**

**Given** a customer or Restaurant Admin live session temporarily disconnects
**When** the network becomes available again
**Then** the session attempts automatic reconnect
**And** customer sessions resync to the current order state using the anonymous order token
**And** Restaurant Admin boards resync active orders for the scoped restaurant
**And** reconnect and resync do not duplicate orders or duplicate status events
**And** stale order state is reconciled from D1 after reconnect
**And** reconnecting, stale, last-updated, disconnected, and resynced states are visible in the UI
**And** duplicate live events are ignored by event/version checks
**And** reconnect failures are logged and visible in operational logs within the required timeframe.

## Epic 6: Completed Order History & Restaurant Statistics

Restaurant Admins can review completed orders, inspect history, filter by date range, and view operational counts/statistics outside the active board.

### Story 6.1: Persist Completed Orders Into History

As the system,
I want completed orders to leave the active board and remain stored in completed history,
So that old table/chair QR users do not see previous orders but admins keep records.

**Acceptance Criteria:**

**Given** an eligible order is completed by a Restaurant Admin
**When** the order reaches `Completed`
**Then** the order is removed from active board queries
**And** the order remains available in completed order history for the same restaurant tenant
**And** the reusable table/chair QR context no longer exposes the completed order to future customer sessions
**And** the anonymous order token may still show the final completed state for that specific submitted order
**And** completed-order persistence preserves item snapshots, add-on snapshots, prices, notes, totals, table/chair context, timestamps, and status history
**And** completed orders remain tenant-scoped and inaccessible across tenants
**And** completion emits or records data needed by later statistics queries.

### Story 6.2: View Completed Order History

As a Restaurant Admin,
I want to view completed orders in history,
So that I can inspect past restaurant activity outside the active board.

**Acceptance Criteria:**

**Given** completed orders exist for a Restaurant Admin's restaurant
**When** the Restaurant Admin opens completed order history
**Then** the page lists completed orders for only the assigned restaurant tenant
**And** each history entry shows order number, table/chair context, completed time, item count, total, and relevant status summary
**And** completed history is separate from the active order board
**And** loading, empty, filtered empty, pagination or incremental loading where needed, and error states are handled
**And** history data does not expose other tenants' orders
**And** customer identity fields such as name, phone, email, password, or account identity are absent because customer ordering is anonymous in MVP
**And** the page remains usable with keyboard navigation and screen-reader-readable order summaries.

### Story 6.3: Filter and Inspect Completed Orders by Date Range

As a Restaurant Admin,
I want to filter completed orders by date range and inspect their details,
So that I can review past service periods.

**Acceptance Criteria:**

**Given** the Restaurant Admin is viewing completed order history
**When** the Restaurant Admin applies a date range filter
**Then** the list returns only completed orders within the selected date range for the restaurant tenant
**And** invalid date ranges show field-level validation errors
**And** the Restaurant Admin can open a completed order detail view
**And** the completed order detail shows table/chair context, itemized dishes, add-ons, notes, totals, submitted/completed timestamps, and status history
**And** completed order details are read-only
**And** filters preserve accessible labels and keyboard navigation
**And** query responses use the standardized success and error envelopes.

### Story 6.4: View Restaurant Order Statistics

As a Restaurant Admin,
I want to view completed-order statistics and active status counts,
So that I can understand current and historical order volume.

**Acceptance Criteria:**

**Given** a Restaurant Admin opens the restaurant statistics dashboard
**When** order statistics are loaded
**Then** the dashboard shows completed order counts for the selected date range
**And** the dashboard shows active operational counts by status
**And** statistics are scoped to the Restaurant Admin's assigned restaurant tenant
**And** completed-order statistics use completed history, not active board rows
**And** loading, empty, partial-data, and error states are handled
**And** statistics avoid exposing customer identity because customer ordering is anonymous in MVP
**And** API routes for statistics document query params, success response, validation errors, and forbidden responses.

## Epic 7: Subscription, Ads & No-Ads Entitlement

Restaurant Admins can subscribe to the PHP 100/month no-ads plan, while the platform manages PayMongo events, free-tier ads, ad-block recovery, and paid-tenant bypass.

### Story 7.1: View Free/Paid Entitlement and Ads State

As a Restaurant Admin,
I want to view my current free or paid no-ads entitlement,
So that I understand whether ads and ad-block recovery apply to my restaurant and customers.

**Acceptance Criteria:**

**Given** a Restaurant Admin is authenticated and scoped to their assigned restaurant
**When** the Restaurant Admin views subscription or plan settings
**Then** the current free or paid entitlement state is visible
**And** the Restaurant Admin can see whether ads apply to dashboard and customer-facing pages
**And** the Restaurant Admin can see whether ad-block recovery applies
**And** paid, free, expired, failed, cancelled, and loading states are represented clearly
**And** entitlement data is scoped to the Restaurant Admin's tenant
**And** Platform Admin can view tenant-level account and subscription status without modifying restaurant operations
**And** subscription status reads use standardized success and error envelopes.

### Story 7.2: Start PHP 100/Month No-Ads Subscription Through PayMongo

As a Restaurant Admin,
I want to start a PHP 100/month no-ads subscription,
So that ads are removed from my dashboard and customer-facing pages.

**Acceptance Criteria:**

**Given** a Restaurant Admin is authenticated and currently eligible to subscribe
**When** the Restaurant Admin starts the no-ads subscription flow
**Then** the system creates or opens a PayMongo subscription flow for PHP 100/month
**And** PayMongo integration is isolated under `src/lib/**`
**And** the subscription flow is associated with the correct restaurant tenant
**And** payment/subscription errors show Restaurant Admin-friendly recovery messages
**And** no PayMongo customer food-order checkout exists in MVP
**And** successful subscription initiation does not mark the tenant as paid until confirmed by trusted PayMongo subscription state
**And** subscription start routes document request body, success response, validation errors, provider errors, and forbidden responses.

### Story 7.3: Process PayMongo Subscription Webhooks Idempotently

As the system,
I want to verify and process PayMongo subscription events idempotently,
So that tenant ad entitlement stays correct even with retries.

**Acceptance Criteria:**

**Given** PayMongo sends a subscription webhook event
**When** the webhook endpoint receives the event
**Then** the webhook signature is verified before processing
**And** duplicate webhook events are safely ignored or replayed idempotently
**And** subscription state changes are traceable from PayMongo event to tenant entitlement update
**And** relevant events update paid/free entitlement state for the correct restaurant tenant
**And** webhook processing records audit-relevant subscription state changes
**And** webhook failures are logged with provider event and tenant context where available
**And** webhook routes use documented response schemas for accepted, rejected, duplicate, and error cases.

### Story 7.4: Restore Ads When Subscription Ends or Fails

As the system,
I want ads to return when a subscription expires, fails, or is cancelled,
So that free-tier monetization resumes correctly.

**Acceptance Criteria:**

**Given** a tenant previously had paid no-ads entitlement
**When** the subscription expires, fails, is cancelled, or otherwise loses paid entitlement
**Then** the tenant returns to free-tier ad state
**And** ads are eligible to appear again on Restaurant Admin dashboard surfaces and customer-facing pages
**And** ad-block recovery applies again to selected free-tenant functionality
**And** entitlement changes are reflected in Restaurant Admin plan settings
**And** subscription state changes are audit-ready and visible in operational logs when failures occur
**And** paid bypass does not persist after entitlement loss
**And** stale entitlement cache or session state cannot continue suppressing ads after the accepted refresh window.

### Story 7.5: Display Non-Intrusive Free-Tier Ads

As the platform,
I want to show non-intrusive ads for free tenants,
So that monetization does not block normal ordering when ads load successfully.

**Acceptance Criteria:**

**Given** a restaurant tenant is on the free tier
**When** Restaurant Admin dashboard or customer-facing pages render ad-supported surfaces
**Then** non-intrusive ad placements can load through the approved ad provider wrapper under `src/lib/**`
**And** ads do not cover primary ordering actions when ads load successfully
**And** ad placements respect the quiet Modern Epicurean visual system and do not compete with food imagery, QR context, order status, or primary actions
**And** customer-facing pages remain mobile-first and usable at 320px width
**And** ad placement logic is isolated so the provider can be replaced later
**And** paid tenants do not load ad scripts or placements
**And** ad loading failures degrade into the ad-block recovery flow only when required ads are blocked or unavailable according to the free-tier rules
**And** ads and ad state do not expose cross-tenant data.

### Story 7.6: Detect Ad Blocking and Show Recovery Modal

As the platform,
I want to detect blocked required ads for free tenants and show an ad-block recovery modal,
So that selected functionality can be paused until ads are allowed or the tenant subscribes.

**Acceptance Criteria:**

**Given** a tenant is on the free tier
**When** required ads are blocked or fail the approved ad-block detection check
**Then** the system shows an AdBlockRecoveryModal on selected gated functionality
**And** the modal explains the issue, provides an allow-ads refresh path, and provides a subscribe/remove-ads path
**And** selected free-tenant functionality is blocked until ads are allowed or the tenant becomes paid
**And** successfully loaded non-intrusive ads do not trigger the modal
**And** paid tenants bypass the modal entirely
**And** the modal supports detected, rechecking, resolved, and paid-bypass states
**And** the modal uses focus trap, clear blocking copy, accessible controls, and mobile-friendly layout.

### Story 7.7: Bypass Ads and Ad-Block Enforcement for Paid Tenants

As a paid Restaurant Admin,
I want ads and ad-block recovery fully bypassed,
So that my dashboard and customer pages stay clean.

**Acceptance Criteria:**

**Given** a restaurant tenant has active paid no-ads entitlement
**When** Restaurant Admin dashboard or customer-facing pages render
**Then** ad scripts and ad placements are not loaded for that tenant
**And** ad-block detection and recovery modal logic is bypassed
**And** customer-facing pages for that restaurant do not show free-tier ads
**And** Restaurant Admin pages for that restaurant do not show free-tier ads
**And** paid bypass remains tenant-scoped and does not affect other restaurants
**And** entitlement checks are enforced server-side where functionality gating is involved
**And** paid bypass ends automatically when subscription entitlement is lost.

## Epic 8: Audit, Data Governance & Operational Hardening

The platform verifies and hardens audit-relevant events, tenant/order/subscription/audit data safety, consistent forbidden/admin errors, and production operational behavior after the shared primitives have been established in Epic 1 and used by feature stories.

### Story 8.1: Validate and Complete Audit Coverage Across Sensitive Actions

As the platform,
I want audit-relevant events validated and completed across account changes, permission denials, subscription changes, webhook processing, auth failures, and invalid order transitions,
So that sensitive activity is consistently traceable across previously implemented features.

**Acceptance Criteria:**

**Given** sensitive platform, tenant, subscription, or order actions occur
**When** the action succeeds or fails in an audit-relevant way
**Then** the Epic 1 audit writer is used consistently to record event type, actor where available, tenant where applicable, target resource, timestamp, and safe metadata
**And** audit events cover Super Admin ownership transfer, Platform Admin account create/update/suspend/reactivate, Restaurant Admin login/auth failures, permission denials, subscription state changes, PayMongo webhook processing, and invalid order status transition attempts
**And** audit metadata does not store customer name, phone, email, password, or account identity because customer ordering is anonymous in MVP
**And** audit events remain tenant-scoped where applicable
**And** audit logs are retained for at least 180 days
**And** audit write failures are logged without exposing sensitive data to users
**And** any missing audit coverage discovered during the pass is added to the owning feature service or domain workflow
**And** audit recording can be tested without HTTP, React, PayMongo, AdSense, R2, or Durable Objects.

### Story 8.2: Validate Standardized Forbidden and Error Responses

As the platform,
I want all implemented routes and features to use the standardized forbidden and admin/customer-friendly error envelopes from Epic 1,
So that users receive clear messages and APIs remain predictable across the whole product.

**Acceptance Criteria:**

**Given** an API request succeeds or fails
**When** the route returns a response
**Then** success responses use the Epic 1 standardized `{ data, meta }` envelope
**And** error responses use the Epic 1 standardized `{ error: { code, message, details } }` envelope
**And** forbidden responses are consistent across role, tenant, and authorization failures
**And** customer-facing errors avoid stack traces, HTTP codes, database errors, provider internals, and technical wording
**And** Restaurant Admin-facing errors explain rejected order transitions, upload failures, subscription issues, and forbidden actions in clear operational language
**And** each Elysia route documents success and error envelopes in OpenAPI response maps
**And** inconsistent error mapping discovered during the pass is fixed in the owning route/controller/service boundary
**And** error mapping stays outside route handlers except for adapting controller results to HTTP responses.

### Story 8.3: Harden Tenant Data Governance and Retention

As the platform,
I want tenant, role, menu, seating, QR, order, subscription, analytics, and audit data modeled safely,
So that tenant boundaries, anonymous customer limits, and retention rules are preserved.

**Acceptance Criteria:**

**Given** the implemented data model spans platform and restaurant features
**When** data is created, read, updated, archived, completed, or inspected
**Then** tenant data is not accessible across tenants
**And** restaurant analytics remain tenant-scoped
**And** customer ordering stores only anonymous order token, QR/table/chair context, ordered item/add-on snapshots, order note, order status history, timestamps, and technical request metadata needed for abuse/security logs
**And** customer ordering does not store or require customer name, phone, email, password, or account identity in MVP
**And** reusable QR tokens and anonymous order tokens are non-guessable and treated as separate concepts
**And** active orders and completed order history remain separate operational concepts
**And** completed orders are retained for Restaurant Admin history/statistics while no longer appearing in active board or future reusable QR customer visibility
**And** audit logs meet the approved retention target.

### Story 8.4: Validate Operational Logging for Critical Integration and Live Failures

As the platform,
I want critical failures to consistently use the Epic 1 operational logging utility with tenant/order/provider context,
So that live reconnect failures, webhook failures, forbidden access, invalid transitions, QR failures, and R2 upload failures are visible quickly.

**Acceptance Criteria:**

**Given** a critical operational or integration failure occurs
**When** the system handles or detects the failure
**Then** the failure is logged through the shared operational logging utility with safe tenant, order, QR, or provider context where applicable
**And** logging covers live update reconnect failures, PayMongo webhook failures, forbidden access attempts, invalid order transitions, QR token resolution failures, and R2 upload failures
**And** critical integration failures are visible in operational logs within 1 minute of occurrence
**And** logs avoid raw secrets, password material, private tokens, and unnecessary customer-identifying data
**And** provider-specific logging is isolated through integration wrappers or infrastructure utilities where appropriate
**And** logged failures can be correlated to request IDs or event IDs where available
**And** missing logging coverage discovered during the pass is added to the owning feature or provider wrapper
**And** operational logging does not replace user-friendly error handling.

### Final Readiness Gate: Cross-Requirement Hardening Pass

This is a readiness/QA gate, not a normal implementation story. It should be used before sprint execution or before declaring the implementation backlog ready.

As a developer,
I want a final validation pass across PRD, UX, architecture, and stories,
So that the implementation backlog is coherent before story execution begins.

**Acceptance Criteria:**

**Given** all epics and stories are drafted
**When** the final hardening pass is performed
**Then** every functional requirement is covered by at least one story
**And** key non-functional requirements are represented in relevant story acceptance criteria
**And** UX design requirements are represented in relevant feature, component, accessibility, responsiveness, and recovery-state stories
**And** Modern Epicurean visual requirements from `docs/reference-inspiration-2-google-stitch.md` are represented without replacing QR Resto Hub functionality or operational density
**And** sterile cool-toned wellness palettes are absent from primary actions, food presentation, gradients, and dominant surfaces
**And** architecture requirements for DDD, Route -> Controller -> Service, Elysia OpenAPI/TypeBox contracts, middleware organization, `src/lib/**`, `src/utils/**`, D1, Durable Objects, R2, and PayMongo isolation are represented in the backlog
**And** story sequencing does not require a story to depend on a future story within the same epic
**And** stories are sized for a single development agent session where practical
**And** any remaining gaps are documented before implementation readiness is marked ready.
