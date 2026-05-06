** This document might be deprecated as new Design is created under BMAD. Use this as legacy reference only. Some contents here are still usable **

I've created a comprehensive UI Design Document covering all four personas and their flows based on the PRD. Here's a summary of what's included:
Document Structure
🎨 Design System
Color palette with semantic tokens (status colors, board column backgrounds, ad-related states)
Typography scale (Inter font, responsive sizes)
Spacing, shadows, elevation, and animation tokens
👤 Persona Flows & Screens
Table
Persona Key Screens Flow
Customer (Mobile) QR Landing → Menu → Dish Sheet → Cart → Live Status Anonymous ordering with real-time status tracking
Restaurant Admin Dashboard → Live Board → Menu Mgmt → Seating/QR → Subscription Daily operations, order management, menu setup
Admin (Platform) Dashboard → Restaurant Table → Detail View Manage restaurant accounts, view metrics
Super Admin Dashboard → Admin Mgmt → Ownership Transfer Platform-level control, account hierarchy
🎯 Key Design Decisions
Customer: Mobile-first, bottom sheets for dish details, sticky cart footer, live status timeline with cancellation (only while Pending) and payment request (only at To Serve)
Restaurant Admin: Kanban board with drag-and-drop order cards, color-coded columns, optimistic UI for instant feel, keyboard shortcuts for speed
Ads: Non-intrusive footer/sidebar slots, ad-blocker recovery modal that blocks interaction until resolved, paid tenants skip entirely
Responsive: Bottom nav on mobile, collapsible sidebar on tablet, fixed sidebar on desktop
📐 Component Library
Buttons, cards (standard, board, menu), inputs, badges (all status types), modals, toasts, empty states, skeletons — all with specified tokens.
♿ Accessibility
WCAG AA contrast, 44px touch targets, screen reader support for order cards, prefers-reduced-motion respect, full keyboard navigation for the board.
