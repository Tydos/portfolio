---
name: Prasad Jawale — Portfolio
description: Luxurious-minimal Cupertino portfolio for recruiter-first proof and photography.
colors:
  accent: "#0071e3"
  accent-hover: "#0077ed"
  accent-muted: "#147ce5"
  accent-light: "#e8f2fd"
  accent-subtle: "#f5f9fe"
  ink: "#1d1d1f"
  ink-muted: "#6e6e73"
  surface: "#f5f5f7"
  white: "#ffffff"
  border-soft: "#f1f5f9"
  border: "#e2e8f0"
  chip-bg: "#f1f5f9"
  chip-text: "#64748b"
typography:
  display:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 2.5rem
    letterSpacing: "-0.03em"
  title:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1rem
    letterSpacing: "0.02em"
rounded:
  sm: "4px"
  md: "12px"
  lg: "16px"
  xl: "1rem"
  media: "1.75rem"
  full: "9999px"
spacing:
  section-y: "4rem"
  section-y-md: "5rem"
  gutter: "1.5rem"
  stack-sm: "0.75rem"
  stack-md: "1.5rem"
  stack-lg: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "0.625rem 1.75rem"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0.625rem 1.25rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    rounded: "{rounded.full}"
    padding: "0.625rem 1.25rem"
  nav-pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1rem"
  nav-pill-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1rem"
  chip:
    backgroundColor: "{colors.chip-bg}"
    textColor: "{colors.chip-text}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.625rem"
    typography: "{typography.label}"
---

# Design System: Prasad Jawale — Portfolio

## Overview

**Creative North Star: "Cupertino Portfolio"**

A luxurious-minimal personal site in the Apple product-page tradition: white air, near-black type, one confident system blue, and pill controls that feel like soft hardware UI. Recruiter scanning is the primary job; photography is allowed to feel like a gallery without turning the rest of the site into chrome.

Density stays low. Sections breathe (`py-16` / `md:py-20`), hero type is large and tight-tracked, and decorative widgets never outrank proof (resume, projects, publication, photos). Motion is a single reveal grammar plus color transitions — never ornamental noise.

**Key Characteristics:**
- Geist Sans everywhere; no serif pairing
- Single accent blue on white / cool surface neutrals
- Pill CTAs and nav; rounded media frames for projects and photos
- Flat surfaces at rest; soft lift reserved for portrait, media, and lightbox
- Focus rings in accent; 44px minimum interactive height

## Colors

Cool product neutrals with one system-blue accent. Accent is scarce; ink carries hierarchy.

### Primary
- **System Link Blue** (`#0071e3`): Primary CTAs, active text links, focus outlines, timeline dots, selection highlight. Hover deepens to **System Link Blue Hover** (`#0077ed`). Soft tints (`#e8f2fd`, `#f5f9fe`) are for rare washes, not large fills.

### Neutral
- **Near-Black Ink** (`#1d1d1f`): Headings, primary body, active nav fill.
- **Soft Graphite** (`#6e6e73`): Supporting copy, meta, inactive nav.
- **Cool Paper Surface** (`#f5f5f7`): Tokenized surface; page body defaults to white.
- **Hairline Border** (`#f1f5f9` / `#e2e8f0`): Section rules and control strokes (`slate-100` / `slate-200`).
- **Chip Mist** (`#f1f5f9` bg / `#64748b` text): Skill and tech tags.

**The One Signal Rule.** System Link Blue is for action and focus — not large backgrounds, not decorative blocks, not competing with photography.

**The Ink Hierarchy Rule.** Near-Black Ink leads; Soft Graphite supports. Do not invent a third text color family on public pages.

## Typography

