**Implementation note:** This document is the implementation-facing UI token companion to the BMAD UX specification. If conflicts appear, `_bmad-output/planning-artifacts/ux-design-specification.md` and `docs/reference-inspiration-2-google-stitch.md` are the source of truth.

# QR Resto Hub — UI Design Document

**Version**: 1.0  
**Date**: 2026-05-05  
**Author**: UI/UX Design  
**Platform**: Astro + React + Cloudflare  
**Breakpoints**: Mobile-first (320px+), Tablet (768px+), Desktop (1024px+)

---

## Design System Overview

### Reference-Inspired Brand Adaptation

`docs/reference-inspiration-2-google-stitch.md` is the current visual source of truth. It defines a Modern Epicurean direction: quiet luxury for digital dining, cream/parchment surfaces, cocoa ink, orange CTAs, olive markers, glassy overlays, food-first photography, and restrained warm elevation.

Adaptation rules:
- Use a cream/cocoa/orange dining system as the main brand expression: cream backgrounds, cocoa text, orange primary actions, olive dietary markers, and warm neutral dividers.
- Use Plus Jakarta Sans for headings and Inter for body/UI text.
- Keep the 4px spacing system for implementation compatibility while allowing 8px rhythm groupings from the reference.
- Customer-facing menu, dish detail, cart, live status, QR, subscription, empty, and onboarding surfaces may use more whitespace, larger imagery, low-chrome sections, tonal layering, and barely visible cocoa-tinted separators only where needed when this improves food focus and ordering confidence.
- Restaurant Admin boards, menu CRUD, seating/QR management, Platform Admin tables, and Super Admin screens must remain compact, scannable, and workflow-first.
- Use real dish, restaurant, QR, and operational imagery where imagery helps understanding; avoid decorative gradients, sterile cool-toned wellness palettes, abstract blobs, and fake atmospheric chrome.
- Olive is allowed for dietary tags, sustainable/health markers, and subtle confirmed/secondary states. It must not become the primary CTA or dominant food surface color.
- Do not copy Apple-specific branding, SF Pro typography, Apple navigation patterns, negative letter spacing, or device/product-page composition.

### Color Palette

| Token                     | Hex       | Usage                                    |
| ------------------------- | --------- | ---------------------------------------- |
| `--color-primary`         | `#FF6B00` | Primary CTAs, add/order actions, price highlights |
| `--color-primary-light`   | `#FF8A33` | Hover states, highlights                 |
| `--color-primary-dark`    | `#CC5600` | Pressed states                           |
| `--color-secondary`       | `#5D2A18` | Cocoa ink, ghost buttons, iconography    |
| `--color-tertiary`        | `#8B8000` | Dietary tags, sustainable/health markers |
| `--color-danger`          | `#EF4444` | Cancel actions, errors, delete           |
| `--color-success`         | `#8B8000` | Confirmed, in-stock, completed-history indicators |
| `--color-neutral-900`     | `#1C1B1B` | Primary text, headings                   |
| `--color-neutral-700`     | `#4C463F` | Secondary text                           |
| `--color-neutral-500`     | `#7D766E` | Placeholder, disabled text               |
| `--color-neutral-300`     | `#CEC5BC` | Barely visible dividers, inset separators |
| `--color-neutral-100`     | `#F2E8DF` | Cream surfaces, hover surfaces           |
| `--color-neutral-50`      | `#FDF8F7` | Page backgrounds                         |
| `--color-surface`         | `#FFFFFF` | Cards, modals, elevated surfaces         |
| `--color-surface-container` | `#F7F3F1` | Low-elevation cards and panels         |
| `--color-surface-container-high` | `#ECE7E6` | Higher tonal surfaces             |
| `--color-board-pending`   | `#FEF3C7` | Pending column bg                        |
| `--color-board-preparing` | `#DBEAFE` | Preparing column bg                      |
| `--color-board-serve`     | `#E0E7FF` | To Serve column bg                       |
| `--color-board-payment`   | `#FCE7F3` | Payment column bg                        |
| `--color-board-completed` | `#F2E8DF` | Completed history/customer final bg      |

### Typography

| Scale   | Mobile | Tablet+ | Weight | Usage                        |
| ------- | ------ | ------- | ------ | ---------------------------- |
| Display | 28px   | 40px    | 700    | Page titles, empty states    |
| H1      | 24px   | 32px    | 700    | Section headers              |
| H2      | 20px   | 24px    | 600    | Card titles, column headers  |
| H3      | 16px   | 20px    | 600    | Subsection, dish names       |
| Body    | 14px   | 16px    | 400    | Paragraphs, descriptions     |
| Small   | 12px   | 14px    | 400    | Metadata, timestamps         |
| Caption | 11px   | 12px    | 500    | Labels, badges, stock status |

**Font Family**: Plus Jakarta Sans for headings/display, Inter for body/UI text. Use weights 400, 500, 600, 700. Letter spacing remains 0 even where the reference suggests tight tracking.

