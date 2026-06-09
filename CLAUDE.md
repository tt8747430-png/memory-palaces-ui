# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Mindscape** ("Your Memory Palace") — a phone-first memory-training web app built on the method of loci. It's a client-only React SPA: there is no backend, no router, and no test suite. All state persists to `localStorage`.

Read `PRODUCT.md` (product purpose, brand voice, accessibility targets) and `DESIGN.md` (full design system: colors, typography, components) before doing UI/UX work. They are the source of truth for craft decisions.

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # Production build (vite build — note: does NOT run tsc, no type-check step)
```

There is no lint, test, or typecheck script. To type-check manually, run `npx tsc --noEmit` (tsconfig has `noEmit`, strict mode, and `noUnusedLocals`/`noUnusedParameters` on).

## Stack

- **Vite 6** + **React 18** + **TypeScript** (strict). No SSR/RSC (`rsc: false`).
- **Tailwind CSS v4** via `@tailwindcss/vite` — configured entirely in CSS (`@theme`, `@custom-variant`), there is no `tailwind.config.js`.
- **shadcn** (style `base-nova`, base color `neutral`) with **@base-ui/react** as the primitive layer (not Radix). Icons from **lucide-react**.
- **motion** (Framer Motion's successor, imported from `motion/react`) for all animation.
- **react-hook-form** + **zod** for forms; **sonner** for toasts; **vaul** for drawers; **cmdk** for command/search; **lenis** for smooth scroll; **@rive-app/react-canvas** for Rive animations.
- Path alias: `@/` → `src/` (set in both `vite.config.ts` and `tsconfig.json`).

## Architecture

### Navigation is a state machine, not a router

There is no routing library. Navigation is plain React state:

- `src/app/App.tsx` is the top-level state machine for the auth/onboarding flow: `opening → login/signup → success → home`, gated by an `isAuthenticated` flag read from `localStorage`.
- `src/app/components/HomePage.tsx` is the main authenticated shell and a second state machine. It switches between tabs (`home`/`palaces`/`profile`) via `activeTab` state driving `renderTabContent()`, and overlays full-screen flows (palace detail, room training, quiz, create/edit palace, settings) via boolean/`selectedId` state. The `LiquidGlassBottomNav` calls `setActiveTab`. When adding a screen, wire it into this state rather than reaching for a router.

### State & persistence

- **`useProgressState`** (`src/app/hooks/`) is the central app store — it owns palaces, XP, level, streak, training days, and notifications. It defines the core domain types (`Palace`, `Floor`, `Room`, `ProgressState`). Components receive `state` and `actions` props from `HomePage`; mutations flow back up through callbacks.
- It emits `ProgressEvent`s (`xp-gain`, `level-up`, `streak`, `room-complete`, `palace-complete`) which `HomePage.handleProgressEvent` turns into toast/notification UI and save indicators.
- **`useLocalStorage`** is the persistence primitive (JSON serialize + cross-tab `storage` event sync). Build new persisted state on top of it rather than touching `localStorage` directly.
- Other hooks: `useSaveStatus` (save indicator + level math), `useNotifications`, `useProgressState`. Util `progressUtils.ts` holds progress calculations.

### Component organization (`src/app/components/`)

- Top-level files are full screens/pages (e.g. `HomePage`, `PalacesPage`, `ProfilePage`, `LoginScreen`).
- Feature subfolders group related screens: `palace/`, `quiz/`, `progress/`, `settings/`, `auth/`, `cards/`, `search/`, `notifications/`, `3d-icons/`.
- `ui/` holds shadcn/base-ui primitives and shared wrappers (`button`, `dialog`, `select`, `StatusBar`, `RiveAnimation`, `SmoothScrollProvider`, etc.). `ui/utils.ts` and `utils/utils.ts` both export `cn` (clsx + tailwind-merge).
- Providers are mounted once in `src/main.tsx`: `MotionConfig reducedMotion="user"`, `TooltipProvider`, `SmoothScrollProvider`, `Toaster`.

### Styling system

CSS entry is `src/styles/index.css`, which imports in order: `fonts.css` → `tailwind.css` → `theme.css`.

- `theme.css` defines the design tokens as CSS custom properties (colors, shadows, radii, typography sizes) and maps them onto shadcn's Tailwind variables (`--primary`, `--card`, etc.).
- **Gotcha — named text utilities bake in color.** `theme.css` defines `.text-main-heading`, `.text-section-header`, `.text-subheading`, `.text-body`, `.text-small`, `.text-tiny` under `@layer utilities`, and each hard-codes a `color`. Because they set color, they **override** a Tailwind `text-[#...]` class on the same element. To recolor such an element, override the color via inline style or a higher-specificity rule, or don't use the named utility. `.text-small`/`.text-tiny` bake a `#4b5563` gray that can fail WCAG contrast on the light-blue gradient — watch this for accessibility.
- The "One Family Rule": Lexend everywhere. `font-sans` is remapped to Lexend so shadcn components match.

### Design & craft constraints (from PRODUCT.md / DESIGN.md)

- Phone-first, touch-first: 44px+ targets, `whileTap` press feedback (not hover states), 60fps transform-based motion. One primary action per screen.
- Honor `prefers-reduced-motion` — already wired globally via `MotionConfig reducedMotion="user"`, but new bespoke animations still need a sensible reduced fallback.
- One deep navy (`#091A7A`) carries identity; light blue + glass for atmosphere. Avoid dense/dashboard layouts and cartoonish gamification.

## Tooling notes

- `.impeccable/` holds critique/design artifacts from the "impeccable" review tooling (see the `chore: impeccable …` commits). `docs/ai_docs/` contains agent role/generation prompts. These are workflow scaffolding, not app code.
