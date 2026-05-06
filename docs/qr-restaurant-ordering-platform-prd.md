** This document is deprecated as new PRD is created under BMAD. Use this as legacy reference only **

# Product Requirements Document: QR Restaurant Ordering Platform

**Version**: 1.0
**Date**: 2026-05-05
**Author**: Sarah (Product Owner)
**Quality Score**: 98/100

---

## Executive Summary

QR Resto Hub is a multi-tenant restaurant ordering platform where restaurant customers scan a table or chair QR code, browse a mobile-first menu, submit anonymous orders, and receive live order updates. Restaurant staff manage orders from a live dashboard using a board workflow from pending intake through preparation, serving, payment request, and completion.

The product serves restaurant owners and operators who need a lightweight self-service ordering system without requiring customers to install an app or create an account. The platform supports menu management, table and chair QR generation, live operational dashboards, and subscription-based ad removal.

The first release should focus on reliable anonymous QR ordering, live kitchen/order board updates, menu and seating management, and clear tenant role separation. PayMongo is used only for platform subscriptions such as the PHP 100/month no-ads plan, not for customer food-order payments.

---

## Problem Statement

**Current Situation**: Many small and mid-sized restaurants rely on manual table ordering, staff relays, paper menus, or chat-based workflows. These create delays, order mistakes, and poor visibility for both customers and staff.

**Proposed Solution**: Build a Cloudflare-hosted platform where restaurants configure menus, generate QR codes for tables or chairs, receive customer orders in real time, and manage each order through a visual operational board.

**Business Impact**: Restaurants can reduce ordering friction, improve order visibility, and serve more customers with less manual coordination. The platform can monetize through non-intrusive ads for free tenants and a PayMongo-powered no-ads subscription.

---

## Success Metrics

**Primary KPIs:**

- Order completion rate: At least 90% of submitted orders reach completed status.
- QR ordering adoption: At least 70% of active restaurant tables or chairs receive one or more QR orders per service day.
- Live update latency: Order status updates appear for admins and customers within 2 seconds under normal load.
- Subscription conversion: At least 10% of active restaurants upgrade to the PHP 100/month no-ads plan.
- Admin efficiency: Restaurant admins can move an order to the next status in 2 clicks or fewer.
- Cancellation clarity: 100% of cancellation attempts follow the rule that orders can be cancelled only before preparation begins.

**Validation**: Track anonymized tenant-level order events, board status transitions, QR scans, active seats/tables, subscription status, and completed-order counts.

---

## User Personas

### Super Admin

- **Role**: Seeded platform owner account.
- **Goals**: Create and manage Admin accounts, transfer ownership when needed, and keep platform access controlled.
- **Pain Points**: Needs strict control without being involved in restaurant day-to-day operations.
- **Technical Level**: Intermediate.

### Admin

- **Role**: Internal platform administrator account managed by the Super Admin.
- **Goals**: Create, update, suspend, and manage Restaurant Admin accounts from the platform administrator dashboard.
- **Pain Points**: Needs to manage restaurant owner accounts without touching restaurant day-to-day operations.
- **Technical Level**: Intermediate.

### Restaurant Admin

- **Role**: Restaurant owner/operator account. One Restaurant Admin owns and manages exactly one restaurant tenant.
- **Goals**: Manage restaurant settings, menu availability, seating, QR codes, live orders, optional payment-request flow, no-ads subscription, and completed-order statistics.
- **Pain Points**: Needs fast, clear workflows during busy service periods.
- **Technical Level**: Basic to intermediate.

### Customer

- **Role**: Anonymous diner using a mobile device.
- **Goals**: Scan a QR code, order food quickly, leave notes, and see live order status.
- **Pain Points**: Does not want to install an app, create an account, or ask staff for basic order status.
- **Technical Level**: Basic.

---

## User Stories & Acceptance Criteria

### Story 1: Anonymous QR Ordering