### Spacing Scale (4px base)

| Token      | Value |
| ---------- | ----- |
| `space-1`  | 4px   |
| `space-2`  | 8px   |
| `space-3`  | 12px  |
| `space-4`  | 16px  |
| `space-5`  | 20px  |
| `space-6`  | 24px  |
| `space-8`  | 32px  |
| `space-10` | 40px  |
| `space-12` | 48px  |

### Shadows & Elevation

Elevation should stay restrained and warm. Prefer tonal layers, barely visible cocoa-tinted separators, glassy overlays, spacing, and imagery over heavy shadows. Customer-facing food or QR presentation may use subtle ambient depth when it helps the visual subject read clearly; admin cards and controls should avoid decorative elevation.

| Token          | Value                              | Usage                     |
| -------------- | ---------------------------------- | ------------------------- |
| `shadow-sm`    | `0 1px 2px rgba(93,42,24,0.05)`       | Buttons, inputs        |
| `shadow-md`    | `0 12px 30px rgba(93,42,24,0.06)`     | Cards, dropdowns       |
| `shadow-lg`    | `0 24px 48px rgba(93,42,24,0.08)`     | Modals, floating elements |
| `shadow-board` | `0 2px 8px rgba(93,42,24,0.06)`       | Board cards            |

### Border Radius

| Token         | Value  | Usage                      |
| ------------- | ------ | -------------------------- |
| `radius-sm`   | 4px    | Buttons, badges            |
| `radius-md`   | 8px    | Inputs, small cards        |
| `radius-lg`   | 16px   | Cards, modals              |
| `radius-xl`   | 24px   | Large cards, mobile sheets, image containers |
| `radius-full` | 9999px | Pills, avatars             |

### Animation Tokens

| Token             | Value                               | Usage                  |
| ----------------- | ----------------------------------- | ---------------------- |
| `duration-fast`   | 150ms                               | Hover, focus           |
| `duration-normal` | 250ms                               | Transitions, modals    |
| `duration-slow`   | 350ms                               | Page transitions, drag |
| `ease-default`    | `cubic-bezier(0.4, 0, 0.2, 1)`      | Standard easing        |
| `ease-bounce`     | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Success, pop-in        |

---

## Component Library

### Buttons

**Primary Button**

- Background: `--color-primary`
- Text: White, 14px, weight 600
- Padding: 12px 20px (mobile) / 12px 24px (desktop)
- Border radius: `radius-md`
- Hover: `--color-primary-dark`, translateY(-1px)
- Pressed: scale(0.98)
- Disabled: opacity 0.5, cursor not-allowed

**Secondary Button**

- Background: `--color-surface`
- Subtle cocoa inset line; no heavy outline
- Text: `--color-neutral-900`, 14px, weight 500
- Hover: `--color-neutral-100`

**Danger Button**

- Background: `--color-danger`
- Text: White
- Hover: `#DC2626`

**Ghost Button**

- Background: transparent
- Text: `--color-primary`
- Hover: `--color-primary` at 8% opacity background

**Icon Button**

- Size: 40px × 40px
- Border radius: `radius-md`
- Background: transparent
- Hover: `--color-neutral-100`

### Cards

**Standard Card**

- Background: `--color-surface`
- Border radius: `radius-lg`
- Shadow: `shadow-md`
- Padding: `space-4` to `space-6`
- Optional barely visible cocoa inset separator

**Board Card (Order Card)**

- Background: `--color-surface`
- Border radius: `radius-md`
- Shadow: `shadow-board`
- Padding: `space-4`
- Thin status rail: 4px status color
- Hover: translateY(-2px), `shadow-md`
- Dragging: rotate(2deg), `shadow-lg`, opacity 0.9

**Menu Item Card**

- Horizontal layout: Image (80px) + Content
- Border radius: `radius-lg`
- Background: `--color-surface`
- Optional barely visible separator line
- Out of stock: Opacity 0.6, grayscale filter, "Out of Stock" badge

### Inputs

**Text Input**

- Height: 48px (mobile) / 44px (desktop)
- Subtle cocoa inset line
- Border radius: `radius-md`
- Padding: 0 `space-4`
- Focus: 2px `--color-primary` border, subtle glow
- Error: `--color-danger` border, error text below

**Textarea (Order Notes)**

- Min height: 80px
- Max length indicator: "0/255"
- Counter turns `--color-danger` at >230 chars

**Toggle Switch**

- Track: 48px × 24px
- Thumb: 20px diameter
- Active: `--color-primary` track
- Inactive: `--color-neutral-300` track
- Transition: `duration-fast`

### Badges

