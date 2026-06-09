---
target: HomePage
total_score: 20
p0_count: 0
p1_count: 4
timestamp: 2026-06-09T08-12-10Z
slug: src-app-components-homepage-tsx
---
# Critique: HomePage (home feed)

Target: `src/app/components/HomePage.tsx` (default "home" tab: ProgressHeader, PalaceProgressCard, TrainingStreak, TrainingCalendar, PalacesOverview, ProgressDebugPanel, over DynamicBackground + AmbientParticles, with LiquidGlassBottomNav).

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Strong feedback (XP counter, save indicator, toasts, level/streak notifications, animated progress). Minor: no skeleton/loading states. |
| 2 | Match System / Real World | 3 | Friendly, jargon-free; memory-palace + XP/level metaphors read naturally. |
| 3 | User Control and Freedom | 2 | Debug "Reset All" wipes progress with no undo/confirm; otherwise modals close cleanly. |
| 4 | Consistency and Standards | 2 | `whileHover` used despite the app's own "no hover, mobile-first" rule; radius (20px vs DESIGN 16px), font (Geist vs Lexend), and gold/coral-vs-semantic drift. |
| 5 | Error Prevention | 1 | Unguarded destructive "Reset All" in the shipped feed; no confirmation. |
| 6 | Recognition Rather Than Recall | 2 | Primary action is an unlabeled arrow icon; bell is icon-only; both lack aria-labels. |
| 7 | Flexibility and Efficiency | 2 | Fine for a simple mobile app; no accelerators (acceptable for the form factor). |
| 8 | Aesthetic and Minimalist Design | 2 | ~30+ perpetual infinite animations plus a debug panel compete; misses the "calm, one ritual per screen" brief. |
| 9 | Error Recovery | 2 | Toasts exist; little inline error handling visible on this surface. |
| 10 | Help and Documentation | 1 | No onboarding, empty states, or contextual help; first-timer gets no guidance on what to tap. |
| **Total** | | **20/40** | **Acceptable (lower boundary)** |

## Anti-Patterns Verdict

**Does this look AI-generated? No.** This is visibly hand-crafted with a committed identity (the liquid-glass nav, the navy/sky system, a custom floating illustration). The deterministic detector scanned `HomePage.tsx` and returned **zero findings** (exit 0). The failure mode here is the opposite of slop: **over-production**. Perpetual ambient motion, glass-on-glass, and decorative particle systems fight the product's own stated "calm, premium, one-ritual-per-screen" baseline.

Two things the detector can't see that a director will:
- **Glassmorphism as the default surface.** Nearly every element is a glass card on an animated glass background. The skill treats decorative glass-everywhere as an anti-pattern; here it's systemic. It's your identity, so the fix is restraint (reserve heavy blur for the nav and one hero), not removal.
- **`feTurbulence` noise overlay** in `DynamicBackground` (opacity 0.015). Nearly invisible, but it's the exact filter the craft bans flag; drop it, it earns nothing.

## Overall Impression

The visual craft is genuinely high, and the reward moments (floating "+50 XP", level-up, streak milestones) match the "rewarding" personality well. But the home feed is **busy in a way that undercuts the brand it's selling**. Everything moves, all the time: three background orbs, twelve particles, a 3D-floating illustration with its own four orbiting sparkles, a perpetually rotating XP bolt, pulsing flames on up to seven streak days, and a breathing ring around the CTA. The single most important thing on the screen, "Start Training", is a small unlabeled arrow tucked in a card corner, quieter than the decoration around it. The biggest opportunity: **calm the perpetual motion, promote one clear primary action, and pull the debug panel out of production.** That single pass moves this from "impressive demo" to "trustworthy daily app".

## What's Working

- **Reward feedback loop.** The XP count-up, floating "+N XP", level-up and streak-milestone notifications, and animated progress fill give satisfying, on-brand peak moments. This is the "rewarding" personality done right.
- **The liquid-glass bottom nav.** A real signature component: spring-tracked active pill, navy-on-white active state reinforced by a dot (not color alone), tasteful glass. This is the level of craft the rest of the feed should orbit, not compete with.
- **System status.** Between the save indicator, toasts, and progress animations, the user rarely wonders whether something happened.

## Priority Issues

- **[P1] Debug panel ships to users with an unguarded destructive reset.** `const [showDebug] = useState(true)` in `HomePage.tsx:91` renders `ProgressDebugPanel` in the live home feed. It exposes "Reset All" (wipes XP, level, streak, rooms via `actions.resetProgress()`) with no confirmation, plus "Add Today" and "+100 XP". It also spins up a second `useProgressState()` instance.
  - **Why it matters:** A user can erase all their progress in one tap with no undo. That's a support ticket and a trust breaker, and the fake XP buttons make the data feel meaningless.
  - **Fix:** Gate on `import.meta.env.DEV` (or remove). If any reset stays in the product, route it through a confirm dialog with a typed/explicit confirmation.
  - **Suggested command:** `$impeccable harden`

