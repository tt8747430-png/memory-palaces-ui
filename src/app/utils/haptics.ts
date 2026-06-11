/**
 * Tiny haptic feedback helper over the Web Vibration API. A no-op on devices
 * without a vibrator (most desktops, iOS Safari) so callers stay clean. Gesture
 * surfaces (the flashcard swipe deck, Match) use it to confirm threshold
 * crossings and commits with a physical tick.
 *
 * Honors a user preference for reduced motion by skipping vibration when the
 * `prefers-reduced-motion` query matches.
 */

function canVibrate(): boolean {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
        return false;
    }
    if (typeof window !== "undefined" && "matchMedia" in window) {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    }
    return true;
}

function vibrate(pattern: number | number[]): void {
    if (!canVibrate()) return;
    try {
        navigator.vibrate(pattern);
    } catch {
        // Some platforms throw if called outside a user gesture; ignore.
    }
}

/** A light tick: a swipe crossing its action threshold. */
export function tick(): void {
    vibrate(8);
}

/** A firmer bump: a card committed / an answer registered. */
export function impact(): void {
    vibrate(18);
}

/** A short celebratory pattern: a session or round completed. */
export function success(): void {
    vibrate([12, 40, 24]);
}