| Type             | Background | Text      | Usage        |
| ---------------- | ---------- | --------- | ------------ |
| Status Pending   | `#FEF3C7`  | `#92400E` | Order status |
| Status Preparing | `#DBEAFE`  | `#1E40AF` | Order status |
| Status To Serve  | `#E0E7FF`  | `#3730A3` | Order status |
| Status Payment   | `#FCE7F3`  | `#9D174D` | Order status |
| Status Completed | `#DCFCE7`  | `#166534` | Order status |
| Status Cancelled | `#FEE2E2`  | `#991B1B` | Order status |
| Stock In         | `#DCFCE7`  | `#166534` | Available    |
| Stock Out        | `#FEE2E2`  | `#991B1B` | Unavailable  |
| Subscription     | `#E0E7FF`  | `#3730A3` | Paid tier    |
| Free Tier        | `#F3F4F6`  | `#374151` | Free tier    |

### Modals

**Standard Modal**

- Overlay: `rgba(0,0,0,0.5)`, backdrop-blur(4px)
- Container: max-width 480px (mobile: 100% - 32px)
- Border radius: `radius-xl` (mobile bottom sheet style)
- Animation: slide-up + fade-in
- Header: Title + close icon
- Footer: Action buttons, right-aligned

**Ad Blocker Recovery Modal**

- Cannot be dismissed without action
- Overlay: `rgba(0,0,0,0.7)`
- Content: Clear explanation + two CTAs
- CTA Primary: "Allow Ads & Continue"
- CTA Secondary: "Subscribe to Remove Ads (₱100/mo)"

**Confirmation Modal**

- Icon: Warning triangle or Info circle
- Title: Action description
- Body: Consequences
- Actions: Cancel (secondary) + Confirm (danger/primary)

### Toast Notifications

- Position: Top-right (desktop), top-center (mobile)
- Auto-dismiss: 4 seconds
- Types: Success (small olive/success indicator), Error (red), Warning (amber), Info (blue)
- Animation: Slide in from right, fade out

### Empty States

- Icon: 64px, `--color-neutral-300`
- Title: `--color-neutral-700`, H2
- Description: `--color-neutral-500`, Body
- Optional CTA button

### Loading States

**Skeleton**

- Background: linear-gradient shimmer
- Border radius matches content
- Pulse animation

**Spinner**

- Size: 24px (inline), 40px (page)
- Color: `--color-primary`
- Line width: 3px

---

## Global Navigation & Layout Patterns

### Mobile-First Layout (Customer)

- Single column, full width
- Bottom fixed action bar for CTAs
- Safe area insets respected
- Touch targets: min 44px × 44px
- Pull-to-refresh on order status

### Tablet Layout (Restaurant Admin)

- Collapsible sidebar (240px)
- Main content area with padding
- Board view: 3-4 columns visible
- Touch-friendly for kitchen use

### Desktop Layout (Admin / Super Admin)

- Fixed sidebar (260px)
- Top header bar (64px)
- Content max-width: 1440px, centered
- Board view: All columns visible
- Hover tooltips, keyboard shortcuts

---

## Persona 1: Customer (Anonymous Mobile User)

### Flow Overview

```
Scan QR → Menu Loading → Browse Menu → Build Order → Review & Notes → Submit
→ Live Order Status → [Cancel if Pending] → [Request Payment if To Serve] → Complete
```

### Screen 1: QR Landing / Menu Loading

**Layout**:

- Full screen, centered content
- Restaurant logo (if uploaded) or restaurant name in Display type
- Table/Chair context: "Table 5 · Chair A" caption
- Loading spinner + "Loading menu..."
- Error state: "Unable to load menu" with retry button

**States**:

- Loading: Skeleton of menu categories
- Error: QR archived, restaurant inactive, network error
- Success: Auto-redirect to Menu

**Key Elements**:

- Restaurant branding area (top 30%)
- Context label (table/chair identifier)
- Loading indicator
- Footer: "Powered by QR Resto Hub" (subtle, neutral-500)

---

### Screen 2: Menu Browser

**Layout**:

- **Header (sticky)**:
  - Restaurant name (H3, truncated)
  - Table/chair badge (right)
  - Cart icon with count badge (if items added)
- **Category Tabs (horizontal scroll)**:
  - Pill-style tabs, sticky below header
  - Active: `--color-primary` bg, white text
  - Inactive: `--color-neutral-100` bg, neutral text
  - Scroll snap on mobile
- **Menu List**:
  - Vertical scroll, categories as sections
  - Each dish: Card layout (image left, details right)
  - Category headers: Sticky, `--color-neutral-50` bg

**Dish Card**:

```
[Image: 80×80, radius-md, object-cover]
[Name: H3, 1 line, ellipsis]
[Description: Body, 2 lines, neutral-500]
[Price: H3, primary color]
[Add-ons indicator: Small, neutral-500]
[Stock badge: In/Out]
[+ Button: Icon button, primary, 40px]
```

**Out of Stock State**:

- Grayscale image
- "Out of Stock" badge (red)
- - Button disabled, opacity 0.4
- Price struck through (optional)

**Interactions**:

