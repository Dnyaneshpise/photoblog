# Photolog Design System

**Authority for all client UI.** Original work for Photolog.  
**License / ownership:** © Photolog — Dnyanesh Pise. All design tokens, motion, icons, layouts, and component language in this system are project-original and licensed under the project owner. Do not treat as generic template or third-party kit.

## Stance

- The photograph is the product. Chrome is quiet.
- Editorial, not SaaS. Paper and ink, not glass and purple gradients.
- Motion is short, purposeful, and ease-out — never delayed for spectacle.
- Prefer optical judgment over rigid 8px grids when they fight the image.

## Typography

- **Display:** Instrument Serif — titles, wordmark, photo titles  
- **Body / UI:** Instrument Sans — navigation, meta, forms  
- Display tracking tight (−0.03em). Kickers uppercase, wide tracking (~0.2em).

## Color

| Token | Value | Use |
|-------|-------|-----|
| paper / canvas | `#efece6` | Page ground |
| surface | `#f7f5f0` | Raised soft areas |
| ink | `#0e0d0c` | Primary type |
| ink-secondary | `#3a3733` | Body secondary |
| ink-tertiary | `#6a6660` | Meta, kickers |
| rule | `#cfc9bf` | Hairlines |
| night | `#0c0b0a` | Cover / lightbox |

Paper grain overlay (fixed, low opacity) is intentional — tactile print feel.

## Layout patterns

1. **Cover** — full-bleed featured image, bottom-aligned type, transparent masthead that solidifies on scroll.  
2. **Filmstrip** — horizontal snap scroll for recent selections.  
3. **Bento** — asymmetric featured block on home.  
4. **Mosaic** — gallery grid with mixed aspect rhythm (not equal tiles).  
5. **Underline filters** — category links, not solid chips.  
6. **Plate** — collection card with optical inset frame and index mark.  
7. **Film-edge meta** — photo detail caption strip with tick marks (analog edge feel).

## Motion (Photolog originals)

- **Aperture loader** — eight blades, staggered opacity.  
- **Curtain reveal** — top-origin scaleY on image load.  
- **Viewfinder** — four corner ticks on photo hover.  
- **Cover ken-burns** — soft scale-in on hero.  
- **Lightbox** — fade + slight scale; counter `01 — 12` form.  
- **Exposure progress** — thin ink line under masthead tracking scroll depth.  
- **Shutter page** — brief opacity/y settle on route change (PageFade).  
- **Optical rule** — section divider with centered hairline notch.  
- **Aperture return** — circular back-to-top with rotating blade ring.  
- Easings: `--ease-out-expo` `[0.16, 1, 0.3, 1]`, `--ease-pl` `[0.22, 1, 0.36, 1]`.  
- Respect `prefers-reduced-motion`.

## Components

- `pl-*` CSS classes are the public design API.  
- Icons: `PhotologIcons.tsx` only — no Lucide/Heroicons in public UI.  
- Buttons: solid ink / ghost on cover / ink-ghost on paper.  
- Forms: underline fields, uppercase micro labels.  
- `ExposureProgress` — scroll depth under masthead.  
- `OpticalRule` — section separator.  
- `BackToTop` — aperture-ring control.

## Commit discipline

- Max **one commit per day** on this project.  
- Batch all design work into that single commit.  
- Conventional commits (`feat` / `fix` / `docs` / `chore`). No “Day N” messages.

## Do not

- Introduce Inter, Roboto, system-default “AI” stacks as primary UI.  
- Add purple/blue SaaS accents.  
- Equal 3-column grids as the only gallery layout.  
- Loud parallax or scrolljacking.  
- Commit multiple times in one calendar day.
