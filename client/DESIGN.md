# Photolog Design System

**Authority for all client UI.**  
**Exclusive Proprietary — Copyright © 2026 Dnyanesh Pise / Photolog. All Rights Reserved.**  
Not MIT. Not Creative Commons. See `legal/PROPRIETARY_LICENSE.md`.

This document is the single source of truth. Code and Figma follow it.

**Canva** files are brand/mood boards only — not pixel specifications for the web app. Do not expect the live site to match Canva presentation styling 1:1. **Figma screen map + this file** define production UI.

---

## Contemporary premium (2026)

- Clean gallery ground, not yellowed scrapbook.
- Serif for display only; UI stays sharp sans.
- Motion is precise, not theatrical analog cosplay.
- Large images, generous air, minimal chrome.
- Unique Photolog language remains — refined, not discarded.

## Stance

Photolog is a **contemporary editorial photography house** — refined, current, and quiet. Not a product dashboard, not a vintage prop set.

1. **The photograph is the product.** Interface recedes.
2. **Paper and ink** — warm ground, near-black type, hairline rules. No glass, no purple, no neon.
3. **Optical judgment over grid dogma.** If an 8px grid fights the image, the image wins.
4. **Motion is exposure, not entertainment.** Short, ease-out, purposeful.
5. **Quiet premium.** Restraint reads as confidence; decoration reads as doubt.

---

## Typography

| Role | Face | Notes |
|------|------|--------|
| Display | **Instrument Serif** | Titles, wordmark, photo titles. Tracking −0.03em. Weight 400 only. |
| Body / UI | **Instrument Sans** | Nav, meta, forms, body. |

### Scale (preferred)

| Token | Size | Use |
|-------|------|-----|
| display-xl | `clamp(2.5rem, 6vw, 4rem)` | Cover title, rare hero |
| display-lg | `clamp(2.2rem, 5vw, 3.5rem)` | Page H1 |
| display-md | `1.5–2rem` | Section titles |
| body | `1rem` / 1.65 | Default |
| lead | `1.05–1.15rem` / 1.65 | Intro paragraphs |
| caption | `0.72rem` | Under-image |
| kicker | `0.62rem` · tracking 0.2em · uppercase | Section labels |
| meta | `0.62rem` · tracking 0.12–0.16em · uppercase | Dates, EXIF, nav |

Measure: body ~55–65ch. Captions ≤36em. Never stretch display type.

---

## Color

| Token | Hex | Role |
|-------|-----|------|
| paper / canvas | `#f4f3f0` | Page ground (clean gallery white-warm) |
| surface | `#faf9f7` | Soft raised (plates) |
| ink | `#0e0d0c` | Primary type & solid controls |
| ink-secondary | `#3a3733` | Body secondary |
| ink-tertiary | `#6a6660` | Kickers, meta, idle nav |
| rule | `#cfc9bf` | Hairlines |
| rule-strong | `#a8a299` | Emphasized ticks |
| night | `#0c0b0a` | Cover field, lightbox, filmstrip chrome |

Paper grain is optional and very low (~1.8%) — presence, not aged paper nostalgia.  
**Selection:** ink background, paper text.  
**No accent hue.** Ink is the only “brand color.”

---

## Layout patterns

| Pattern | Where | Rule |
|---------|-------|------|
| Cover | Home | Full-bleed image, bottom-left type, scroll cue, optional edge veil |
| Filmstrip | Home | Horizontal snap; ~3:4 cards; proof-like density |
| Bento | Home | Asymmetric featured (1 large + 2 stack) |
| Mosaic | Gallery, series | Mixed column spans — never equal Instagram tiles |
| Plate | Collections | Inset optical frame + index `01` |
| Film-edge | Photo detail | Sprocket ticks + title + meta |
| Narrow column | About, Contact | `max-w-3xl` / `max-w-lg` — editorial, not wide blog |
| 404 | Miss | Aperture mark only — no illustration |

Content width: `max-w-[72rem]` for image-heavy pages.

---

## Spacing