- Tap dish card → Open Dish Detail Sheet
- Tap + button → Quick add (quantity 1, no add-ons)
- Horizontal scroll categories → Snap to tab
- Scroll menu → Category tabs highlight active section (scroll spy)

---

### Screen 3: Dish Detail Sheet (Bottom Sheet)

**Layout**:

- Bottom sheet, 85% height, `radius-xl` top corners
- Drag handle at top (visual only)
- Scrollable content

**Content**:

- Dish image (full width, 200px height, `radius-lg` top)
- Dish name (H1)
- Price (H2, primary)
- Description (Body)
- Divider

**Add-ons Section**:

- Header: "Add-ons" (H3)
- Each add-on: Checkbox + name + price
- Out of stock add-ons: Disabled, struck through

**Quantity Selector**:

- [-] [1] [+] horizontal group
- Min: 1, Max: 99
- Button style: Ghost with border

**Notes (optional)**:

- Textarea, max 255 chars
- Character counter

**Footer (sticky)**:

- "Add to Order — ₱XXX" primary button, full width
- Price updates dynamically with quantity/add-ons

**Interactions**:

- Swipe down to dismiss (if no selections)
- Tap overlay to dismiss (if no selections)
- Backdrop: `rgba(0,0,0,0.5)`

---

### Screen 4: Cart / Order Review

**Layout**:

- **Header**: "Your Order" (H1) + close/back
- **Order Items List**:
  - Each item: Card with image thumbnail
  - Item details: Name, selected add-ons, notes preview
  - Quantity stepper [-] [count] [+]
  - Line total (right-aligned)
  - Swipe left to remove (mobile) or delete icon
- **Order Note (optional)**:
  - Textarea, "Add a note for the kitchen..."
  - Max 255 chars
- **Order Summary**:
  - Subtotal
  - Service charge (if applicable)
  - Total (H2, bold)
- **Footer (sticky)**:
  - "Place Order — ₱XXX" primary button
  - Disabled if cart empty or all items out of stock

**Empty State**:

- Cart icon (64px, neutral-300)
- "Your cart is empty"
- "Browse the menu to add items"
- CTA: "View Menu" secondary button

**Interactions**:

- Pull to refresh stock status (revalidates)
- Stock change while viewing: Toast warning, highlight affected item
- Place order → Loading state → Success → Order Status screen

---

### Screen 5: Order Status (Live)

**Layout**:

- **Header**:
  - Order number (e.g., "Order #A7B3")
  - Table/chair context
  - Timestamp
- **Status Timeline**:
  - Vertical timeline with 5 steps
  - Current step: Highlighted with primary color, pulse animation
  - Completed steps: Checkmark icon with small olive/success indicator
  - Future steps: Gray, muted
  - Steps: Pending → Preparing → To Serve → [Payment] → Completed
- **Order Summary (collapsible)**:
  - Tap to expand/collapse
  - List of items ordered
  - Total amount
- **Actions**:
  - **Cancel Order** button (only if status = Pending)
    - Danger style, outlined
    - Confirmation modal required
  - **Request Payment** button (only if status = To Serve AND payment enabled)
    - Primary style
    - Moves order to Payment status
- **Live Indicator**:
  - "Live updates" small olive/success pulse dot
  - Last updated timestamp
  - Reconnecting state if WebSocket drops

**Status Visuals**:
| Status | Icon | Color | Customer Message |
|--------|------|-------|------------------|
| Pending | ⏳ | Amber | "Your order has been received" |
| Preparing | 👨‍🍳 | Blue | "The kitchen is preparing your order" |
| To Serve | 🍽️ | Indigo | "Your order is ready to be served" |
| Payment | 💳 | Pink | "Please settle your bill" |
| Completed | Checkmark | Small olive/success indicator | "Thank you for dining with us!" |
| Cancelled | ❌ | Red | "This order has been cancelled" |

**Cancellation Flow**:

1. Customer taps "Cancel Order"
2. Confirmation modal: "Cancel this order? This cannot be undone."
3. Server validates status is still Pending
4. Success: Status → Cancelled, board updates live
5. Failure (already preparing): Toast error "Order already being prepared"

**Payment Request Flow**:

1. Customer taps "Request Bill"
2. Confirmation: "Request the bill?"
3. Status moves to Payment
4. Staff sees request, processes offline payment
5. Staff completes order

---

### Screen 6: Ad Placements (Free Tier)

**Customer Menu Ad Slot**:

- Position: Fixed footer, below order action area
- Size: 320×50 (mobile banner) or responsive
- Style: Non-intrusive, separated by divider
- Label: "Advertisement" (caption, neutral-500)
- Does NOT block order submission when loaded

**Ad Blocker State**:

- Full screen modal overlay
- Title: "Please Allow Ads or Subscribe"
- Body: "This restaurant uses the free plan. Ads help keep the service running. Please disable your ad blocker or ask the restaurant owner to upgrade."
- Primary CTA: "I've Allowed Ads — Refresh"
- Secondary CTA: "Learn About Ad-Free Plan"
- Blocks interaction until resolved