- **[P1] No `prefers-reduced-motion` support, and far too much perpetual motion.** Nothing in the codebase respects reduced motion, while this one screen runs ~30+ infinite loops (`DynamicBackground` 3 orbs, `AmbientParticles` 12, `PalaceProgressCard` floating illustration + 4 sparkles + CTA ring, `ProgressHeader` bolt spin + dot pulse, `TrainingStreak` flame pulse + per-day flame rotation).
  - **Why it matters:** It violates PRODUCT.md's explicit reduced-motion requirement and the "earn the delight" principle, can trigger vestibular discomfort, and drains battery on the phones this is built for. Perpetual ambient motion also dilutes the genuine reward peaks.
  - **Fix:** Add a global `@media (prefers-reduced-motion: reduce)` path (crossfade/instant). Independently, cut the always-on loops: static background, drop or one-shot the particles, settle the illustration after entrance. Reserve looping motion for active reward moments.
  - **Suggested command:** `$impeccable animate`

- **[P1] The primary action is hard to find and unlabeled.** "Start Training" is a 48px arrow-only button in the bottom-right of the progress card (`PalaceProgressCard.tsx:199`), with no text and no `aria-label`, surrounded by a pulsing ring and a floating illustration that pull the eye away.
  - **Why it matters:** First-timers don't know it's the main action; screen-reader users hear an unlabeled button. This breaks the "one ritual per screen" principle and recognition-over-recall.
  - **Fix:** Make it a labeled primary button ("Start training", verb + object) that visually dominates the card, and quiet the competing motion around it. Add `aria-label` to it and the bell.
  - **Suggested command:** `$impeccable clarify` then `$impeccable layout`

- **[P1] Low-contrast text on tinted surfaces.** `PalaceProgressCard` body copy is `#6B7280` gray on the `#ADC8FF`-ish glass gradient (well under 4.5:1). `TrainingStreak` day labels are 10px `#6B7280`; the streak badge is `#F59E0B` text on a `#F59E0B/20` fill (amber-on-amber).
  - **Why it matters:** Gray on a colored background washes out (the exact failure DESIGN.md warns about); body and small labels fall below WCAG AA.
  - **Fix:** Move body/secondary text toward Ink/navy on tinted surfaces; for the badge, use navy or a darker shade of its own hue. Re-check each at 4.5:1 (3:1 for ≥18px).
  - **Suggested command:** `$impeccable colorize` (or `$impeccable audit` for a full contrast sweep)

- **[P2] The app contradicts its own conventions.** `whileHover` scale appears on the profile button and cards despite Guidelines' "NO HOVER / mobile-first" rule; card radii are 20px while DESIGN.md sets 16px; `tailwind.css` still ships Geist against the live Lexend; completed streak days use an amber→`#EF4444` (error red) gradient, mixing the semantic-error hue into a success indicator.
  - **Why it matters:** Small inconsistencies accumulate into an "almost-right" feel and weaken the system you just documented.
  - **Fix:** Drop `whileHover` for touch states, reconcile radii to the 16px card token, remove the Geist leftover, and recolor completed streak days to the gold/navy accent rather than error red.
  - **Suggested command:** `$impeccable polish`

## Persona Red Flags

**Casey (Distracted Mobile User):** The primary "Start Training" arrow sits mid-card, not in the thumb zone, and isn't obviously the main action; the only thumb-reachable controls are the nav and the floating CTA arrow. Constant background animation burns battery on the go. Heavy perpetual motion on a possibly-throttled device risks jank during the very first impression.

**Jordan (Confused First-Timer):** Lands on a busy feed with no onboarding or empty state. The main action is an unlabeled arrow; "Build Your Memory Palace!" doesn't say "tap here to start." A "Debug Panel" with "Reset All" is visible and frightening. High chance of tapping the wrong thing or freezing.

**Sam (Accessibility-Dependent):** No `prefers-reduced-motion` path at all, on a screen saturated with motion. Icon-only buttons (arrow CTA, bell) have no accessible names. Low-contrast gray-on-blue body text fails AA. Completed-streak state leans on a color gradient (shape differs via flame icon, which helps).

## Minor Observations

- `profileImage` is a hardcoded Unsplash URL and `userName` is the literal "Memory Master" (`HomePage.tsx:260-263`); fine for a demo, but ships as if real.
- `hasNotifications` defaults to `true`, so the red bell dot is effectively always on.
- Entrance choreography uses fixed delays (0.2-0.7s staggers); on a product surface, one quick stagger is enough, and delayed reveals risk the "blank on slow render" trap if ever gated on visibility.
- `PalaceProgressCard` defaults `currentProgress = 40`, so an empty/new account shows fake 40% progress, which contradicts the "show real evidence" principle.

## Questions to Consider

- What if "Start Training" were a full-width labeled button and the floating illustration sat behind it, not over it? Would the card still feel alive with half the motion?
- Does the home feed need five stacked sections at once, or could the streak/calendar live one level deeper so the daily ritual (train now) owns the first screen?
- If you turned off every infinite loop, which animations would you genuinely miss? Those are the ones worth keeping.
