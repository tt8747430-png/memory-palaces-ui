import {useCallback, useRef} from "react";
import {
    type MotionValue,
    useMotionValue,
    useReducedMotion,
    useTransform,
} from "motion/react";

/**
 * Track a scroll container's vertical offset as a MotionValue, wiring the
 * listener through a **callback ref**.
 *
 * Why not motion's `useScroll({container})`: that reads the ref once when the
 * hook first runs and never re-attaches. On a surface that stays mounted but is
 * shown via a flag (Settings is rendered as `<SettingsScreen open={...}/>` and
 * toggled), the scroll node doesn't exist on first run, so the listener binds to
 * nothing and the header never collapses. A callback ref fires on every mount
 * and unmount, so tracking attaches the moment the node appears.
 */
export function useContainerScroll() {
    const scrollY = useMotionValue(0);
    const detach = useRef<(() => void) | null>(null);

    const ref = useCallback(
        (node: HTMLElement | null) => {
            detach.current?.();
            detach.current = null;
            if (!node) return;
            const onScroll = () => scrollY.set(node.scrollTop);
            onScroll();
            node.addEventListener("scroll", onScroll, {passive: true});
            detach.current = () => node.removeEventListener("scroll", onScroll);
        },
        [scrollY],
    );

    return {ref, scrollY};
}

export interface CollapsibleHeader {
    /** Attach to the scroll container: `<div ref={header.ref}>`. */
    ref: (node: HTMLElement | null) => void;
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
 * Scroll-driven header collapse shared across the app's pages. Spread `ref` onto
 * the scroll container, then read the motion values onto a large hero header and
 * a compact sticky bar. Reduced motion keeps the opacity crossfade but drops the
 * scale/translate parallax.
 */
export function useCollapsibleHeader({
                                         distance = 120,
                                     }: {distance?: number} = {}): CollapsibleHeader {
    const {ref, scrollY} = useContainerScroll();
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
        ref,
        scrollY,
        largeOpacity,
        largeScale,
        largeY,
        largePointerEvents,
        compactOpacity,
        compactPointerEvents,
    };
}