**Display Font:** Geist Sans (with `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Geist Sans (same stack)
**Label/Mono Font:** Geist Sans for labels; code blocks inherit monospace from highlight styles where needed

**Character:** Product-UI sans — precise, slightly luxurious through spacing and weight, never ornamental.

### Hierarchy
- **Display / Hero** (600, `clamp(2.75rem, 6vw, 5.5rem)`, 1.05, `-0.03em`): Name lockup on About.
- **Headline / Section** (600, `2.25rem` / `2.5rem` lh, `-0.03em`): Section titles via `SectionTitle`.
- **Title / Display-sm** (600, `clamp(1.5rem, 3vw, 2.25rem)`, 1.15): Secondary display moments.
- **Body** (400–500, `1rem`–`1.125rem`, relaxed): Proof copy; keep readable widths (`max-w-2xl` / `max-w-prose` where used).
- **Label / Nav** (500, `0.75rem`, `0.02em`): Compact nav wordmark treatment; chips use `text-xs` medium.

**The Single Family Rule.** Do not introduce a second display face. Hierarchy comes from size, weight, and tracking — not font mixing.

## Layout

Centered content columns: hero `max-w-4xl`, main sections `max-w-6xl`, project articles `max-w-3xl`. Horizontal gutter `px-6`. Vertical section rhythm `py-16` (`md:py-20`) with `scroll-mt-24` under the sticky nav. Hairline `border-slate-100` separates major bands. Home is a single scroll composition (About → Experience → Projects → Portfolio); project detail is a narrower reading column.

## Elevation & Depth

Hybrid: surfaces stay flat by default; depth appears on media and modal moments.

### Shadow Vocabulary
- **Portrait lift** (`shadow-lg` on the circular hero image): Identity media only.
- **Article media** (`shadow-sm` on detail images): Quiet separation from the page.
- **Lightbox stage** (`shadow-2xl` on the enlarged photo): Highest elevation; photo is the event.
- **Frosted chrome** (`bg-white/95 backdrop-blur-xl` on mobile nav; light blur overlays on loading project media): Atmosphere, not card stacking.

**The Flat-By-Default Rule.** No card shadows on resume blocks, project rows, or section containers. Borders and whitespace do the separating.

## Shapes

Pill geometry for interactive chrome; softer rectangles for media.

- **Full pill** (`9999px`): Primary/secondary/ghost buttons, nav pills, chips, social pills.
- **Media frame** (`1.75rem` / `rounded-2xl`): Project thumbnails, gallery tiles, lightbox image, hero media on detail.
- **Content soft** (`rounded-xl`): Code blocks, tables, secondary media.
- **Circle**: Portrait and icon/spinner affordances.

**The Pill Chrome Rule.** Interactive chrome prefers pills; content media prefers large rounded rectangles. Do not square off primary CTAs.

## Components

Pill-confident, restrained — soft hardware controls over loud marketing buttons.

### Buttons
- **Shape:** Full pill (`rounded-full`), min-height 44px
- **Primary:** Accent fill, white text, `px-7 py-2.5`; hover → accent-hover; focus-visible outline accent
- **Secondary:** White/transparent with `border-slate-200`, ink text; hover border → `slate-300`
- **Ghost / text:** Accent text, no fill; hover → accent-hover
- **Nav pill:** Inactive muted text + hover `slate-100`; active inverted ink fill + white text

### Chips
- **Style:** `bg-slate-100`, muted slate/ink text, `text-xs`, full pill, tight padding
- **State:** Static tags (skills, tech); not filter toggles on the main marketing surface

### Cards / Containers
- **Corner Style:** Project/gallery media use ~`1.75rem` / `rounded-2xl`; avoid boxed “card” chrome for resume content
- **Background:** White page; occasional `slate-100` media placeholders
- **Shadow Strategy:** See Elevation — flat content, lifted media
- **Border:** Hairline slate borders; timeline uses left rule + accent dot
- **Internal Padding:** Section gutters and stack spacing from the spacing scale

### Inputs / Fields
- **Style:** Minimal — often bottom-border only on portfolio upload fields (`border-b border-slate-200`)
- **Focus:** Border shifts to accent; outline focus-visible on controls
- **File control:** Soft bordered file button (`rounded-md`) — the rare non-pill control

### Navigation
- Sticky top bar, `max-w-6xl`, wordmark + pill links; scrolled state allowed to tighten presence
- Mobile: icon toggle, full-width sheet with frosted white blur
- Active section tracked by scroll position; 44px targets throughout

### Signature: Reveal
Scroll-enter fade/slide: opacity + `translateY(24px)` → rest, `0.7s cubic-bezier(0.16, 1, 0.3, 1)`. Disabled entirely under `prefers-reduced-motion`.

### Signature: Photography Gallery
Masonry/album tiles with rounded media, category text filters (underline/accent when active), lightbox with dimmed stage and large rounded image. Destructive admin affordances may use rose; keep them out of the public visual language.

## Do's and Don'ts

### Do:
- **Do** keep System Link Blue scarce and purposeful (CTAs, links, focus, small signals).
- **Do** use Geist Sans with the established hero/section/body scale.
- **Do** prefer pill controls and rounded media frames as implemented today.
- **Do** honor `prefers-reduced-motion` for reveal and hover motion utilities.
- **Do** maintain 44px minimum hit targets and accent focus-visible rings.

### Don't:
- **Don't** replace the Cupertino Portfolio world with a new palette, serif display, or dark-default marketing theme unless explicitly redesigning.
- **Don't** wrap resume/project content in heavy shadowed cards.
- **Don't** flood sections with accent fills, glow, or dashboard widgets that compete with proof and photos.
- **Don't** invent a second brand accent (emerald calendars, purple gradients, etc.) on public pages.
- **Don't** drop below accessible focus treatment or unnamed linked images.
