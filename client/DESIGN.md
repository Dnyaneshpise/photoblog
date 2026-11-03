# Photolog Design System

**Authority:** This document is the single source of truth for visual and interaction design.  
Any future change to UI, tokens, components, or layout **must** follow these rules.

**Product:** Photolog / Photoblog  
**Owner:** Dnyanesh Pise  
**License of original design assets:** Original work created for Photolog. Icons, loaders, motion language, type system, and color system in this repository are proprietary to the project unless otherwise noted. Do not treat them as third-party template assets.

**Principle:** Photographs are the content. Everything else is secondary architecture.

---

## 1. Design stance

1. Photographs own the page. Type, chrome, and motion never compete with the image.
2. Restraint is a feature. Every size, color, space, and transition must earn its place.
3. Craft over trend. The system should feel intentional in five years.
4. Human rhythm. Spacing and type come from optical judgment, not only framework defaults.
5. Originality from foundation. Fonts, palette, scale, icons, loaders, and interaction language are defined here.

### Forbidden patterns

- Inter + Cormorant / Playfair as default pairings
- Warm beige `#f7f5f2` as primary canvas (legacy only via alias)
- Glassmorphism, heavy gradients, floating shadow cards, decorative blurs
- Generic spinner circles from UI kits
- Motion that exists only to feel “modern”
- Lucide / Heroicons / Feather as the primary icon language (use Photolog icons)

---

## 2. Typography

| Role | Family | Use |
|------|--------|-----|
| Display | Instrument Serif | Titles, wordmark, large headings |
| Body / UI | Instrument Sans | Body, nav, captions, controls |

Both from Pangram Pangram — one foundry, one voice.

---

## 3. Color (semantic)

| Token | Value | Role |
|-------|-------|------|
| `--color-paper` / `--color-canvas` | `#f3f2ef` | Page background |
| `--color-surface` | `#fafaf8` | Elevated surface |
| `--color-ink` | `#141413` | Primary text |
| `--color-ink-secondary` / `--color-ink-muted` | `#3f3f3c` | Secondary text |
| `--color-ink-tertiary` / `--color-ink-subtle` | `#6e6e69` | Meta, captions |
| `--color-rule` / `--color-border` | `#d6d4ce` | Borders |
| `--color-accent` | `#1a1917` | Interactive near-ink |

Legacy alias names (`canvas`, `border`, `ink-muted`, `ink-subtle`) remain mapped for existing components.

---

## 4. Motion

- Duration: 150–280ms UI; up to 500ms for image/page reveals
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (Photolog decelerate)
- Prefer opacity + transform
- Always honor `prefers-reduced-motion`

### Named effects (CSS / components)

| Name | Use |
|------|-----|
| `pl-fade-up` | Content enter |
| `pl-image-reveal` | Photo load mask |
| `ApertureLoader` | Loading state (shutter blades) |
| `PageFade` | Route content fade |
| `ImageReveal` | Progressive image with soft veil |

---

## 5. Icons (Photolog set)

Custom SVG components in `src/components/icons/PhotologIcons.tsx`.  
Stroke-based, 1.5px optical weight, 24 viewBox. Not third-party icon packs.

Include: Menu, Close, ArrowRight, ArrowLeft, External, Grid, Frame (mark).

---

## 6. Loaders & states

- **ApertureLoader** — unique multi-blade shutter animation (Photolog original)
- **StateBlock** — quiet title + detail; optional loader
- Skeletons: thin rule + paper surface, no pulse rainbow

---

## 7. File ownership

| Path | Responsibility |
|------|----------------|
| `client/DESIGN.md` | This document |
| `client/src/index.css` | Tokens, base, effects |
| `client/src/components/icons/` | Photolog SVG icons |
| `client/src/components/ui/` | Loader, PageFade, ImageReveal |
| `client/public/favicon.svg` | Wordmark mark |

---

## 8. Change protocol

1. Read this document before changing UI.
2. Prefer tokens over one-off values.
3. New patterns → update this file first, then implement.
4. Do not reintroduce Inter / Cormorant / warm beige as the primary system.