**As a** customer  
**I want to** scan a table or chair QR code and order food anonymously  
**So that** I can place an order without account creation or app installation

**Acceptance Criteria:**

- [ ] QR code opens a mobile-first customer menu scoped to the correct restaurant and table or chair.
- [ ] Customer can add dishes and available add-ons to an order.
- [ ] Customer can leave an optional note up to 255 characters before ordering.
- [ ] Customer cannot order dishes or add-ons marked out of stock.
- [ ] Submitted order appears in the restaurant admin dashboard in pending status.
- [ ] Customer can see live updates for their order status.

### Story 2: Live Order Board

**As a** restaurant admin  
**I want to** manage orders through a live status board  
**So that** staff can coordinate preparation, serving, payment requests, and completion

**Acceptance Criteria:**

- [ ] New orders enter `Pending`.
- [ ] Restaurant admin can move orders from `Pending` to `Preparing` using drag and drop or a "Move to Preparation" action.
- [ ] Restaurant admin can move orders from `Preparing` to `To Serve`.
- [ ] Customer can request payment only when the order is in `To Serve`.
- [ ] If payment stage is disabled for the restaurant, the restaurant admin can complete the order directly after `To Serve`.
- [ ] If payment stage is enabled, the order moves to `Payment` after customer request, then restaurant admin can complete it.
- [ ] Restaurant admin and customer views update live when order status changes.

### Story 3: Menu Management

**As a** restaurant admin  
**I want to** manage categories, dishes, add-ons, images, prices, and stock status  
**So that** the customer menu stays accurate during service

**Acceptance Criteria:**

- [ ] A dish cannot be created without assigning it to a category.
- [ ] Dish fields include name, picture, price, add-ons, and `is_out_of_stock`.
- [ ] Add-on fields include name, price, and `is_out_of_stock`.
- [ ] Out-of-stock dishes and add-ons remain visible to customers but cannot be selected.
- [ ] Dish images are stored in Cloudflare R2.

### Story 4: Table, Chair, and QR Management

**As a** restaurant admin  
**I want to** generate QR codes by table or chair and group chairs under tables  
**So that** orders can be tracked to the correct physical location

**Acceptance Criteria:**

- [ ] Restaurant admin can create, edit, archive, and reorder tables.
- [ ] Restaurant admin can create chairs and assign or move them under tables.
- [ ] Restaurant admin can update chair/table grouping using drag and drop or edit actions.
- [ ] Restaurant admin can generate QR codes for an entire table or individual chairs.
- [ ] Restaurant admin can download the QR image and copy the QR URL as a fallback link.
- [ ] QR codes remain stable unless explicitly regenerated or archived.

### Story 5: Subscription and Ads

**As a** restaurant admin  
**I want to** pay for a no-ads subscription  
**So that** my dashboard and customer-facing ordering pages are free from platform ads

**Acceptance Criteria:**

- [ ] Free tenants may display non-intrusive ads in allowed dashboard and customer-facing placements.
- [ ] Paid tenants remove ads from both admin and customer-facing surfaces.
- [ ] PayMongo handles platform subscription payment only.
- [ ] Customer food orders do not use PayMongo in MVP.
- [ ] If a free tenant has ad blocking detected and ads cannot load, a blocking recovery modal prevents interactive functionality until ads are allowed or the tenant subscribes.

---

## Functional Requirements

### Core Features

**Role and Tenant Management**

- Description: The platform has one seeded Super Admin, internal Admin accounts created by the Super Admin, and Restaurant Admin accounts managed by Admins.
- User flow: Super Admin creates Admin. Admin creates and manages Restaurant Admin accounts. Each Restaurant Admin owns exactly one restaurant tenant and handles restaurant operations.
- Edge cases: An Admin cannot edit restaurant menus, seating, QR codes, or orders. A Restaurant Admin cannot access another restaurant.
- Error handling: Unauthorized access returns a consistent forbidden response and logs an audit event.

**Customer Ordering**

