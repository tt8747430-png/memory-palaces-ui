import type {Locus} from "../hooks/useProgressState";

/**
 * Helpers for the verse-study modes (Blur / Words / Initials / Type).
 *
 * A verse locus stores its reference in `front` (e.g. "3 Ioan 1:1") and the
 * verse text in `back`. eBiblia imports prefix the text with the reference, so
 * `verseText` strips a leading reference to recover the prose to memorize.
 */

/** The pure verse prose: `back` with a leading reference stripped when present. */
export function verseText(locus: Locus): string {
    const back = (locus.back ?? "").trim();
    const front = (locus.front ?? "").trim();
    if (front && back.startsWith(front)) {
        const rest = back.slice(front.length).trim();
        return rest || back;
    }
    return back;
}

/** Split text into word tokens, keeping any attached punctuation. */
export function tokenizeWords(text: string): string[] {
    return text.split(/\s+/).filter(Boolean);
}

/** A standalone verse-number marker like "15:1" or "(1:1)" — kept intact in
 *  the Initials view instead of reduced to a single first letter. */
export function isVerseMarker(token: string): boolean {
    return /^\(?\d+[:.]\d+\)?[.:,]?$/.test(token);
}

export interface WordInitial {
    /** Leading punctuation kept before the cue (e.g. an opening quote). */
    lead: string;
    /** The first letter/number shown as the recall cue. */
    initial: string;
    /** Count of hidden trailing letters, for sizing the underline. */
    hidden: number;
    /** Trailing punctuation kept after the word (comma, period, quote). */
    trail: string;
}

/** Break a word into its first-letter cue plus the punctuation around it. */
export function wordInitial(token: string): WordInitial {
    const lead = token.match(/^[^\p{L}\p{N}]*/u)?.[0] ?? "";
    const trail = token.match(/[^\p{L}\p{N}]*$/u)?.[0] ?? "";
    const core = token.slice(lead.length, token.length - trail.length);
    return {
        lead,
        initial: core.charAt(0),
        hidden: Math.max(0, core.length - 1),
        trail,
    };
}

/** Lowercased, punctuation-free form for comparing typed words to the verse. */
export function normalizeWord(word: string): string {
    return word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

/** Fisher–Yates shuffle returning a new array. */
export function scramble<T>(input: T[]): T[] {
    const a = [...input];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