- Page pad X: `clamp(1.25rem, 4vw, 3rem)`
- Section Y: 4–6rem major; 1.5–2rem within clusters
- Mosaic gutter: 0.55–0.75rem
- Diptych gutter: 0.65rem
- Hairlines: **1px** only
- Lift: **2px** max `translateY` — no card shadows

---

## Motion (proprietary)

| Name | Spec |
|------|------|
| Aperture loader | 8 blades, staggered opacity, 1150ms |
| Curtain reveal | scaleY top-origin ~850ms ease-out-expo |
| Darkroom develop | opacity + contrast 900ms (paper → silver) |
| Viewfinder | 4 corner ticks on photo hover |
| Focus pull | Target sharp/scale; peers soft-blur |
| Ken-burns | Cover only; ≤1.04 scale over ≥12s |
| Lightbox | Night fade + slight scale; counter `01 — 12` |
| Exposure progress | 2px ink under masthead, scroll-linked |
| Page shutter | PageFade ~450ms |
| Optical rule | Hairline + diamond notch |
| Aperture return | Circular back-to-top |

**Easings:**  
`--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`  
`--ease-pl: cubic-bezier(0.22, 1, 0.36, 1)`

Respect `prefers-reduced-motion` — kill loops and long transitions.

---

## Chrome

### Masthead
- Height ~4.25–4.75rem
- Over home cover: transparent type on paper (inverse)
- After scroll / inner pages: solid paper + bottom hairline
- Nav: uppercase tracked links; **active = ink + underline**
- Exposure bar sits under the hairline

### Footer
- Optical rule + small aperture mark
- Proprietary copyright line (required)
- Social as text links, not icon grids

---

## Components API (`pl-*`)

Public classes are the design API. Prefer them over one-off Tailwind for brand surfaces.

Buttons: `.pl-btn` · `.pl-btn-ghost` (on night) · `.pl-btn-ink-ghost` (on paper)  
Fields: `.pl-field` underline · `.pl-label`  
Filters: `.pl-filter` / `.is-active`  
Links: `.pl-link` (grow underline)  
Structure: `.pl-page` · `.pl-kicker` · `.pl-display` · `.pl-lead` · `.pl-cover*` · `.pl-strip` · `.pl-bento` · `.pl-mosaic` · `.pl-plate*` · `.pl-film-edge*` · `.pl-404*`

Icons: **only** `PhotologIcons.tsx`.

---

## Micro-interactions

| Element | Behavior |
|---------|----------|
| Nav link | Color + underline, no scale |
| Filter | Border-bottom ink |
| Photo | Viewfinder + optional focus-pull |
| Button | Fill invert — never bounce |
| Plate | 2px lift |
| Wordmark | Static |

---

## Forbidden

- Purple / indigo / “AI gradient” accents  
- Glassmorphism, heavy backdrop-blur panels  
- Elastic / bounce easing  
- Equal-tile grids as default gallery  
- Stock illustration empty states  
- Inter, Roboto, or system UI as primary faces  
- Animated logo loops  
- Scrolljacking / loud parallax  
- Permissive licenses (MIT/CC) on design assets  

---

## Routes

See `legal/PAGE_SPECS.md` for zone-by-zone specs.

| Path | Pattern |
|------|---------|
| `/` | Cover → rule → filmstrip → bento → plates |
| `/gallery` | Archive → underline filters → mosaic |
| `/photos/:id` | Return · image · film-edge · related |
| `/collections` | Series → plate grid |
| `/collections/:slug` | Series title → mosaic |
| `/about` | Narrow · bio · statement · elsewhere |
| `/contact` | Narrow form · underline fields |
| `404` | Aperture · Home / Gallery |

Figma: *Photolog Design System* — tokens, effects atelier, screen map.

---

## Commit discipline

- **Max one commit per day**
- Batch design into that commit
- Conventional commits only (`feat` / `fix` / `docs` / `chore`)

---

## Ownership

Every token, motion, icon, layout pattern, and page structure in this system is **Exclusive Proprietary © 2026 Dnyanesh Pise / Photolog**. Unauthorized cloning of layout or effects is prohibited.
