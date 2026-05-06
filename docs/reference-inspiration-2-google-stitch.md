---
name: Modern Epicurean
colors:
  surface: "#fdf8f7"
  surface-dim: "#ddd9d8"
  surface-bright: "#fdf8f7"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f7f3f1"
  surface-container: "#f2edeb"
  surface-container-high: "#ece7e6"
  surface-container-highest: "#e6e1e0"
  on-surface: "#1c1b1b"
  on-surface-variant: "#4c463f"
  inverse-surface: "#31302f"
  inverse-on-surface: "#f4f0ee"
  outline: "#7d766e"
  outline-variant: "#cec5bc"
  surface-tint: "#645d56"
  primary: "#645d56"
  on-primary: "#ffffff"
  primary-container: "#f2e8df"
  on-primary-container: "#6e6861"
  inverse-primary: "#cec5bc"
  secondary: "#8b4e3a"
  on-secondary: "#ffffff"
  secondary-container: "#fdae94"
  on-secondary-container: "#783f2c"
  tertiary: "#a04100"
  on-tertiary: "#ffffff"
  tertiary-container: "#ffe4d9"
  on-tertiary-container: "#b14800"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#ebe1d8"
  primary-fixed-dim: "#cec5bc"
  on-primary-fixed: "#1f1b16"
  on-primary-fixed-variant: "#4c463f"
  secondary-fixed: "#ffdbd0"
  secondary-fixed-dim: "#ffb59d"
  on-secondary-fixed: "#370e01"
  on-secondary-fixed-variant: "#6e3724"
  tertiary-fixed: "#ffdbcc"
  tertiary-fixed-dim: "#ffb693"
  on-tertiary-fixed: "#351000"
  on-tertiary-fixed-variant: "#7a3000"
  background: "#fdf8f7"
  on-background: "#1c1b1b"
  surface-variant: "#e6e1e0"
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: "700"
    lineHeight: 48px
    letterSpacing: -0.02em
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: -0.01em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 20px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-padding: 20px
  gutter: 16px
---

## Brand & Style

The design system is anchored in the concept of "Quiet Luxury" within the digital dining space. It prioritizes the culinary experience by stepping back, using generous whitespace and a restrained palette to let high-quality food photography take center stage. The personality is sophisticated yet welcoming, bridging the gap between a high-end physical menu and a seamless digital interface.

The visual style is a hybrid of **Minimalism** and **Glassmorphism**. It utilizes the structural clarity of Apple’s human interface guidelines—characterized by clear hierarchies and functional aesthetics—while introducing depth through translucent layers and blurred backgrounds. This creates a tactile, premium feel that evokes the atmosphere of a dimly lit, upscale bistro.

## Colors

The palette for this design system is organic and warm, moving away from sterile whites to a rich, cream-based foundation.

- **Primary (#F2E8DF):** Used for large surface areas and app backgrounds to provide a soft, parchment-like canvas that reduces eye strain.
- **Secondary (#5D2A18):** This deep cocoa brown serves as the primary "ink," used for all body text, headings, and iconography to maintain a sophisticated contrast.
- **Accent Orange (#FF6B00):** Reserved for primary calls to action (CTAs), price highlights, and critical interactive states.
- **Accent Olive (#8B8000):** Used for "Health," "Vegetarian," or "Sustainable" markers, as well as secondary active states like "Order Confirmed."

Color application should follow a 60/30/10 distribution to ensure the interface remains light and airy despite the richness of the secondary tones.

## Typography

This design system employs a dual-font strategy to balance character with utility. **Plus Jakarta Sans** is used for headings; its soft curves and modern geometric construction provide an approachable yet premium editorial feel. For functional text, **Inter** is utilized for its exceptional legibility at small sizes and its neutral, systematic appearance.

Maintain tight tracking on larger headings to achieve a "San Francisco" editorial look. All cocoa brown text (#5D2A18) should maintain a minimum contrast ratio of 7:1 against the cream background for AAA accessibility compliance.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with high-density margins to create a "contained" and focused reading experience.

- **Rhythm:** Use an 8px baseline grid to ensure vertical consistency.
- **Margins:** A standard 20px or 24px horizontal margin is required on mobile to prevent content from feeling crowded.
- **Whitespace:** Intersperse sections with generous `lg` (40px) or `xl` (64px) vertical padding to signal transitions between menu categories (e.g., Starters to Mains).
- **Safe Areas:** Navigation bars and "Add to Cart" sticky buttons must respect hardware safe areas, using glassmorphic backgrounds to show content scrolling underneath.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Glassmorphism** rather than traditional heavy shadows.

1.  **Level 0 (Base):** The solid Cream (#F2E8DF) canvas.
2.  **Level 1 (Cards):** Slightly lighter surfaces with a 1px inner border (10% Cocoa opacity) to define edges.
3.  **Level 2 (Overlays):** Modal sheets and navigation bars utilize `backdrop-filter: blur(20px)` with a semi-transparent cream tint (80% opacity).
4.  **Shadows:** When necessary, use "Ambient Shadows"—highly diffused (30px+ blur), low-opacity (5-8%) shadows tinted with the Cocoa Brown (#5D2A18) rather than pure black, ensuring the depth feels warm and integrated.

## Shapes

The shape language is strictly **Squircled** (continuous curvature), echoing Apple’s hardware and software aesthetics.

- **Standard Elements:** Buttons and input fields use a 0.5rem (8px) radius.
- **Container Elements:** Large menu item cards and image containers use a 1.5rem (24px) radius to create a soft, friendly silhouette.
- **Interactive Feedback:** Active states should see a subtle scale-down (98%) rather than a color change alone, emphasizing the tactile nature of the interface.

## Components

- **Buttons:** Primary CTAs are solid Orange (#FF6B00) with White text. Secondary buttons use a Cocoa Brown (#5D2A18) ghost style (thin border and text).
- **Cards:** Menu items should be presented in cards with full-bleed photography at the top. The bottom section (text area) uses the cream background with a subtle divider.
- **Chips:** Use Olive Green (#8B8000) for dietary tags (Vegan, GF) with 10% opacity fills and 100% opacity text for a sophisticated, non-intrusive look.
- **Inputs:** Search bars and special request fields feature a glassmorphic background with a Cocoa Brown placeholder text at 50% opacity.
- **QR Scanner:** The scanning interface should be minimalist, featuring a thin Cocoa Brown frame with rounded corners and a blurred periphery to focus the user’s eye on the code.
- **Cart/Total Bar:** A sticky bottom element using a heavy backdrop blur, a top border of 0.5px (Cocoa, 20% opacity), and a bold Orange price indicator.
