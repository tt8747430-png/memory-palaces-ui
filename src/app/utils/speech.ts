/**
 * Thin wrapper over the Web Speech API (`speechSynthesis`). A no-op when the
 * browser lacks support, so callers never have to feature-detect. Used by the
 * flashcard study screen and the room terms list to read a card face aloud.
 */

export function speechAvailable(): boolean {
    return (
        typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        typeof window.SpeechSynthesisUtterance !== "undefined"
    );
}

interface SpeakOptions {
    /** BCP-47 tag, e.g. "en-US". Defaults to the document language. */
    lang?: string;
    /** 0.1–10, default 1. */
    rate?: number;
    /** 0–2, default 1. */
    pitch?: number;
}

/**
 * Speak `text` aloud, cancelling anything already queued so taps feel
 * immediate rather than stacking up. Safe to call with empty text (no-op).
 */
export function speak(text: string, opts: SpeakOptions = {}): void {
    if (!speechAvailable()) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(trimmed);
    utter.lang = opts.lang ?? document.documentElement.lang ?? "en-US";
    utter.rate = opts.rate ?? 1;
    utter.pitch = opts.pitch ?? 1;
    synth.speak(utter);
}

/** Stop any in-progress or queued speech. */
export function cancelSpeech(): void {
    if (!speechAvailable()) return;
    window.speechSynthesis.cancel();
}
