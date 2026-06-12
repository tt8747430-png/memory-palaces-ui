/**
 * Shared motion vocabulary. Before this, `whileTap` scales were scattered across
 * the app at 0.90 / 0.92 / 0.95 / 0.97 / 0.98 with no rationale, and easing /
 * spring configs were re-typed inline. These presets give every interaction one
 * consistent feel. Spread them onto a `motion` element: `<motion.button {...tap}>`.
 */

/** Standard button / row press. */
export const tap = {whileTap: {scale: 0.97}} as const;
/** Icon buttons, chips, and other small targets. */
export const tapSmall = {whileTap: {scale: 0.94}} as const;
/** Large cards and full-width primary buttons (subtle, so big surfaces don't lurch). */
export const tapCard = {whileTap: {scale: 0.98}} as const;
/** Nav items and press-forward affordances that want a firmer push. */
export const tapNav = {whileTap: {scale: 0.92}} as const;

/** Ease-out quart: the default entrance/settle curve. */
export const easeOutQuart = [0.22, 1, 0.36, 1] as const;
/** Ease-out expo: sharper settle for flips and card reveals. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/** Snappy spring for sheets and sliding pills. */
export const springSnappy = {
    type: "spring",
    stiffness: 420,
    damping: 38,
    mass: 0.9,
} as const;
/** Gentler spring for staggered list items and badges. */
export const springGentle = {type: "spring", stiffness: 320, damping: 26} as const;
