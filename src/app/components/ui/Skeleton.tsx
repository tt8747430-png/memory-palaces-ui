import {cn} from "./utils";

/**
 * Branded loading placeholder. Navy-tinted pulse on a white surface, slate-blue
 * on darker surfaces via a passed className. The pulse is CSS-driven, so it
 * respects the global `prefers-reduced-motion` rule in theme.css (it settles
 * static instead of pulsing). Decorative, so it's hidden from screen readers;
 * pair the loading region with an `aria-busy` container if announcing matters.
 */
export function Skeleton({className}: {className?: string}) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "animate-pulse rounded-[12px] bg-[#091A7A]/10",
                className,
            )}
        />
    );
}
