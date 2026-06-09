import {ReactNode} from 'react';

interface SmoothScrollProviderProps {
    children: ReactNode;
}

/**
 * Pass-through provider.
 *
 * This app never scrolls at the window level: every screen scrolls inside its
 * own `overflow-y-auto` container (fixed header + inner scroll region). A
 * page-level smooth-scroll engine (Lenis `root`) hijacks wheel/trackpad input
 * for the window, so it has nothing to scroll here and instead swallows wheel
 * events over the inner containers, making them feel stuck on desktop. Native
 * scrolling on those containers is already smooth (momentum on touch), so we
 * let it through untouched.
 *
 * If a future screen genuinely scrolls the page, or wants desktop momentum
 * smoothing on one region, wrap *that* scroll container with `<ReactLenis>`
 * (scoped, not `root`) rather than re-introducing a global root instance.
 */
export function SmoothScrollProvider({children}: SmoothScrollProviderProps) {
    return <>{children}</>;
}