---

## Persona 2: Restaurant Admin

### Flow Overview

```
Login → Dashboard → [Menu / Seating / Orders / QR / Settings / Subscription]
Daily Flow: Orders Board → Move cards through statuses → Complete
```

### Screen 1: Login

**Layout**:

- Centered card, max-width 400px
- Logo (top)
- "Restaurant Admin Login" (H1)
- Email input
- Password input
- "Sign In" primary button
- Error toast for invalid credentials
- "Forgot password?" link (if implemented)

---

### Screen 2: Dashboard (Home)

**Layout**:

- **Sidebar** (desktop) / **Bottom Nav** (mobile):
  - Dashboard (stats overview)
  - Orders (board)
  - Menu (catalog)
  - Seating (tables/chairs)
  - QR Codes
  - Settings
  - Subscription
- **Top Bar**:
  - Restaurant name
  - Notification bell (order alerts)
  - Profile dropdown (logout, settings)

**Stats Cards (2×2 grid mobile, 4×1 desktop)**:

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Today's Orders  │ Pending         │ Completed       │ Revenue Est.  │
│     47          │      3          │      44         │   ₱12,450      │
│   +12% vs yest. │  ⚠️ Action needed│  93% completion │  +8% vs yest.  │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

- Card: White bg, shadow-sm, radius-lg
- Metric: H1, bold
- Label: Caption, neutral-500
- Trend: Small text, olive/red semantic indicator only

**Quick Actions**:

- "View Live Board" → Orders
- "Manage Menu" → Menu
- "Print QR Codes" → QR

**Recent Activity**:

- List of last 5 orders
- Order number, table, status badge, time
- Tap to jump to order in board

**Subscription Banner (Free Tier)**:

- Background: `--color-secondary` at 10%
- Subtle cocoa inset line
- Text: "Upgrade to remove ads — ₱100/month"
- CTA: "Upgrade Now" secondary button
- Dismissible for session

---

### Screen 3: Live Order Board (Primary Screen)

**Layout**:

- **Header**:
  - Title: "Live Orders" (H1)
  - Date picker (today default)
  - Filter: All / Pending / Preparing / etc.
  - Sound toggle (order alert chime)
- **Board Columns** (horizontal scroll on mobile, grid on desktop):

