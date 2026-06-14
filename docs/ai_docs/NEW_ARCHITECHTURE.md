# Plan: New Architecture for Mindscape (React + Vite **PWA**, MVVM)

## Context

Mindscape ("Your Memory Palace") is a phone-first method-of-loci training app — today a polished but structurally weak React 18 + Vite web SPA wrapped in Capacitor (~26k LOC, 133 files). The review found:

- **God hook** `useProgressState.ts` (1444 lines): all domain state + ~50 actions + event emission, fused to React + `localStorage`.
- **God components**: `RoomContentEditor` (1794), `RoomTrainingScreen` (1773), `PalaceDetailScreen` (1158), `PalacesPage` (1016), `VerseStudyScreen` (902) mixing logic, UI state, modals, gestures.
- **No router** — two nested `useState` state machines; deep prop-drilling (HomeFeed = 27 props).
- **No layering** — pure domain logic trapped in `utils/`; scattered direct `localStorage` access; no central types; duplicated `cn()`.
- **No tests, no typecheck/lint scripts.**

**Goal:** a clean, layered, **MVVM-inspired** architecture with explicit design patterns + SOLID/DRY, a **testable framework-agnostic core**, delivered as an **offline-first PWA** (installed from the browser — *no app stores*), with a local database that is **always kept in sync with the cloud**, and a first-class **AI Tutor** built last.

### Confirmed decisions
| Decision | Choice |
|---|---|
| **Delivery** | **PWA** — installable from the browser ("Add to Home Screen"), instant updates, **no App Store / Play Store** |
| **Framework** | **React (19) + Vite** + `vite-plugin-pwa` (Workbox service worker) — best-fit tool for a web-primary PWA |
| **State / ViewModel** | **Zustand** (slices pattern) |
| **Local database** | **RxDB over IndexedDB** — the on-device source of truth (offline-first, reactive) |
| **Cloud** | **Supabase** — Auth, Postgres (replication target), Storage, Edge Function (Claude proxy) |
| **Sync** | **RxDB ↔ Supabase replication**, *always in sync*: continuous while active + **flush on app-leave** (`visibilitychange`/`pagehide`) + Service-Worker **Background Sync** for offline-close |
| **Migration strategy** | **Big-bang rewrite** (structured, dependency-ordered) — old app is the reference spec |
| **AI Tutor** | **In scope**, built in the **final phase** on the command layer, via a Supabase Edge Function |
| **Native later?** | Not now (no stores). Kept cheap: the Model+ViewModel core is framework-agnostic, so a future Expo/RN app could reuse it. |

### Cross-cutting principles (user-directed)
- **Design-first:** before any UI, extract the full design system (colors, typography, spacing, radii, shadows, motion, component inventory, a11y targets) from `PRODUCT.md`, `DESIGN.md`, and the existing app via the **impeccable** skill (`/impeccable extract`). UI work cannot start until it exists.
- **Mobile-first & responsive:** design at the smallest phone width first; scale up with breakpoints. Respect safe-area insets, accessible font scaling, ≥44px touch targets.
- **Theme-ready color, dark theme later:** components use **only semantic color tokens** (CSS variables), never raw hex. Dark theme = a second mapping of the same roles — a token remap, not a rewrite. Light ships first; dark is its own late phase.
- **Offline-first / local-first:** the app must be fully usable offline; the network is never in the path of a card review. Cloud is additive, behind interfaces.
- **AI Tutor is the final phase.**

---

## Target architecture (MVVM mapping)