- Description: Anonymous customer ordering through table or chair QR links.
- User flow: Scan QR, view menu, select dishes/add-ons, add note, submit, watch status.
- Edge cases: QR code is archived, restaurant is inactive, dish becomes out of stock before submit, note exceeds 255 characters.
- Error handling: Show mobile-friendly error states and prevent invalid order submission.

**Order Status Board**

- Description: Live operational board with `Pending`, `Preparing`, `To Serve`, optional `Payment`, and `Completed`.
- User flow: Order submitted to Pending, staff moves through workflow, customer requests payment when eligible, staff completes order.
- Edge cases: Payment disabled, duplicate status updates, stale board state, customer disconnects from live session, customer cancellation before preparation.
- Error handling: Status transitions must be validated server-side using domain rules.

**Order Cancellation**

- Description: Customers may cancel anonymous orders only while the order is still in `Pending`.
- User flow: Customer opens active order status screen, taps cancel, confirms cancellation, and the restaurant board updates live.
- Edge cases: Restaurant admin moves the order to `Preparing` while the customer cancellation confirmation is open.
- Error handling: Server-side status validation rejects cancellation once the order is `Preparing` or later.

**Menu Catalog**

- Description: Category-first dish management with add-ons and stock controls.
- User flow: Create category, create dish, add optional add-ons, upload picture, set prices and stock.
- Edge cases: Delete category with dishes, update price during active order, image upload failure.
- Error handling: Preserve existing order snapshot prices after order submission.

**QR and Seating Management**

- Description: Tables and chairs can be modeled separately, with chairs grouped under tables.
- User flow: Restaurant Admin creates tables, adds chairs, generates QR by table/chair, then prints, downloads, or copies the QR URL fallback.
- Edge cases: Chair moved after QR generation, table archived with active orders, duplicate chair labels, QR reused by a later customer group.
- Error handling: Existing QR links resolve to the current active table/chair identity unless archived. Each submitted order receives its own anonymous order token so live tracking can reconnect when the customer returns.

**Dashboard Statistics**

- Description: Restaurant Admin dashboard shows completed order counts and operational metrics. Platform Admin dashboard shows tenant-level account and subscription metrics.
- User flow: Restaurant Admin opens dashboard and sees completed orders by date range, table/chair, dish, and category. Admin opens platform dashboard and sees active restaurants, free vs paid tenants, expired subscriptions, and account status.
- Edge cases: No orders yet, date range with no data, high-volume day.
- Error handling: Empty states must be clear and non-blocking.

**Subscription and Monetization**

- Description: PayMongo subscription controls ad removal for tenant dashboard and customer ordering pages.
- User flow: Restaurant Admin subscribes to no-ads plan, PayMongo confirms payment, tenant entitlement updates.
- Edge cases: Failed payment, expired subscription, cancelled subscription, webhook retry, disputed payment.
- Error handling: Subscription state should be idempotent and webhook-driven.

**Recommended Ads Implementation**

- Description: Use Google AdSense for MVP ad serving and AdSense Privacy & messaging / Funding Choices for ad blocker recovery.
- User flow: Free tenant pages load permitted ad slots. If ad blocking is detected, a blocking recovery modal asks the user to allow ads or points the Restaurant Admin to the PHP 100/month no-ads subscription.
- Edge cases: AdSense rejects the site, ad inventory is low, ad scripts are blocked before detection, or the user is on a paid tenant.
- Error handling: Paid tenants bypass ad loading and ad blocker enforcement. The ad provider wrapper should be isolated in `src/lib/ads/**` so another provider can replace AdSense later.

### Non-Intrusive Ads Ideas

- Small footer ad on free customer menu pages, below the order action area.
- Dashboard sidebar or footer sponsorship slot that never covers the order board.
- Restaurant-neutral ad placements only, avoiding competitor restaurant ads inside customer menus.
- No ad popups, autoplay video, layout-shifting banners, or ads that block order submission when successfully loaded.
- Use an ad blocker recovery modal, not a modal ad. The modal may block interactive functionality for free tenants when required ad scripts cannot load.
- Free-tier ad blocker policy blocks customer order submission and Restaurant Admin mutations when ads cannot load, with a clear path to allow ads or subscribe.

