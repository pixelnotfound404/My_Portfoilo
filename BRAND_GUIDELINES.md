# SCOTT UX LAB — Brand Design & Color Palette Guidelines

> This document defines the visual identity system for **Scott UX Lab**, a UX/experience design portfolio. Use these guidelines as a reference when generating UI, copy, components, or any design assets that should feel consistent with the brand.

---

## 1. Brand Identity

| Attribute        | Value                                            |
|------------------|--------------------------------------------------|
| **Studio Name**  | Scott UX Lab                                     |
| **Tagline**      | Experience Design Studio                         |
| **Positioning**  | Bold, minimal, future-forward UX design          |
| **Audience**     | Forward-thinking teams & startup/enterprise orgs |
| **Voice/Tone**   | Confident, technical, direct — no fluff          |
| **Symbol**       | ✦ (four-pointed star, used as a brand mark)      |

### Brand Personality
- Precision-focused and systematic
- Editorial and oversized — big type, bold statements
- Dark and premium, not playful or colorful
- Technical confidence: labels prefixed with `//` (code comment aesthetic)

---

## 2. Color Palette

### Core Colors

| Token Name        | Hex / Value               | Usage                                        |
|-------------------|---------------------------|----------------------------------------------|
| `--clr-bg`        | `#080808`                 | Page background (near-black, not pure black) |
| `--clr-bg-card`   | `#111111`                 | Card / elevated surface background           |
| `--clr-surface`   | `#161616`                 | Section surface (e.g. services, marquee)     |
| `--clr-white`     | `#ffffff`                 | Primary text, headings                       |
| `--clr-muted`     | `rgba(255,255,255, 0.45)` | Secondary text, labels, nav links            |
| `--clr-border`    | `rgba(255,255,255, 0.07)` | Subtle dividers, card borders                |
| `--clr-accent`    | `#e0ff00`                 | Primary accent — Neon Lime / Electric Yellow |
| `--clr-accent-dim`| `rgba(224,255,0, 0.12)`   | Accent glow/overlay, used sparingly          |

### Accent Color Philosophy
The single accent color `#e0ff00` (Neon Lime) is used with intention:
- **Sparingly** — only on CTAs, section tags, stat numbers, hover states, scroll indicators
- **Never** as a background fill on large areas
- On hover interactions: fills button backgrounds with accent, flips text to `#080808` (dark)
- Outline-style by default: `border: 1px solid #e0ff00; color: #e0ff00`

### Transparency Layers
- Ghost / watermark text: `color: transparent; -webkit-text-stroke: 1px rgba(255,255,255, 0.04)` — used for oversized background typography
- Logo text in "Trusted By" section: `rgba(255,255,255, 0.20)`, lifts to `#ffffff` on hover
- Nav scroll state: `rgba(8,8,8, 0.85)` + `backdrop-filter: blur(12px)`

---

## 3. Typography

### Typefaces

| Role          | Font Family          | Source          | Weights Used |
|---------------|----------------------|-----------------|--------------|
| **Display / Headings** | `Barlow Condensed` | Google Fonts | 700, 900 |
| **Body / UI**          | `Inter`            | Google Fonts | 300, 400, 500, 600 |

### Type Scale (Fluid / Responsive with `clamp()`)

| Token         | Value                              | Used For                             |
|---------------|------------------------------------|--------------------------------------|
| `--fs-hero`   | `clamp(5rem, 14vw, 16rem)`         | Hero headline (H1)                   |
| `--fs-h2`     | `clamp(3.5rem, 8vw, 10rem)`        | Section titles (About, Contact)      |
| `--fs-h3`     | `clamp(2rem, 4vw, 4rem)`           | Project / service card titles        |
| `--fs-body`   | `clamp(0.8rem, 1vw, 1rem)`         | General body copy                    |
| `--fs-tag`    | `0.7rem`                           | Labels, nav links, buttons, tags     |

### Type Style Rules

| Element             | Font       | Weight | Transform   | Tracking       | Notes                             |
|---------------------|------------|--------|-------------|----------------|-----------------------------------|
| Hero H1             | Barlow Cond| 900    | UPPERCASE   | `−0.03em`      | Line-height: 0.88 (very tight)    |
| Section H2          | Barlow Cond| 900    | UPPERCASE   | `−0.02em`      | Line-height: 0.9                  |
| Project/Service H3  | Barlow Cond| 900    | UPPERCASE   | `−0.02em`      | Line-height: 0.9                  |
| Section Tags        | Inter      | 500    | UPPERCASE   | `+0.15em`      | Color: accent `#e0ff00`           |
| Nav Links           | Inter      | 500    | UPPERCASE   | `+0.15em`      | Color: muted → white on hover     |
| Body Copy           | Inter      | 400    | Sentence    | `+0.1em`       | Color: muted, line-height: 1.9    |
| Logo / Wordmark     | Inter      | 600    | UPPERCASE   | `+0.18em`      | `✦ SCOTT UX LAB`                  |
| Buttons             | Inter      | 600    | UPPERCASE   | `+0.15em`      | With `//` prefix or `→` suffix    |

### Typographic Techniques
- **Outline text**: Key accent lines on hero use `color: transparent; -webkit-text-stroke: 2px #ffffff` (or `#e0ff00` on hover)
- **Oversized watermark text**: Giant `Barlow Condensed` text (30–25vw+) rendered as ghost strokes in the background — used on Hero, About, and Contact sections
- **Tight leading**: All display text uses line-height between 0.88–0.9 for dense, editorial stacking
- **Code comment prefix**: Labels and eyebrow text are written as `// LABEL TEXT` to reinforce the technical identity

---

## 4. Spacing & Layout