| MVVM concept (C#) | Our realization |
|---|---|
| **Model** (entities + domain services) | `src/domain/` — pure TypeScript, **zero** React/IO imports |
| **Repository / persistence** | `src/data/` — interfaces + RxDB(IndexedDB) impl + in-memory test double |
| **ViewModel** (INotifyPropertyChanged) | `src/stores/` — Zustand slices + per-screen VM hooks in `src/viewmodels/` |
| **View** (XAML) | `src/routes/` (router pages) + `src/features/` + `src/ui/` (Tailwind) |
| **Data binding** | Zustand selectors + RxDB reactive queries |
| **Commands (ICommand)** | `src/domain/commands/` — one registry the UI **and** the AI Tutor both invoke |
| **DI container** | `src/app/composition.ts` — composition root wires concretes into abstractions |
| **Cloud (behind interfaces)** | `src/data/supabase/` + `src/data/sync/` — Auth, replication, Storage, Edge Function |

### Folder structure (Vite, `src/`-based)

```
src/
  app/                            # app shell: providers, router mount, composition root, PWA registration
    composition.ts                # DI: build singletons (repos, services, eventbus, sync, auth) and inject
  routes/                         # VIEW entry — TanStack Router pages (typed, client-side)
    (auth)/ · (tabs)/ · palace.$id · room.$id.* · quiz.$id · review · settings/* · tutor
  domain/                         # MODEL — pure, platform-agnostic, fully unit-tested
    models/                       # Palace, Room, Locus, Question, Folder, ProgressState + factories + clone()
    services/                     # SrsService, StreakService, ProgressService, RoomService,
                                  #   StatsService, DueCardsService, VerseService, QuizService
    commands/                     # command registry + types (intents shared by UI + tutor)
    events/                       # EventBus (Observer) + ProgressEvent types
  data/                           # PERSISTENCE — Repository pattern
    repositories/                 # interfaces: PalaceRepository, PreferencesRepository, ProfileRepository...
    rxdb/                         # RxDB schema + collections (IndexedDB) — SOURCE OF TRUTH
    memory/                       # in-memory test doubles
    transfer/                     # import/export strategies: anki, csv, json
    auth/                         # AuthProvider interface (local impl → Supabase impl)
    supabase/                     # Supabase client, Auth, Storage, Edge Function calls
    sync/                         # RxDB↔Supabase replication + flush-on-leave + Background Sync glue
  stores/                         # VIEWMODEL — Zustand slices (progress, preferences, profile, session, tutor)
  viewmodels/                     # per-screen hooks composing stores + services (e.g. useStudySession)
  ai/                             # AI Tutor: chat orchestration, tool schema, permission proxy (calls Edge Fn)
  ui/                             # shared primitives (shadcn-style, Base UI + Tailwind): Button, GlassCard, Chip, ScreenHeader...
  features/                       # VIEW components grouped by feature (palaces/, training/, quiz/, progress/...)
  theme/                          # design tokens (CSS variables) + light/dark maps + responsive/a11y helpers
  lib/                            # cross-cutting: haptics, sound, speech (web), clock, logger
public/ + vite.config (PWA)       # manifest, icons, service worker (vite-plugin-pwa / Workbox)
supabase/                         # SQL migrations, RLS policies, edge functions (claude-proxy)
```

### Technology mapping (current → target)
| Concern | Today | Target (React + Vite PWA) |
|---|---|---|
| Delivery | Capacitor (native wrapper) | **PWA** (`vite-plugin-pwa`: SW, manifest, installable, offline) — **drop Capacitor** |
| Framework | React 18 + Vite | **React 19 + Vite** |
| Navigation | App/HomePage state machines | **TanStack Router** (typed, client-side; React Router as alt) |
| State/VM | `useProgressState` god-hook | **Zustand** slices + VM hooks |
| Local DB | `localStorage` blob | **RxDB over IndexedDB** (reactive, offline-first) |
| Cloud sync | none | **RxDB ↔ Supabase replication** (always-synced) |
| Auth | mock flag | **Supabase Auth**, behind an `AuthProvider` interface |
| Images | inline data URLs | **Supabase Storage** |
| LLM (tutor) | none | **Supabase Edge Function** holds the Claude key (app never sees it) |
| Styling/theme | Tailwind v4 (web) | **Tailwind v4 + CSS-variable semantic tokens** (light/dark) |
| UI components | shadcn + @base-ui/react | **shadcn pattern (own-your-code) + Base UI v1.3 primitives** (headless, accessible) — *not* a pre-styled kit |
| Icons | lucide-react | **keep** |
| Overlays | sonner / vaul / cmdk | **keep** (toasts / mobile sheets / command palette) |
| Animation | `motion` (Framer) | **keep** (`motion`) |
| Gestures | `@use-gesture/react` | **keep** |
| Glass/blur | CSS `backdrop-filter` | **keep** (full DOM/CSS control) |
| Anki import | `sql.js` + `fflate` | **keep** (both run on web) |
| Forms | react-hook-form + zod | **keep** |
| Tests | none | **Vitest + React Testing Library**; **Playwright** for E2E/PWA |

### Persistence, cloud & "always in sync"

- **RxDB (IndexedDB) is the single source of truth on device.** All palaces/rooms/loci/questions/SRS/progress live locally; reads/writes are instant and fully offline. RxDB's reactive queries feed the stores (Observer).
- **Supabase is the cloud, behind the repository/sync interfaces** (never the primary store):
  - **Auth** — real accounts via Supabase Auth (replaces the mock flag); dev/tests use a local `AuthProvider`.
  - **Replication** — RxDB's replication protocol keeps each collection in sync with Supabase Postgres; per-document revisions handle conflicts.
  - **Storage** — palace cover images move to Supabase Storage.
  - **AI-tutor proxy** — a Supabase **Edge Function** holds the Claude key; the app calls the function, never the LLM directly.
- **"Always in sync when the user leaves"** is concrete and reliable:
  1. **Continuous/live replication** while the app is active (debounced pushes on change).
  2. **Flush on leave** — on `visibilitychange → hidden` and `pagehide`, force a final push of pending changes.
  3. **Background Sync** — the service worker registers a Background Sync tag (Workbox `BackgroundSyncPlugin`) so a change made/queued while offline still reaches Supabase after the tab closes and connectivity returns.
- **Dependency Inversion guarantee:** domain/services/stores/views depend only on repository + provider *interfaces*, so RxDB and the entire Supabase cloud layer are swappable and additive — they touch no feature code.

### PWA specifics
- `vite-plugin-pwa` runs **Workbox** (the current standard SW engine — supersedes the older `sw-precache`/`sw-toolbox`): precache the app shell, runtime-cache Supabase Storage images, offline fallback, auto-update with an in-app "update available" prompt.
- Web App Manifest (name, icons, `display: standalone`, theme color, maskable icons) → installable on iOS/Android home screens. Generate icons/splash + manifest entries with **PWA Asset Generator**.
- iOS PWA caveats handled (safe-area, status-bar style, no install banner → custom A2HS hint).

### Design system & theming (color architecture)

Driven by the Phase-0 extraction and a **two-layer token model** built for theming from day one:
- **Layer 1 — primitive palette** (`src/theme/palette.ts`): raw values (`navy-900 #091A7A`, light-blue scale, glass, neutrals, status hues).
- **Layer 2 — semantic roles** (`src/theme/themes.ts`): `bg`, `surface`, `surface-glass`, `border`, `text-primary/secondary/muted`, `primary`, `on-primary`, `accent`, `success`, `warning`, `danger` — exposed as **CSS variables**, mapped to Tailwind utilities.
- **Rule:** components use **only semantic tokens** (`bg-surface text-text-primary`), never raw hex. DRY single source of truth for color.
- **Dark = a second semantic→primitive map** toggled via `data-theme` (and `prefers-color-scheme`); no component edits. WCAG 2.1 AA contrast verified in **each** theme (fixes the current muted-gray-on-blue failures).
- Responsive scales are mobile-first; safe-area + accessible font scaling are first-class.

---

## Design patterns in use (mapped to layers)

**Strong-fit (architectural backbone):**
- **Facade** → `services/` and `commands/` present one method over multi-step subsystems (`ProgressService.completeRoom` = unlock next → recompute stats → add XP → emit event → persist). Repository is a facade over RxDB.
- **Observer** → Zustand subscriptions + RxDB reactive queries (data-binding) **and** the `EventBus` for `ProgressEvent`s; the sync **flush-on-leave** is an observer on visibility events.
- **Mediator** → command bus + stores decouple features (cures the `HomePage` accidental-mediator prop-drilling).
- **Proxy** → the **AI Tutor permission gate** (protection proxy intercepting every tutor command for user confirmation); lazy-load proxy for Anki import.
- **Factory** → entity factories (`createPalace/Room/Locus` with id + defaults) and the **repository factory** (RxDB | in-memory).
- **State** → typed discriminated-union machines for SRS lifecycle, study session, quiz flow, tutor turn.

**Situational:** **Adapter** (RxDB↔Supabase replication, import/export formats) · **Strategy** (anki/csv/json transfer) · **Singleton** (services/repos/EventBus/sync as composition-root module singletons, injected) · **Prototype** (`clone()` for duplicate palace/room/locus/question) · **Builder** (create-palace flow, LLM-request assembly).

**Use the language, don't formalize:** **Iterator** (native `for…of`/generators; at most a study-session cursor).

## SOLID + DRY
- **S** — split the god-hook into one-concern services; split god components into View + VM hook + subcomponents.
- **O** — add storage backends, transfer formats, and tutor commands behind interfaces/registries without editing callers.
- **L** — in-memory repo is a drop-in for the RxDB repo (fast unit tests).
- **I** — narrow repos + screen VM hooks expose only what a screen needs (selectors).
- **D** — domain/stores depend on interfaces, never on RxDB/Supabase directly; composition root injects concretes (this is what makes the core portable + testable).
- **DRY** — one command per mutation (reused by UI *and* tutor); domain logic only in `services/`; tokens only in `theme/`; consolidate the duplicated `cn()`. Balance: don't dedupe coincidental similarity (role.md "avoid premature abstraction").

---

## Phased, vertically-sliced task plan

Each feature slice spans **all layers** (model → repo → store → command → view) and leaves the app runnable. Every task has acceptance criteria + verification. Verify with: `npx tsc --noEmit`, `npm test` (Vitest), `npm run build` (vite), Lighthouse PWA audit, and the app in a browser (Playwright for E2E). Detailed decomposition for later phases is finalized at each phase's opening checkpoint.

> **Order reflects user direction:** design extraction **first**; cloud/sync as a dedicated phase; **dark theme** after the app is otherwise complete; **AI Tutor is the very last phase**.

### Phase 0 — Design system extraction (no app code)
- **T0.1** Run **impeccable** (`/impeccable extract`) on `PRODUCT.md`, `DESIGN.md`, and the existing app → full design system. *AC:* `docs/ai_docs/DESIGN_SYSTEM.md` + tokens spec exist and cover every category. *Verify:* reviewed.
- **T0.2** Author the two-layer token model (primitives + semantic roles) with **light** mappings + **dark** placeholders; document WCAG AA contrast per pairing. *AC:* no raw hex left for components to reference. *Verify:* contrast checks documented.
- **Checkpoint 0:** design system + tokens approved before any UI.

### Phase 1 — Foundation / walking skeleton
- **T1.1** Scaffold **Vite + React 19 + TS (strict)**; add **TanStack Router**, **Tailwind v4**, **vite-plugin-pwa** (manifest + SW), **Vitest + RTL**, ESLint/Prettier; `dev/build/test/typecheck/lint` scripts. *AC:* installable PWA shell boots; scripts pass. *Verify:* Lighthouse flags it installable.
- **T1.2** Implement the **theme system** — `src/theme/` CSS-variable tokens + light map (dark stubbed) + `ThemeProvider`; mobile-first responsive + safe-area + reduced-motion helpers. *AC:* sample screen styled only with semantic tokens; theme map swappable. *Verify:* swap re-themes the sample.
- **T1.3** **Composition root + EventBus + Repository/Store skeletons** — interfaces + in-memory repo + empty Zustand stores wired via `composition.ts`. *AC:* a store reads/writes through an injected in-memory repo. *Verify:* unit test proves DI swap.
- **T1.4** **Walking skeleton** — session store + `AuthProvider` interface (local dev impl; Supabase in Phase 9) + auth gate + empty Home route from a store. *AC:* one end-to-end path. *Verify:* runs in browser.
- **Checkpoint 1:** installable PWA boots; typecheck/lint/tests green; DI + theming live.

### Phase 2 — Portable domain core (framework-free, fully tested)
- **T2.1** Models + factories + `clone()` (`Palace/Room/Locus/Question/Folder/ProgressState`). *AC:* pure module, no React imports; unit-tested.
- **T2.2** Services (`SrsService` SM-2, `StreakService`, `StatsService`, `DueCardsService`, `VerseService`, `RoomService`, `ProgressService`, `QuizService`) as Facades over models+repo. *AC:* each unit-tested with the in-memory repo; deterministic via injected `clock`.
- **Checkpoint 2:** domain core has high coverage and zero UI deps — the MVVM payoff proven.

### Phase 3 — Palaces slice (proves the full stack + real local persistence)
- **T3.1** **RxDB local persistence** — RxDB schema/collections (IndexedDB) implementing the repositories; this becomes the source of truth. *AC:* repo passes the same contract tests as the in-memory repo (Liskov); data persists across reload.
- **T3.2** Progress store slices (palaces/folders) over `ProgressService`; selectors + RxDB reactive binding. *AC:* store tests pass.
- **T3.3** Palaces commands (`create/update/delete/duplicate/toggleFavorite/...`) in the registry (Mediator/Facade). *AC:* commands invoke services; tested.
- **T3.4** Palaces View — list + create/edit/delete using `ui/` primitives (semantic tokens) + `motion`. *AC:* full CRUD persists across reload; responsive small→large. *Verify:* browser flow + Playwright.
- **Checkpoint 3:** one feature fully vertical (model→RxDB→store→command→view) + offline persistence — the template for all slices.

### Phases 4–8 — Remaining feature slices (same vertical pattern; decompose at each checkpoint)
- **Phase 4 — Palace detail + rooms CRUD** (journey map, swipe-to-reveal via `@use-gesture`).
- **Phase 5 — Room content** (loci + questions editor) + **import/export** strategies (anki/csv/json) — break up the 1794-line editor into View + VM hook + subcomponents.
- **Phase 6 — Training** (flashcards + SRS review) + **Daily Review** — extract `useStudySession` VM (State machine + SRS), break up the 1773-line screen.
- **Phase 7 — Quiz + Match + Verse study** (State machines).
- **Phase 8 — Progress/XP/streak/stats + notifications + profile/settings** (EventBus drives toasts + notification log).
- **Checkpoint after each:** typecheck/tests/lint green; slice works offline end-to-end; every mutation registered as a command (so the tutor inherits it later).

### Phase 9 — Cloud + always-on sync (Supabase)
- **T9.1** Supabase project + Postgres schema mirroring the domain + **RLS** per user. *AC:* schema migrated; RLS verified. *Verify:* policy tests.
- **T9.2** Supabase **Auth** via the `AuthProvider` interface; swap in at the composition root (no feature changes). *AC:* sign-up/in/out/reset; session persists. *Verify:* auth flow.
- **T9.3** **RxDB ↔ Supabase replication** + conflict handling (per-doc revisions). *AC:* edits on one device appear on another; offline edits reconcile on reconnect. *Verify:* two-client sync test.
- **T9.4** **Always-sync-on-leave** — flush pending on `visibilitychange`/`pagehide`; register Service-Worker **Background Sync** to deliver offline-queued changes after close. *AC:* closing the app (online or offline) results in cloud consistency once back online. *Verify:* close-tab + offline tests.
- **T9.5** **Storage** — palace images to Supabase Storage with offline-graceful fallback.
- **Checkpoint 9:** real accounts + cross-device, always-on sync + image storage, app still fully usable offline.

### Phase 10 — Hardening & launch
- Accessibility pass (WCAG 2.1 AA, 44px targets, reduced motion, ARIA), **Lighthouse PWA/perf** pass, data-import from the old app, deploy (e.g. Netlify/Vercel + Supabase), remove dead code, consolidate `cn()`.
- **Checkpoint 10:** all acceptance criteria met; Lighthouse PWA installable + green; deployed.

### Phase 11 — Dark theme
- **T11.1** Author the dark semantic map in `src/theme/themes.ts`; no component edits. *AC:* toggle + `prefers-color-scheme` re-theme the whole app; WCAG AA holds in dark. *Verify:* audit every screen in dark.
- **T11.2** Theme toggle in settings (light/dark/system), persisted + synced. *AC:* persists across reload and devices.
- **Checkpoint 11:** full light/dark parity, zero hardcoded colors.

### Phase 12 — AI Tutor (the very last phase)
- **T12.1** Command registry consolidation — every mutation (create/edit/search/settings/profile/generate loci/generate quiz) is a typed command with a zod schema. *AC:* single source of intents.
- **T12.2** **Permission proxy** — tutor-issued commands require explicit user confirmation before running (role.md). *AC:* nothing executes without approval; tested.
- **T12.3** **Claude Edge Function proxy** — Supabase Edge Function holds the key and calls Claude with **tool use** (commands surfaced as tools; Builder assembles requests). Default to latest Claude models (e.g. `claude-opus-4-8` / `claude-sonnet-4-6`). *AC:* app calls the function only; NL ask → tool call → permission → command. *Verify:* "create a palace called X" end-to-end behind the gate.
- **T12.4** Tutor chat UI + `tutorStore` (turn State machine: idle → thinking → awaiting-permission → executing → done).
- **Checkpoint 12:** tutor drives create/edit/search/generate across the app, every action gated, served through the Edge Function.

---

## Risks and mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| Full View rewrite | High | Port Model+ViewModel first (Phases 1–2); rebuild views slice-by-slice against a working core |
| iOS PWA limitations (no push pre-iOS16.4, storage eviction, no install banner) | Med | Custom A2HS hint; persisted-storage request; rely on RxDB+sync so eviction ≠ data loss |
| Offline sync conflicts (multi-device) | Med | Local-first source of truth; RxDB per-doc revisions; deterministic conflict handler |
| LLM API key exposure | High | **Resolved** — key only in the Supabase Edge Function |
| RxDB premium plugins | Low | Use open-source storage (Dexie-based IndexedDB) + the open replication primitive for Supabase |
| Big-bang loses a working app mid-rewrite | Med | Old app = reference spec; new app runnable from Phase 1, grows per slice |

## Open questions (recommendations given; non-blocking)
1. **Router:** TanStack Router (recommended, typed) vs React Router 7.
2. **Hosting:** Netlify vs Vercel vs Cloudflare Pages (+ Supabase). Recommend Netlify or Vercel.
3. **Sync granularity:** RxDB does per-document replication out of the box — recommend that over JSON-blob backup.

## Deliverables (created on approval)
1. `docs/ai_docs/NEW_ARCHITECHTURE.md` — the architecture (decisions, MVVM mapping, folder structure, tech mapping, persistence/sync, PWA, design patterns, SOLID/DRY, color/theming).
2. `tasks/plan.md` — this phased plan.
3. `tasks/todo.md` — the checkbox task list (Phases 0–12).
4. `docs/ai_docs/DESIGN_SYSTEM.md` + tokens spec — produced by **Phase 0** (first execution step, via `/impeccable extract`).

Implementation then proceeds slice-by-slice (e.g. via `/build`), starting at **Phase 0** — no UI before the design system exists.

## End-to-end verification (per slice and overall)
- `npx tsc --noEmit` clean; `npm run lint` clean; `npm test` (Vitest) green.
- `npm run build` succeeds; Lighthouse reports an **installable PWA**; app works **offline** and persists across reload.
- Each slice's user flow works in the browser (Playwright E2E for key paths).
- Phase 9: edits sync across two clients and survive an offline close (Background Sync).
- Final: deployed PWA installs to a phone home screen; AI Tutor performs a gated action end-to-end via the Edge Function.