### Out of Scope for MVP

- Customer account creation.
- Online payment collection for food orders.
- Delivery logistics.
- Inventory deduction beyond dish/add-on stock status.
- Loyalty programs and coupons.
- Kitchen display system hardware integrations.
- Native iOS or Android apps.

---

## Technical Constraints

### Architecture Standards

- React must follow a feature-based structure with clear ownership by product area.
- Styling must use the latest stable Tailwind CSS v4 release, installed through the first-party Vite integration for Astro/React where compatible.
- Tailwind design tokens should be mapped from `docs/ui-design.md` into CSS-first Tailwind theme variables instead of hard-coded one-off values.
- Business rules must follow Domain Driven Design and remain decoupled from HTTP, database, WebSocket, and UI implementation.
- APIs must follow a layered pattern: Route -> Controller -> Service -> Domain/Repository.
- Fluent interface modular programming should be used where it improves readability for builders, validators, query composition, or domain workflows.
- Atomic independent utilities must live in `src/utils/**`.
- Third-party integrations and custom wrappers must live in `src/lib/**`.
- D1 migrations must be remote-first, supporting only dev and prod D1 environments.

### Performance

- Customer-facing menu initial load target: under 2.5 seconds on mobile 4G.
- Live order status update target: under 2 seconds under normal load.
- Admin board interactions should feel immediate with optimistic UI where safe.
- QR scan links should avoid unnecessary redirects.

### Security

- Super Admin account is seeded and unique.
- Admin and Restaurant Admin access must be tenant-scoped.
- Customer sessions are anonymous but scoped to QR token and order session.
- QR tokens must be non-guessable.
- Server-side validation is required for all order transitions, price snapshots, and stock checks.
- PayMongo webhooks must be verified and processed idempotently.

### Integrations

- **Cloudflare Workers**: Runtime for Astro SSR/API deployment.
- **Cloudflare D1**: Primary relational database for tenant, menu, seating, order, and subscription data.
- **Cloudflare Durable Objects**: WebSocket coordination for live order and board updates.
- **Cloudflare R2**: Storage for dish images and generated QR assets when persisted.
- **AstroJS**: App shell and routing foundation.
- **React**: Interactive customer and dashboard experiences.
- **Tailwind CSS**: Utility-first styling system using the latest stable v4 release, `@import "tailwindcss"`, and `@tailwindcss/vite` integration.
- **ElysiaJS**: API layer integration inside the Cloudflare-compatible runtime.
- **PayMongo**: Platform subscription payment and webhook processing only.

### Compatibility

- Customer-facing experience must be mobile-first and work well on modern iOS Safari and Android Chrome.
- Platform Admin and Restaurant Admin dashboards should support modern desktop browsers first, with tablet support for restaurant operations.

---

## MVP Scope & Phasing

### Phase 1: MVP

- Seeded Super Admin.
- Admin and Restaurant Admin management.
- Restaurant tenant setup.
- Category and dish management with add-ons and stock status.
- R2 dish image upload.
- Table/chair management and QR generation.
- Anonymous mobile-first customer ordering.
- Live order board with validated status transitions.
- Customer live order status view.
- Optional payment-request stage controlled per restaurant.
- Completed order statistics.
- PayMongo no-ads subscription entitlement.
- Free-tier non-intrusive ad placements and ad blocker enforcement.
- Remote-first D1 dev/prod migration workflow.

**MVP Definition**: A restaurant can be onboarded, configure menu and seats, print QR codes, receive anonymous customer orders, manage those orders live through completion, and optionally subscribe to remove ads.

### Phase 2: Enhancements

- More detailed analytics by menu item, category, table, and service period.
- Staff permission presets.
- QR print layout templates.
- Restaurant operating hours and menu availability schedules.
- Advanced cancellation overrides and refund-like operational flows.
- Multi-branch reporting if not included in MVP.

