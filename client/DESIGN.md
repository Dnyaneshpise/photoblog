# Photolog Design System

**Authority:** Single source of truth for visual and interaction design.  
**Product:** Photolog / Photoblog · **Owner:** Dnyanesh Pise  
**License:** Original design assets (icons, loaders, motion, type system, color, component language) are proprietary to this project.

**Principle:** Photographs are the content. Everything else is secondary architecture.

---

## Stance

1. Editorial quiet — museum-grade restraint, not template minimalism.
2. Hierarchy through scale and space, not decoration.
3. One foundry voice: Instrument Serif + Instrument Sans.
4. Motion is functional (orientation, feedback). Never ornamental.
5. No Inter/Cormorant defaults, no Lucide packs, no glass cards, no generic spinners.

---

## Type

| Role | Face | Notes |
|------|------|-------|
| Display | Instrument Serif | Titles, wordmark — tracking −0.025em to −0.03em |
| Body / UI | Instrument Sans | Nav, captions, forms |

Display sizes use `clamp()` for fluid premium scale. Kickers: 0.65rem, 0.18–0.22em tracking, uppercase.

---

## Color

| Token | Value |
|-------|-------|
| paper / canvas | `#f2f0eb` |
| surface | `#faf9f6` |
| ink | `#121110` |
| ink-secondary / muted | `#3a3835` |
| ink-tertiary / subtle | `#6f6c66` |
| rule / border | `#d2cfc7` |

---

## Component language

| Class / component | Role |
|-------------------|------|
| `.pl-btn` / `.pl-btn-ghost` | Primary / secondary actions |
| `.pl-field` / `.pl-label` | Underline form fields |
| `.pl-filter` | Gallery category filters |
| `.pl-photo` + meta rule | Photo tiles |
| `.pl-kicker` / `.pl-display` / `.pl-lead` | Editorial type roles |
| `.pl-page` | Consistent page padding |
| `ApertureLoader` | Loading (shutter blades) |
| `PhotologIcons` | Menu, Close, Arrows, External, Grid, Frame |

---

## Layout

- Max content width ~72rem for galleries; ~3xl for text pages.
- Home: left-aligned editorial hero (not centered brochure).
- Section indices (`01 — Selected`) for quiet structure.
- Photo meta sits under a thin rule — captions never float on the image.
- Sticky masthead with frosted paper, not solid white bar.

---

## Motion

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Image hover: scale 1.025 over 0.85s — restrained
- Grid enter: staggered fade-up, max delay 0.3s
- Honor `prefers-reduced-motion`

---

## Change protocol

1. Read this file before UI work.
2. Prefer tokens and `.pl-*` classes over one-offs.
3. New patterns → document here in the same change.
4. **One commit per day maximum** for this project when shipping design.
