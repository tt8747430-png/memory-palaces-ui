import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * On touch devices, nudge a just-focused field into the centre of its scroll
 * container after the on-screen keyboard has started to animate in, so the
 * caret is never hidden behind the keyboard. No-op on pointer/desktop.
 */
export function keepInViewOnFocus(el: HTMLElement | null) {
    if (!el || typeof window === "undefined") return;
    if (!window.matchMedia?.("(pointer: coarse)").matches) return;
    window.setTimeout(() => {
        el.scrollIntoView({block: "center", behavior: "smooth"});
    }, 280);
}