### Future Considerations

- Customer loyalty features.
- Kitchen display mode.
- Printer integrations.
- Reservation or waitlist module.
- Food-order payment integrations if later required.
- White-label domains for paid restaurants.

---

## Risk Assessment

| Risk                                               | Probability | Impact | Mitigation Strategy                                                                                                                                   |
| -------------------------------------------------- | ----------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Role hierarchy confusion                           | Low         | High   | Enforce a strict hierarchy: Super Admin manages Admins, Admins manage Restaurant Admin accounts, and Restaurant Admins manage exactly one restaurant. |
| Live updates become unreliable during busy service | Medium      | High   | Use Durable Objects per restaurant or order stream and define reconnect/replay behavior.                                                              |
| Ad blocker enforcement harms customer ordering     | Medium      | Medium | Keep enforcement clear, limited, and bypassed for paid tenants; avoid blocking after a successful ad load.                                            |
| QR codes are shared outside the restaurant         | Medium      | Medium | Use non-guessable tokens, support QR archive/regeneration, and display table/chair context before order submit.                                       |
| Menu prices change while customers are ordering    | High        | Medium | Snapshot prices at order submission and revalidate stock before creating the order.                                                                   |
| PayMongo webhook duplication or delay              | Medium      | Medium | Make subscription webhook handling idempotent and show pending subscription state. If a subscription expires, ads return automatically.               |

---

## Dependencies & Blockers

**Dependencies:**

- Cloudflare account with Workers, D1, Durable Objects, and R2 enabled.
- PayMongo account with subscription/payment link or checkout integration capability.
- Google AdSense account approval, or a fallback ad provider if AdSense rejects the site.
- Final UI placement choices for free-tier ad slots.

**Known Blockers:**

- The repo is currently greenfield, so Astro, Cloudflare, Elysia, React, Tailwind CSS, testing, linting, and migration foundations still need to be scaffolded.
- Ad provider choice is not yet finalized.

---

## Appendix

### Glossary

- **Super Admin**: One seeded platform owner account that manages Admin accounts.
- **Admin**: Internal platform administrator account that manages Restaurant Admin accounts.
- **Restaurant Admin**: Restaurant owner/operator account that manages exactly one restaurant and handles menu, QR, subscription, stats, and orders.
- **Customer**: Anonymous diner who orders through a QR code.
- **Table QR**: QR code linked to a restaurant table.
- **Chair QR**: QR code linked to a specific chair that can be grouped under a table.
- **Payment status**: Restaurant operational request-bill status, not online food payment collection.
- **No-ads subscription**: PHP 100/month tenant subscription paid through PayMongo to remove platform ads.

### Open Assumptions

- Additional restaurant staff accounts are out of scope unless added later; the MVP treats Restaurant Admin as the restaurant owner/operator account.
- Google AdSense is the recommended MVP ad provider, but the implementation should keep ads behind an adapter so it can be replaced.
- Free-tier ads remain required, but food-order payment collection is out of scope.
- The payment status means customer requests the bill and restaurant staff completes the order after offline settlement.

### References

- [Google AdSense Help: About ad blocking recovery messages](https://support.google.com/adsense/answer/11576589)
- [Google AdSense Help: Add a Custom Choice option to ad blocking recovery messages](https://support.google.com/adsense/answer/11576797)
- [Google AdSense Help: Ad placement policies](https://support.google.com/adsense/answer/1346295)
- [Tailwind CSS: Install with Astro](https://tailwindcss.com/docs/guides/astro)
- [Tailwind CSS: Vite installation](https://tailwindcss.com/docs/installation)
- [UI Design Document](ui-design.md)
- [UI Flow Document](ui-flow.md)

---

_This PRD was created through interactive requirements gathering with quality scoring to ensure comprehensive coverage of business, functional, UX, and technical dimensions._
