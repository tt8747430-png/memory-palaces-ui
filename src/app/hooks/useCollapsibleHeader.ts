import {type RefObject} from "react";
import {
    type MotionValue,
    useReducedMotion,
    useScroll,
    useTransform,
} from "motion/react";

export interface CollapsibleHeader {
    /** Raw vertical scroll position of the container. */
    scrollY: MotionValue<number>;
    /** Large hero header: fades + scales + drifts up as you scroll. */
    largeOpacity: MotionValue<number>;
    largeScale: MotionValue<number>;
    largeY: MotionValue<number>;
    largePointerEvents: MotionValue<"auto" | "none">;
    /** Compact sticky bar: fades in once the hero has mostly receded. */
    compactOpacity: MotionValue<number>;
    compactPointerEvents: MotionValue<"auto" | "none">;
}

/**
 * Scroll-driven header collapse, the shared mechanism behind the app's
 * collapsing headers (modelled on the profile page). Pass the scroll
 * container's ref; read the motion values onto a large hero header and a
 * compact sticky bar. Pages that collapse in place can use `scrollY` directly.
 */
export function useCollapsibleHeader(
    container: RefObject<HTMLDivElement | null>,
    {distance = 120}: {distance?: number} = {},
): CollapsibleHeader {
    const {scrollY} = useScroll({container});
    // Keep the opacity crossfade (an allowed reduced-motion alternative) but
    // drop the scale/translate parallax when the user prefers reduced motion.
    const reduce = useReducedMotion();

    const largeOpacity = useTransform(scrollY, [0, distance], [1, 0]);
    const largeScale = useTransform(scrollY, [0, distance], reduce ? [1, 1] : [1, 0.96]);
    const largeY = useTransform(scrollY, [0, distance], reduce ? [0, 0] : [0, 28]);
    const largePointerEvents = useTransform(largeOpacity, (v) =>
        v > 0.5 ? "auto" : "none",
    );

    const compactOpacity = useTransform(
        scrollY,
        [distance * 0.55, distance],
        [0, 1],
    );
    const compactPointerEvents = useTransform(compactOpacity, (v) =>
        v > 0.5 ? "auto" : "none",
    );

    return {
        scrollY,
        largeOpacity,
        largeScale,
        largeY,
        largePointerEvents,
        compactOpacity,
        compactPointerEvents,
    };
}
