import {useRef} from "react";
import {animate, type HTMLMotionProps, useMotionValue, useReducedMotion} from "motion/react";
import {useDrag} from "@use-gesture/react";

/** Gesture must start within this many px of the left edge to engage. */
const EDGE_PX = 28;
/** Drag this fraction of the viewport width to commit the back navigation. */
const COMMIT_RATIO = 0.35;
/** …or fling rightward faster than this (px/ms) to commit. */
const FLING_VELOCITY = 0.5;

interface SwipeBackOptions {
    /** Turn the gesture off (e.g. while a nested sheet owns the screen). */
    enabled?: boolean;
}

/**
 * Edge-swipe-back for full-screen overlays: drag right from the left edge to
 * dismiss, mirroring the native iOS interactive pop.
 *
 * Engages only when the touch starts within {@link EDGE_PX} of the left edge, so
 * it never competes with vertical scroll or inner horizontal swipes (room cards,
 * carousels). Honors `prefers-reduced-motion` by skipping the live slide and
 * navigating instantly once the swipe is committed.
 *
 * Spread `bind()` and `style={{ x }}` onto the screen's root `motion` element and
 * give that element `touch-action: pan-y` (the `touch-pan-y` class) so the browser
 * keeps vertical scrolling while JS owns the horizontal drag.
 */
export function useSwipeBack(
    onBack: () => void,
    {enabled = true}: SwipeBackOptions = {},
) {
    const x = useMotionValue(0);
    const reduce = useReducedMotion();
    const engaged = useRef(false);

    const dragBind = useDrag(
        ({first, last, movement: [mx], velocity: [vx], direction: [dx], initial: [ix], cancel}) => {
            if (!enabled) return;

            if (first) {
                // Only own the gesture when it begins at the screen edge; otherwise
                // bail immediately so inner scrollers/swipes keep the pointer.
                engaged.current = ix <= EDGE_PX;
                if (!engaged.current) {
                    cancel();
                    return;
                }
            }
            if (!engaged.current) return;

            const dragX = Math.max(0, mx);

            if (last) {
                engaged.current = false;
                const width =
                    typeof window !== "undefined" ? window.innerWidth : 1;
                const committed =
                    dragX > width * COMMIT_RATIO ||
                    (vx > FLING_VELOCITY && dx > 0);
                if (committed) {
                    if (reduce) {
                        onBack();
                    } else {
                        animate(x, width, {
                            duration: 0.22,
                            ease: [0.16, 1, 0.3, 1],
                            onComplete: onBack,
                        });
                    }
                } else {
                    animate(x, 0, {type: "spring", stiffness: 400, damping: 36});
                }
                return;
            }

            if (reduce) return; // no live tracking under reduced motion
            x.set(dragX);
        },
        // `capture: false` keeps this root-level drag from stealing the pointer
        // from inner swipeable elements (room cards, carousels); we only need the
        // edge gesture, which stays within the full-screen element anyway.
        {axis: "x", filterTaps: true, pointer: {touch: true, capture: false}},
    );

    const bind = () => dragBind() as unknown as HTMLMotionProps<"div">;

    return {bind, x};
}
