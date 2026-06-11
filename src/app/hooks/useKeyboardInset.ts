import {useEffect, useState} from "react";

/**
 * How many pixels the on-screen keyboard currently overlaps the layout viewport
 * from the bottom. 0 when no keyboard is shown (and on desktop).
 *
 * iOS Safari doesn't resize the layout viewport when the keyboard opens; it
 * overlays it and shrinks `visualViewport` instead. We measure that gap so
 * sheets and footers can dock just above the keys (the Anki/Todoist pattern)
 * rather than being covered by them.
 */
export function useKeyboardInset(): number {
    const [inset, setInset] = useState(0);

    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;

        const update = () => {
            const overlap = window.innerHeight - vv.height - vv.offsetTop;
            // Ignore sub-threshold noise (URL bar nudges, rounding).
            setInset(overlap > 80 ? Math.round(overlap) : 0);
        };

        update();
        vv.addEventListener("resize", update);
        vv.addEventListener("scroll", update);
        return () => {
            vv.removeEventListener("resize", update);
            vv.removeEventListener("scroll", update);
        };
    }, []);

    return inset;
}