```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│   PENDING    │  PREPARING   │   TO SERVE   │   PAYMENT    │  COMPLETED   │
│     (3)      │     (5)      │     (2)      │     (1)      │    (24)      │
│  #FEF3C7 bg  │  #DBEAFE bg  │  #E0E7FF bg  │  #FCE7F3 bg  │  #DCFCE7 bg  │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │
│ │ Order #  │ │ │ Order #  │ │ │ Order #  │ │ │ Order #  │ │ │ Order #  │ │
│ │ Table 3  │ │ │ Table 1  │ │ │ Table 5  │ │ │ Table 2  │ │ │ Table 4  │ │
│ │ 3 items  │ │ │ 2 items  │ │ │ 1 item   │ │ │ 4 items  │ │ │ 2 items  │ │
│ │ ₱450     │ │ │ ₱280     │ │ │ ₱120     │ │ │ ₱890     │ │ │ ₱340     │ │
│ │ 2m ago   │ │ │ 5m ago   │ │ │ 1m ago   │ │ │ 3m ago   │ │ │ 10m ago  │ │
│ │ [Move ▶] │ │ │ [Move ▶] │ │ │[Req Pay] │ │ │[Complete]│ │ │          │ │
│ └──────────┘ │ └──────────┘ │ └──────────┘ │ └──────────┘ │ └──────────┘ │
│ ┌──────────┐ │ ┌──────────┐ │              │              │ ┌──────────┐ │
│ │ Order #  │ │ │ Order #  │ │              │              │ │ Order #  │ │
│ └──────────┘ │ └──────────┘ │              │              │ └──────────┘ │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

**Column Header**:

- Status name + count badge
- Background color matches status
- Sticky within scroll container

**Order Card**:

- Thin status rail: 4px status color
- Order number (H3)
- Table/chair label (Small)
- Item count + total (Body)
- Timestamp (Caption, relative: "2m ago")
- Action button (contextual):
  - Pending → "Start Prep" (moves to Preparing)
  - Preparing → "Ready to Serve" (moves to To Serve)
  - To Serve → "Request Payment" (if enabled) OR "Complete" (if disabled)
  - Payment → "Complete Order"
  - Completed → No action

**Drag and Drop**:

- Desktop: Drag card between columns
- Mobile: Long press → move menu → select target column
- Visual feedback: Card lifts, column highlights on hover
- Invalid drop: Shake animation, returns to origin

**Order Detail Modal**:

- Trigger: Tap order card
- Content:
  - Order number, status badge, timestamp
  - Table/chair context
  - Itemized list (dish, add-ons, notes)
  - Customer note (if any)
  - Total
  - Action buttons (same as card)
  - "Cancel Order" (danger, only if Pending)

**New Order Alert**:

- Toast: "New order #A7B3 from Table 5"
- Sound: Short chime (if enabled)
- Auto-scroll to Pending column
- Card entrance: slide-in + bounce

**Empty Column State**:

- Icon (checkmark or plate)
- "No orders"
- Subtle encouragement

---

### Screen 4: Menu Management

**Layout**:

- **Header**: "Menu" (H1) + "Add Category" button
- **Category Tabs** (vertical sidebar on desktop, horizontal on mobile)
- **Dish Grid**: 1 column mobile, 2 tablet, 3 desktop

**Category Section**:

- Category name (H2) + edit icon + delete icon
- Drag handle for reordering
- "Add Dish" button (secondary, small)

**Dish Card**:

```
┌─────────────────────────────┐
│ [Image: 16:9 aspect ratio]  │
│                             │
├─────────────────────────────┤
│ Dish Name              ₱250 │
│ Description line...         │
│                             │
│ [In Stock ▼]  [Edit] [Del]  │
└─────────────────────────────┘
```

**Dish Actions**:

- Toggle stock status (dropdown or toggle)
- Edit → Dish Form Modal
- Delete → Confirmation → Archive (if used in orders) or Hard delete

**Add/Edit Dish Modal**:

- Image upload (drag & drop or click)
  - Preview with remove button
  - Uploading state with progress
  - R2 storage
- Name input (required)
- Price input (number, required)
- Category select (required)
- Description textarea (optional)
- Add-ons section:
  - List existing add-ons with checkboxes
  - "Add New Add-on" → Inline form (name + price + stock toggle)
- Stock status toggle
- Save / Cancel

**Add-on Management Sub-screen**:

- Table of add-ons
- Columns: Name, Price, Stock Status, Actions
- Inline editing
- Used in orders: Cannot delete, only mark out of stock

---

### Screen 5: Seating & QR Management

**Layout**:

- Two-panel (desktop): Tables list left, Chairs/QR right
- Single panel (mobile): Tables → Drill down → Chairs

**Tables List**:

- Each table: Card with table name/number, chair count, status
- Actions: Edit name, Archive, Reorder (drag), Generate Table QR
- "Add Table" floating button (bottom right)

**Table Detail / Chair Management**:

- Table header with name
- Chair list (vertical):
  - Each chair: Name/label, QR code thumbnail, actions
  - Drag to reorder or move between tables
  - "Generate QR" per chair
  - "Print QR" (opens print dialog with formatted layout)
- "Add Chair" button

**QR Code Display**:

- Large QR code image (300×300)
- Label: "Table 5 — Chair A"
- URL preview (truncated)
- Copy URL button (fallback for sending the QR link directly)
- Download PNG button
- Print button (opens browser print with styled layout)
- Regenerate button (with confirmation: "This will invalidate the old QR code")

**Archive Flow**:

1. Archive table/chair
2. Confirmation: "Archive Table 5? Existing QR codes will no longer work."
3. Archived items move to "Archived" section (collapsible)
4. Can restore from archive

---

### Screen 6: Settings

**Sections**:

- **Restaurant Profile**:
  - Name (required)
  - Description
  - Logo upload
  - Contact info
- **Operating Preferences**:
  - Payment stage toggle (enabled/disabled)
  - Default view (board first vs dashboard first)
  - Order alert sounds (on/off)
- **Account**:
  - Email
  - Change password
  - Logout

---

### Screen 7: Subscription

**Layout**:

- **Current Plan Card**:
  - Free: "Free Plan" badge, "Ads enabled" note
  - Paid: "Premium Plan" badge, "Ads removed" note, expiry date
- **Plan Comparison**:
  | Feature | Free | Premium |
  |---------|------|---------|
  | Orders | Unlimited | Unlimited |
  | Menu items | Unlimited | Unlimited |
  | QR codes | Unlimited | Unlimited |
  | Ads | Yes | No |
  | Price | Free | ₱100/month |
- **Upgrade CTA** (if free):
  - "Upgrade to Premium — ₱100/month"
  - PayMongo checkout integration
  - Test mode indicator (if applicable)
- **Manage Subscription** (if paid):
  - Next billing date
  - "Cancel Subscription" (danger, confirmation required)
  - Payment history

---

### Screen 8: Statistics

**Layout**:

- Date range picker (Today, Yesterday, Last 7 days, Last 30 days, Custom)
- **Summary Cards** (same as dashboard, but for selected range)
- **Charts**:
  - Orders by day (line chart)
  - Top dishes (bar chart)
  - Orders by table (pie/donut chart)
  - Revenue by category (stacked bar)
- **Orders Table**:
  - Sortable columns: Order #, Table, Items, Total, Status, Date
  - Pagination
  - Export to CSV (optional)

---

## Persona 3: Admin (Platform Administrator)

### Flow Overview

```
Login → Platform Dashboard → Manage Restaurants → [View/Edit/Suspend]
```

### Screen 1: Platform Dashboard

**Layout**:

- Sidebar: Dashboard, Restaurants, Analytics, Settings
- Top bar: Platform name, Admin profile

**Stats Cards**:

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Restaurants  │ Active Today │ Free Tier    │ Paid Tier    │
│     156      │     89       │     134      │      22      │
│   +5 this mo │   57% active │    86%       │    14%       │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Recent Activity**:

- New restaurant signups
- Subscription changes
- Suspended accounts

**Quick Actions**:

- "Add Restaurant Admin"
- "View All Restaurants"

---

### Screen 2: Restaurant Management

**Layout**:

- **Filter Bar**: Search, Status filter (All/Active/Suspended), Tier filter
- **Data Table**:
  - Columns: Restaurant Name, Admin Email, Status, Tier, Orders (30d), Created, Actions
  - Sortable headers
  - Pagination: 25/50/100 per page

**Row Actions**:

- View → Restaurant detail modal (read-only operations data)
- Edit → Change name, contact (limited)
- Suspend/Activate → Toggle with confirmation
- Delete → Only if no orders, confirmation

**Add Restaurant Admin Modal**:

- Restaurant name
- Admin email
- Admin password (auto-generated or custom)
- "Create" button
- Success toast + email sent (if implemented)

---

### Screen 3: Restaurant Detail (Read-Only)

**Tabs**:

- Overview: Stats, subscription status, contact
- Orders: Last 50 orders (read-only)
- Activity: Login history, changes (audit log)

---

## Persona 4: Super Admin

### Flow Overview

```
Login → Platform Control → Manage Admins → [Create/Edit/Transfer Ownership]
```

### Screen 1: Super Admin Dashboard

**Layout**:

- Similar to Admin dashboard
- Additional card: "Platform Health" (uptime, error rate)

---

### Screen 2: Admin Account Management

**Layout**:

- Table of Admin accounts
- Columns: Name, Email, Status, Created, Last Login, Actions
- Actions: Edit, Suspend, Reset Password, Transfer Ownership

**Transfer Ownership Flow**:

1. "Transfer Ownership" button
2. Modal: Select new Super Admin from existing admins
3. Confirmation: "This will demote you to Admin. Are you sure?"
4. Requires password re-entry
5. Success: Logout + redirect to login

---

## Responsive Behavior Summary

### Breakpoint Strategy

| Breakpoint          | Layout                      | Navigation          | Board Columns               |
| ------------------- | --------------------------- | ------------------- | --------------------------- |
| < 640px (Mobile)    | Single column               | Bottom tab bar      | 1 column, horizontal scroll |
| 640-1024px (Tablet) | Two column where applicable | Collapsible sidebar | 3 columns visible, scroll   |
| > 1024px (Desktop)  | Multi-column                | Fixed sidebar       | All columns visible         |

### Mobile-Specific Patterns

- Bottom sheets instead of modals for forms
- Floating action buttons (FAB) for primary create actions
- Swipe gestures for quick actions (archive, delete)
- Pull-to-refresh for lists
- Sticky headers/footers for actions
- Full-screen overlays for complex forms

### Tablet-Specific Patterns

- Split view: List left, Detail right
- Larger touch targets for kitchen use (glove-friendly)
- Landscape orientation optimized for board view

---

## Accessibility Considerations

- All interactive elements: min 44×44px touch target
- Color contrast: WCAG AA minimum (4.5:1 for text)
- Status colors supplemented with icons and text labels
- Focus indicators: 2px outline, offset 2px
- Screen reader: Order cards announce status, table, items
- Reduced motion: Respect `prefers-reduced-motion`
- Keyboard navigation: Full board control via keyboard shortcuts
  - Arrow keys: Navigate cards
  - Enter: Open detail
  - 1-5: Move to column (1=Pending, 2=Preparing, etc.)

---

## Ad Implementation Layout

### Free Tier Ad Slots

**Restaurant Admin Dashboard**:

- Slot: Sidebar bottom or below stats cards
- Size: 300×250 (medium rectangle) or responsive
- Style: Separated by divider, "Advertisement" label

**Customer Menu**:

- Slot: Fixed footer, below cart action
- Size: 320×50 (mobile banner)
- Style: Non-floating, non-blocking

**Loading States**:

- Ad container reserves space (prevents layout shift)
- Skeleton loader while ad loads
- Collapses gracefully if no fill

### Ad Blocker Recovery

**Trigger**: Ad script fails to load or ad blocker detected

**Modal**:

- Full screen overlay, cannot dismiss
- Icon: Shield with warning
- Title: "Ad Blocker Detected"
- Body:
  - "This restaurant uses QR Resto Hub's free plan.
    Ads support the platform. Please disable your ad blocker
    for this site, or ask the restaurant to upgrade to Premium."
- Actions:
  - "I've Disabled My Ad Blocker" (primary, refreshes page)
  - "Learn About Premium" (secondary, links to subscription info)
- Paid tenants: Skip entirely, no ad loading

---

## WebSocket / Live Update UX

### Connection States

| State        | Indicator                  | Behavior                                   |
| ------------ | -------------------------- | ------------------------------------------ |
| Connected    | Small olive dot, "Live"   | Real-time updates active                   |
| Connecting   | Amber dot, "Connecting..." | Retry in progress, queue updates           |
| Disconnected | Red dot, "Offline"         | Show banner, queue actions, retry every 5s |
| Reconnected  | Brief olive/success indicator, "Back online" | Sync queued actions, refresh data          |

### Optimistic Updates

- Board card moves immediately on drag
- Reverts with shake animation if server rejects
- Toast on conflict: "Order status changed by another user"

### Conflict Resolution

- Concurrent status changes: Last-write-wins with timestamp
- Customer cancellation + staff move: Server rejects cancellation, customer sees toast

---

## Error State Patterns

### Network Error

- Icon: Cloud offline
- Title: "Connection lost"
- Body: "Check your internet connection and try again."
- CTA: "Retry" button

### 403 Forbidden

- Icon: Lock
- Title: "Access denied"
- Body: "You don't have permission to view this page."
- CTA: "Go to Dashboard"

### 404 Not Found

- Icon: Search
- Title: "Page not found"
- Body: "The page you're looking for doesn't exist."
- CTA: "Go Home"

### Empty States (Feature-Specific)

- No orders: "No orders yet. When customers scan QR codes and order, they'll appear here."
- No menu items: "Your menu is empty. Add categories and dishes to get started."
- No tables: "Set up your seating plan to generate QR codes."

---

## File Structure (UI Components)

```
src/
├── components/
│   ├── ui/                    # Primitive components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   └── EmptyState.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── BottomNav.tsx
│   │   └── PageLayout.tsx
│   ├── board/
│   │   ├── BoardColumn.tsx
│   │   ├── OrderCard.tsx
│   │   ├── DragOverlay.tsx
│   │   └── StatusBadge.tsx
│   ├── menu/
│   │   ├── DishCard.tsx
│   │   ├── CategoryTabs.tsx
│   │   ├── DishSheet.tsx
│   │   ├── CartItem.tsx
│   │   └── QuantityStepper.tsx
│   ├── seating/
│   │   ├── TableCard.tsx
│   │   ├── ChairList.tsx
│   │   └── QRDisplay.tsx
│   ├── customer/
│   │   ├── OrderTimeline.tsx
│   │   ├── StatusBadge.tsx
│   │   └── CartFooter.tsx
│   └── ads/
│       ├── AdSlot.tsx
│       └── AdBlockerModal.tsx
├── hooks/
│   ├── useWebSocket.ts
│   ├── useOrderStatus.ts
│   ├── useCart.ts
│   └── useDragAndDrop.ts
├── lib/
│   └── ads/
│       ├── AdSenseProvider.ts
│       └── AdBlockDetector.ts
└── styles/
    ├── tokens.css
    └── animations.css
