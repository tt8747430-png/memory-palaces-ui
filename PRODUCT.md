# Product

## Register

product

## Users

People deliberately training their memory: students memorizing material, language learners, professionals retaining names and facts, and enthusiasts practicing the ancient method of loci (memory palace technique). They use Mindscape on a phone, often in focused short sessions (a commute, a study break, before bed), reaching for it on purpose rather than killing time. They want to feel their recall measurably improving, and they expect the craft of a native iOS app.

## Product Purpose

Mindscape ("Your Memory Palace") turns the method of loci into a guided, repeatable practice. Users build mental landscapes, place items along them, and train recall through spaced review and quizzes, with progress tracked over time. It exists to make a proven but hard-to-start technique approachable and sticky: lower the effort of building a palace, make daily practice rewarding, and surface real evidence that memory is improving. Success looks like a returning user with active palaces, a maintained practice streak, and rising recall accuracy.

## Brand Personality

Three voices held in deliberate tension, not three separate moods:

- **Calm & premium** is the baseline. Spacious, unhurried, Apple-grade polish. Memory work should feel like a focused ritual, never a noisy feed.
- **Motivating & gamified** is the reward layer. Streaks, progress, and earned moments of delight pull users back, but the celebration is tasteful and premium, never cartoonish or confetti-for-everything.
- **Intelligent & precise** is the credibility layer. The technique is evidence-based; data (accuracy, retention, streaks) is shown honestly and exactly, like an expert tool a serious learner trusts.

Voice: encouraging and clear, confident without hype. It coaches, it does not cheerlead. Three-word distillation: **focused, rewarding, credible.**

## Anti-references

- **Corporate SaaS dashboard.** No dense data tables, gray enterprise chrome, or soulless admin panels. Progress is shown with warmth and meaning, not spreadsheet density.
- **Cluttered / busy UI.** No information overload, no competing CTAs, no cramped layouts. Every screen breathes; one primary action at a time.
- **Cheap / templated feel.** No stocky default gradients, no Bootstrap-default look, nothing that reads as low-effort. Craft is the brand.
- Gamification is wanted, but the childish-Duolingo trap (cartoon mascots, constant confetti, loud rewards) is off-brand: keep motivation premium and earned.

## Design Principles

1. **One ritual per screen.** Each surface has a single clear job and a single primary action. Calm comes from subtraction, not decoration.
2. **Spatial, like the technique itself.** The method of loci is about place and journey; the interface should feel navigable and spatial (depth, movement through space, a sense of "where you are"), reinforcing the mental model it teaches.
3. **Earn the delight.** Motion and celebration mark genuine milestones (a completed review, a streak kept, a palace finished), not every tap. Reward the moments that matter so they keep meaning.
4. **Show real evidence.** Back the "your memory is improving" promise with honest, precise data. Never fake progress; credibility is the moat.
5. **Native-grade touch craft.** Built phone-first for touch: 44px+ targets, `whileTap` feedback not hover, immediate response, 60fps transform-based motion. It should feel indistinguishable from a hand-built iOS app.

## Accessibility & Inclusion

- Target WCAG 2.1 AA: body text ≥4.5:1, large text ≥3:1, including placeholder and muted text. Watch contrast carefully on glass-morphism surfaces and on the light-blue gradient background, where muted navy-on-blue can fall short.
- Touch accessibility: all interactive elements ≥44×44px with clear, non-hover-dependent active states.
- Respect `prefers-reduced-motion`: every animation needs a crossfade or instant fallback (especially the opening animation, palace transitions, and reward moments).
- Don't rely on color alone to convey state (streaks, success/error, progress); pair with icon, label, or shape for color-blind users.
- Provide proper ARIA labels and semantic structure; the app is icon-heavy, so labels matter for screen readers.
