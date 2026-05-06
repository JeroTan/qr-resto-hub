---
stepsCompleted: [1, 2]
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - 'docs/ui-design.md'
  - 'docs/ui-flow.md'
workflowType: 'epics-and-stories'
projectName: 'qr-resto-hub'
createdDate: '2026-05-06'
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

### FR Coverage Map

FR1: Epic 1 - Super Admin authentication.
FR2: Epic 1 - Super Admin Platform Admin account management.
FR3: Epic 1 - Super Admin ownership transfer.
FR4: Epic 1 - Platform Admin Restaurant Admin account management.
FR5: Epic 1 - Platform Admin tenant account status visibility.
FR6: Epic 1 - Restaurant Admin tenant-scoped authentication.
FR7: Epic 1 - Role and tenant permission enforcement.
FR8: Epic 8 - Audit-relevant account and permission events.
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
FR82: Epic 8 - Consistent forbidden responses.
FR83: Epic 4 - Customer-friendly errors.
FR84: Epic 8 - Restaurant Admin-friendly errors.
FR85: Epic 7 - No customer food-order checkout through PayMongo.

## Epic List

### Epic 1: Platform Foundation, Authentication & Tenant Administration

Super Admin and Platform Admins can securely initialize the platform, manage admin accounts, onboard Restaurant Admins, and enforce tenant/role boundaries.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR9, FR10, FR11, FR12, FR13, FR58, FR59, FR60, FR80

**Implementation notes:** This epic establishes the Cloudflare Astro foundation, D1/Drizzle migration base, authentication/session model, server-side RBAC/tenant guards, OpenAPI/TypeBox route contract rules, and the account administration surfaces needed by all later epics.

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

The platform records audit-relevant events, stores tenant/order/subscription/audit data safely, returns consistent forbidden/admin errors, and becomes implementation-ready for production operation.

**FRs covered:** FR8, FR79, FR82, FR84

**Implementation notes:** This epic hardens cross-cutting concerns that should be threaded through earlier work and validated as a dedicated final readiness pass.
