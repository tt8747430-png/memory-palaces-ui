---
name: Mindscape
description: Your Memory Palace — a calm, daylit memory-training app built on the method of loci.
colors:
  navy: "#091A7A"
  light-blue: "#ADC8FF"
  action-blue: "#4F8EFF"
  bright-blue: "#3D8FEF"
  chip-blue: "#EAF4FF"
  surface-sky: "#E8F2FF"
  gold: "#FFC71E"
  coral: "#FF4C4C"
  success: "#10B981"
  warning: "#F59E0B"
  error: "#EF4444"
  ink: "#2C2C2C"
  muted: "#8C8C8C"
  faint: "#AEAEAE"
  neutral: "#6B7280"
  divider: "#F2F2F2"
  light-gray: "#F3F4F6"
  white: "#FFFFFF"
typography:
  headline:
    fontFamily: "Lexend, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  title:
    fontFamily: "Lexend, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  subheading:
    fontFamily: "Lexend, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Lexend, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Lexend, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  tiny:
    fontFamily: "Lexend, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  small: "12px"
  standard: "20px"
  subject: "40px"
  pill: "50px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.small}"
    padding: "12px 20px"
  button-secondary:
    backgroundColor: "{colors.light-blue}"
    textColor: "{colors.navy}"
    rounded: "{rounded.small}"
    padding: "12px 20px"
  button-ghost:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    rounded: "{rounded.small}"
    padding: "12px 20px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.small}"
    padding: "12px 14px"
  chip-info:
    backgroundColor: "{colors.chip-blue}"
    textColor: "{colors.bright-blue}"
    rounded: "{rounded.small}"
    padding: "6px 10px"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "16px"
    padding: "16px"
---

# Design System: Mindscape

## 1. Overview

**Creative North Star: "The Lucid Atrium"**

Mindscape feels like a calm, daylit architectural interior: an airy room where blue sky meets glass, with clear depth and nothing crowding the view. The method of loci is about moving through remembered space, so the interface itself reads as space. White surfaces float on a soft blue-to-white gradient, glass elements catch light, and a single deep navy anchors every important action. It is unhurried and premium first, motivating second, credible underneath. The tone is a coach, not a cheerleader.

Density is deliberately low. This is a phone-first app used in focused short sessions, so every screen has one clear job and one primary action. Color does the work of hierarchy: deep navy for what matters, light blue and glass for atmosphere, generous white space for calm. Reward and delight are real but rationed, reserved for genuine milestones (a finished review, a kept streak, a completed palace) so they keep their meaning.

This system explicitly rejects the **corporate SaaS dashboard** (no dense data tables, gray enterprise chrome, or spreadsheet-density progress), the **cluttered/busy UI** (no competing CTAs, no information overload), and anything that reads **cheap or templated** (no stock gradients used as filler, no default-component look). Craft is the brand. It also avoids the childish-gamification trap: motivation here is premium and earned, never cartoon mascots and constant confetti.

**Key Characteristics:**
- Daylit, spatial, glass-and-sky atmosphere over a blue→white gradient ground.
- One deep navy carries identity; everything else is light blue, glass, and breathing room.
- One ritual per screen; calm comes from subtraction.
- Soft, navy-tinted ambient depth, never hard or heavy.
- Phone-first touch craft: 44px+ targets, `whileTap` press feedback, 60fps transform motion.

## 2. Colors

A daylit blue palette: one deep navy anchor, a wash of sky and glass blues, and a tightly rationed set of accents over near-white surfaces.