| Value          | Usage                                          |
|----------------|------------------------------------------------|
| `5vw`          | Horizontal page padding / gutter (consistent) |
| `8rem`         | Vertical section padding (standard)           |
| `12rem`        | Vertical padding for hero and contact         |
| `1.5px` / `1px`| Grid gaps between mosaic cards               |
| `4rem`         | Spacing below section headers                 |

### Grid System
- **Hero**: 2-column grid (`1fr 1fr`) — left: content, right: Spline 3D slot
- **Projects**: 2-column mosaic grid with a spanning "large" card (`grid-row: span 2`)
- **Services**: 2-column grid with `1px` gap (hairline dividers)
- **About**: 2-column layout (`1fr 1.4fr`) — left: portrait/avatar, right: text + stats

---

## 5. Component Patterns

### Buttons

```
Style: outline → filled on hover
Default:  border: 1px solid #e0ff00; color: #e0ff00; background: transparent
Hover:    background: #e0ff00; color: #080808
Padding:  0.85rem 2rem
Font:     Inter 600, 0.7rem, letter-spacing 0.15em, UPPERCASE
Label format: "ACTION TEXT →" or "// ACTION TEXT ↗"
```

### Section Tags / Eyebrows
```
Format: // LABEL TEXT
Font:   Inter 500, 0.7rem, letter-spacing 0.15em, UPPERCASE
Color:  #e0ff00 (accent)
```

### Cards (Project & Service)
```
Background:   #111111 (bg-card) or #161616 (surface)
Border:       1px solid rgba(255,255,255,0.07)
Hover border: rgba(255,255,255,0.20)
Service hover: animated bottom accent bar — 2px solid #e0ff00 expands left→right
No border-radius — sharp, editorial corners throughout
```

### Navigation
```
Default:    transparent background, no backdrop blur
Scrolled:   rgba(8,8,8,0.85) + backdrop-filter: blur(12px) + bottom hairline border
Logo:       Inter 600, 0.75rem, tracking 0.18em, UPPERCASE, white
Links:      Inter 500, 0.7rem, tracking 0.15em, UPPERCASE, muted → white hover
CTA button: outline style (accent color), fills on hover
```

### Custom Cursor
```
Shape:  10px circle (dot cursor)
Color:  #e0ff00 (accent)
The default OS cursor is hidden; replaced with the accent dot
```

### Scroll Indicator
```
A vertical line (1px wide, 60px tall) with a gradient:
  top: #e0ff00 → bottom: transparent
Animation: subtle pulse (scale + opacity) on 2s loop
Label: "SCROLL" in vertical writing mode (writing-mode: vertical-rl)
```

### Marquee / Ticker
```
Background: #161616 (surface)
Top/bottom: 1px hairline borders (rgba(255,255,255,0.07))
Font:       Barlow Condensed, 700, clamp(1rem, 2vw, 1.5rem), UPPERCASE, muted color
Separator:  ✦ in accent color #e0ff00
Content:    UX DESIGN · PRODUCT STRATEGY · INTERACTION DESIGN · DESIGN SYSTEMS · USER RESEARCH · PROTOTYPING
Animation:  Continuous left scroll, 24s linear loop
```

---

## 6. Motion & Animation

| Pattern              | Spec                                               |
|----------------------|----------------------------------------------------|
| **Easing**           | `cubic-bezier(0.22, 1, 0.36, 1)` — fast-out smooth (snappy deceleration) |
| **Scroll reveal**    | `opacity: 0 → 1`, `translateY(40px) → 0`, duration: 0.8s |
| **Stagger children** | 0.1s delay increment per child, 0.7s per item      |
| **Hover transitions**| 0.2s–0.4s, `ease-out` for color/border changes     |
| **Button fill**      | `background 0.3s ease-out` on hover               |
| **Service bar**      | `width: 0 → 100%` on `::before` pseudo, 0.4s      |

---

## 7. Iconography & Symbols

| Symbol | Usage                                      |
|--------|--------------------------------------------|
| `✦`    | Brand mark — appears in logo and marquee separators |
| `→`    | Inline directional arrows on links/buttons |
| `↗`    | External link indicators                   |
| `//`   | Prefix for section tags and eyebrow labels (code-comment aesthetic) |

---

## 8. 3D / Spline Integration Notes

The layout reserves explicit slots for Spline 3D models:
- **Hero**: Right half of the 2-column grid
- **Project cards**: Upper portion of each card
- **About portrait**: Left column portrait area

```
Container class: .spline-container
Swap placeholder <div> with:
  <script type="module" src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js"></script>
  <spline-viewer url="https://prod.spline.design/YOUR-SCENE-ID/scene.splinecode"></spline-viewer>

Default pointer-events: none (passthrough) — set to 'auto' for interactive 3D
```

3D scenes should match the dark aesthetic: dark background, neon-lime accent lighting preferred.

---

## 9. Do's and Don'ts

### ✅ Do
- Use all-caps for all display headings, nav items, tags, and buttons
- Keep corners **sharp** — zero border-radius on all interactive elements
- Prefix labels and eyebrow text with `//`
- Use `#e0ff00` only on interactive/highlight elements — never as a large block fill
- Keep body copy muted (`rgba(255,255,255,0.45)`)
- Use tight line-height (0.88–0.9) on all display type

### ❌ Don't
- Use rounded corners (border-radius)
- Use any color other than `#e0ff00` as an accent
- Use light backgrounds, white sections, or full-color photography
- Use decorative serif fonts — the brand is strictly sans-serif
- Write headline text in sentence case or mixed case
- Add drop shadows or soft glows (the aesthetic is flat, sharp, and editorial)