```

---

## Animation Specifications

### Page Transitions

- Enter: fade-in + translateY(8px), 250ms
- Exit: fade-out, 150ms

### Modal / Sheet

- Overlay: fade-in 200ms
- Content: slide-up from bottom (mobile) / scale + fade (desktop)
- Close: reverse

### Board Card Move

- Lift: scale(1.02) + rotate(1deg) + shadow-lg, 200ms
- Drop: scale(1) + rotate(0), bounce easing, 300ms
- Column enter: slide-in from left, stagger 50ms per card

### Status Update

- Pulse: scale(1.05) → scale(1), 300ms
- Color transition: 200ms
- Toast: slide-in from right, auto-dismiss after 4s

### Loading Sequences

- Skeleton: shimmer animation, 1.5s infinite
- Spinner: rotate 360deg, 1s linear infinite
- Button loading: Spinner replaces text, width maintained

---

## Key UX Decisions

1. **Mobile-First for Customers**: 90% of customer interaction is mobile. Every customer screen is designed thumb-reachable.

2. **Speed for Restaurant Staff**: Board interactions must feel instant. Optimistic UI, keyboard shortcuts, large touch targets.

3. **No Account Friction**: Customers never see login/signup. QR → Menu → Order in <30 seconds.

4. **Clear Status Communication**: Both staff and customers see the same status language. No ambiguity about where an order is.

5. **Ad Non-Intrusiveness**: Ads never block functionality when loaded. Only ad blockers trigger enforcement, and paid tenants skip entirely.

6. **Graceful Degradation**: Offline mode shows cached data with clear "Reconnecting" state. Actions queue and sync.

7. **Visual Hierarchy**: Status colors are consistent across all views. Staff learn: amber = needs action, blue/info = in progress, and small olive/success indicators = done/success.

---

_This UI design document serves as the implementation reference for all frontend development, component scoping, and design handoff._