### Primary
- **Atrium Navy** (#091A7A): The single identity color. Primary buttons, active nav state, headings of consequence, progress fill, links, key icons. It is the only fully saturated dark in the system; its scarcity against all the light blue is what makes it read as authoritative.

### Secondary
- **Sky Blue** (#ADC8FF): The atmosphere color. The top of the main background gradient, glass tints, card image backdrops, secondary buttons. Carries the "daylit" feeling without competing with navy.
- **Action Blue** (#4F8EFF): The lively mid-blue. Gradient ends (paired navy→action-blue on progress bars and accents), ambient glow under the glass nav. The energetic, motivating note.
- **Bright Blue** (#3D8FEF): Information and meta. Time/stat chip text and icons. Slightly punchier than navy for small, repeated metadata so it stays legible at 12px.

### Tertiary
- **Reward Gold** (#FFC71E): Ratings and earned highlights (filled stars). The only warm color in the system; used sparingly as the "you earned this" note.
- **Heart Coral** (#FF4C4C): Favorites and affection (filled hearts). Distinct from the error red so "loved" never reads as "wrong."

### Neutral
- **Ink** (#2C2C2C): Primary reading text on white surfaces (card titles, body emphasis). Near-black, not pure black, for a softer daylit feel. Hits ~13:1 on white.
- **Muted** (#8C8C8C): Secondary text (descriptions, supporting copy on white). ~3.5:1 on white; acceptable for large/secondary text, NOT for small body. Watch this.
- **Faint** (#AEAEAE): Tertiary text only (rating counts, low-priority meta). Decorative weight; never primary information.
- **Chip Blue** (#EAF4FF): Pale-blue background for info chips and pills (time, stats).
- **Surface Sky** (#E8F2FF): The light end of card image gradients (paired with Sky Blue).
- **Divider** (#F2F2F2): Hairline separators and empty progress-track backgrounds.
- **White** (#FFFFFF): The primary content surface. Cards, sheets, inputs.

### Semantic
The base theme declares **Success** (#10B981), **Warning** (#F59E0B), **Error** (#EF4444), **Neutral** (#6B7280). These are the canonical status colors. Note: some cards currently use Reward Gold (#FFC71E) and Heart Coral (#FF4C4C) where a semantic warning/error might be expected; gold/coral are *accent* roles (rating, favorite), not status. Keep status and accent separated.

### Named Rules
**The One Navy Rule.** Atrium Navy is the only saturated dark in the system, and it appears on a minority of any screen: the primary action, the active state, the numbers that matter. Its rarity against all the light blue is the entire point. Never tint large surfaces navy in light mode; navy is ink and action, not background.

**The Daylight Rule.** Backgrounds run light blue at the top to white below, like a lit room. The ground is never flat gray and never a warm cream/sand neutral. Atmosphere is carried by blue light, not by tinting neutrals warm.

## 3. Typography

**Body & Display Font:** Lexend (with `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
**Label/UI Font:** Lexend (same family, lighter weights)

**Character:** One humanist sans, tuned across weights, carries everything: headings, buttons, labels, body, data. Lexend was designed for reading proficiency, which suits a memory-training app: legible, calm, unfussy, friendly without being cute. No second display face competes with it. (See Don'ts about the leftover Geist family.)

### Hierarchy
A fixed px scale (no fluid clamp; this is product UI viewed at consistent phone DPI) with a tight ~1.25 ratio, leaning on weight more than size for contrast.
- **Headline** (600, 20px, 1.4): Screen titles and featured card names. The ceiling; there is no oversized display type in this app.
- **Title** (600, 16px, 1.4): Section headers within a screen.
- **Subheading** (500, 14px, 1.4): Card titles, grouped-list headers, emphasized labels.
- **Body** (400, 14px, 1.5): Descriptions and reading copy. Cap prose at 65–75ch.
- **Label** (400, 12px, 1.4): Form labels, chip text, secondary meta.
- **Tiny** (500, 10px, 1.4): Nav labels and the smallest meta. Never used for anything a user must read to act.

### Named Rules
**The One Family Rule.** Lexend does every job. Weight and size create hierarchy; a second typeface does not. If a screen needs more emphasis, go heavier or larger in Lexend, never reach for another font.

## 4. Elevation

Depth is **soft ambient navy glow**, not hard shadow and not flat. White cards and glass elements lift off the blue gradient on low, wide, navy-tinted shadows, as if lit from above in a bright room. Nothing has a crisp black drop shadow; the tint always carries the navy hue so shadow reads as atmosphere, not as a cutout. The liquid-glass bottom nav is the one element allowed to float dramatically, with an ambient navy/action-blue glow beneath it.

### Shadow Vocabulary
- **Card rest** (`box-shadow: 0px 6px 16px rgba(19,44,74,0.06)`): Default lift for white cards on the gradient. Barely-there, calm.
- **Card featured** (`box-shadow: 0px 10px 28px rgba(19,44,74,0.08)`): Slightly more lift for hero/featured cards.
- **Interactive** (`box-shadow: 0 8px 25px rgba(9,26,122,0.20)`): Pressed/active or floating interactive surfaces.
- **Elevated** (`box-shadow: 0 20px 40px rgba(9,26,122,0.25)`): Modals, sheets, and the glass nav's ambient field.

### Named Rules
**The Navy-Tint Rule.** Every shadow is tinted navy (rgba around 9,26,122 / 19,44,74), never neutral black. A black shadow on this blue ground reads as a 2014 app: if a card looks stamped-out rather than lit, the shadow lost its tint or its blur got too small.

## 5. Components

### Buttons
- **Shape:** Gently rounded (`rounded-lg`, ~12px from the small radius token). Pills (50px) are reserved for chips/tags, not standard buttons.
- **Primary:** Atrium Navy background, white text, medium weight. The single primary action per screen.
- **Secondary:** Sky Blue background, navy text. Supporting actions.
- **Ghost / Outline:** White or transparent with navy text and a hairline border; for low-emphasis actions.
- **Destructive:** Tinted, not solid: error red at low opacity background with red text, never a full-saturation red block.
- **Press / Focus:** `whileTap={{ scale: 0.95 }}` for tactile press (mobile-first; touch feedback over hover). Focus-visible shows a navy ring (3px ring at ring/50). Min touch target 44×44px.

### Chips
- **Style:** Pale Chip Blue (#EAF4FF) background, Bright Blue (#3D8FEF) text and icon, ~12px radius. Used for time, room counts, and stats.
- **State:** Informational by default. Filter/selectable chips invert to navy fill + white text when active.

### Cards / Containers
- **Corner Style:** 16px (`rounded-2xl`) standard, 24px (`rounded-3xl`) for featured. These are the lived-in radii; the 20px standard token also appears. Stay in the 12–24px band.
- **Background:** White content surface. Image/media zones use a Sky Blue → Surface Sky gradient (`#ADC8FF → #E8F2FF`).
- **Shadow Strategy:** Card rest at default; Card featured for heroes. See Elevation. Soft navy tint, never black.
- **Border:** Generally none; the soft shadow and white-on-blue contrast do the separating. Internal dividers use the #F2F2F2 hairline.
- **Internal Padding:** 16px (`md`) standard, 20px for featured.
- **Press:** `whileTap={{ scale: 0.98 }}`. Progress bars inside cards fill navy→action-blue with an ease-out width animation.

### Inputs / Fields
- **Style:** White or transparent background, hairline border, ~12px radius, 14–16px text. Comfortable, touch-friendly height (≥44px tap area).
- **Focus:** Border shifts to the navy ring and a 3px soft ring appears (no harsh outline).
- **Error / Disabled:** Error shows a red border + red ring at low opacity; disabled drops to ~50% opacity with a faint fill. Placeholder text must meet 4.5:1 (do not leave it at the default faint gray).

### Navigation — Liquid Glass Bottom Nav
The signature component. A fixed, floating, rounded-[40px] glass bar with three tabs (Home, Palaces, Profile). A frosted navy-gradient body (`backdrop-blur`) sits over an ambient navy/action-blue glow. The active tab is marked by a spring-animated white pill (rounded-[24px]) that slides between items, with the active icon/label flipping to navy and inactive items white at ~70% opacity. Active state is also reinforced by a small navy dot, so it never relies on color alone. Press feedback is `whileTap={{ scale: 0.92 }}`.

### Shared primitives (`src/app/components/ui/`)

These exist so common patterns stop being re-derived inline. Reach for them before hand-rolling.

- **`ScreenHeader`** — the frosted compact top bar (safe-area spacer + back button + truncating title + optional right `actions`). Pass `style` from `useCollapsibleHeader` for the parallax-collapse variant on hero screens, or use the default static bar (`fixed={false}` for in-flow) on sub-screens.
- **`IconButton`** — circular icon-only button. Variants `glass` (floating white on the gradient), `tint` (pale-blue on white), `solid` (navy), `ghost` (translucent white over dark). Sizes `sm`/`md`/`lg`; `md`+ clear the 44px target. Requires `aria-label`.
- **`GlassCard`** — frosted card. `tone="sky"` is the blue gradient glass for hero/stat cards; `tone="card"` is the lighter `.bg-card-glass` panel.
- **`Chip`** — compact info/status pill. Tones `info`/`neutral`/`navy`/`amber`/`emerald`/`gold`, each picked to clear AA contrast at 11–12px (do **not** use bright `#3D8FEF` text on `#EAF4FF`, which fails). `SrsStatusChip` (in `cards/`) maps a card's spaced-repetition status to a Chip.
- **`Avatar`** — photo with a navy-gradient initials fallback; size/shape via `className`. Pair with `useProfile`'s `initials`.
- **`GradeButtons`** (`cards/`) — the shared Again / Hard / Good / Easy rating row with per-grade interval previews, used by both the daily review and per-room flashcards.

### Motion vocabulary (`src/app/utils/motion.ts`)

Standardized press scales and curves so feedback is consistent: `tap` (0.97, default), `tapSmall` (0.94, icons/chips), `tapCard` (0.98, large surfaces), `tapNav` (0.92, nav). Easings `easeOutQuart` / `easeOutExpo`; springs `springSnappy` / `springGentle`. Spread onto a `motion` element (`<motion.button {...tap}>`).

## 6. Do's and Don'ts

### Do:
- **Do** anchor every screen with one Atrium Navy (#091A7A) primary action and keep navy a minority of the surface (The One Navy Rule).
- **Do** ground screens in the blue→white daylight gradient; carry warmth and energy through accent and motion, never through a tinted neutral background (The Daylight Rule).
- **Do** tint every shadow navy (rgba ~9,26,122 / 19,44,74) and keep it low and wide (The Navy-Tint Rule).
- **Do** use one family, Lexend, across all roles; build hierarchy with weight and size (The One Family Rule).
- **Do** ration delight: animate genuine milestones (review done, streak kept, palace finished), not every tap.
- **Do** keep cards in the 12–24px radius band, white surface, soft navy shadow, 16px padding.
- **Do** give every interactive element a real touch state (`whileTap` press, 44×44px min target) and a visible focus ring.
- **Do** convey status with icon/shape plus color, never color alone (streaks, success/error, progress).

### Don't:
- **Don't** build a **corporate SaaS dashboard**: no dense data tables, gray enterprise chrome, or spreadsheet-density progress. Show progress with warmth and meaning.
- **Don't** ship a **cluttered/busy UI**: no competing CTAs, no information overload, no cramped layouts. One ritual per screen.
- **Don't** let anything read **cheap or templated**: no stock filler gradients, no default-component look, no low-effort surfaces.
- **Don't** fall into childish gamification: no cartoon mascots, no constant confetti, no loud reward spam. Motivation stays premium and earned.
- **Don't** use a black (untinted) drop shadow on the blue ground; it reads as a dated app.
- **Don't** tint large light-mode surfaces navy; navy is ink and action, not background.
- **Don't** use Muted (#8C8C8C) or Faint (#AEAEAE) for small body text or placeholders on white; bump toward Ink to clear 4.5:1.
- **Don't** introduce a second typeface. The leftover **Geist Variable** in `tailwind.css` (`--font-sans`) conflicts with the live Lexend body font; resolve to one family (Lexend) rather than letting both ship.
- **Don't** over-round: cards top out near 24px. Reserve the 40/50px radii for the glass nav and pills, not content cards.
