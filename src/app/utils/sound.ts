/**
 * Tiny sound-effect helper over the Web Audio API. Plays short, soft, on-brand
 * tones to confirm answers and mark a finished session. Deliberately minimal:
 * no audio files, no library, no looping ambience. A no-op when Web Audio is
 * unavailable or when the user has turned Sound effects off.
 *
 * The AudioContext is created lazily on first use (after a user gesture, which
 * is always the case here: sounds fire on taps), and reused thereafter.
 */

let soundEnabled = true;
let ctx: AudioContext | null = null;

/** Sync the Sound effects preference; called by the preferences store. */
export function setSoundEnabled(enabled: boolean): void {
    soundEnabled = enabled;
}

function audioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const Ctor =
        window.AudioContext ||
        (window as unknown as {webkitAudioContext?: typeof AudioContext})
            .webkitAudioContext;
    if (!Ctor) return null;
    if (!ctx) {
        try {
            ctx = new Ctor();
        } catch {
            return null;
        }
    }
    // Browsers suspend the context until a gesture resumes it.
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
}

/**
 * Play one soft note. `type` "sine" keeps it round and calm; a short
 * attack/decay envelope avoids clicks. Volume is intentionally low so the
 * effect reads as a confirmation, never an alarm.
 */
function note(freq: number, durationMs: number, peak = 0.06): void {
    const ac = audioContext();
    if (!ac) return;
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + durationMs / 1000 + 0.02);
}

/** A bright two-note lift for a correct answer. */
export function playCorrect(): void {
    if (!soundEnabled) return;
    note(660, 90);
    setTimeout(() => note(880, 130), 70);
}

/** A soft, low single note for a wrong answer. Never harsh. */
export function playWrong(): void {
    if (!soundEnabled) return;
    note(300, 150, 0.05);
}

/** A short three-note flourish for a finished session. */
export function playComplete(): void {
    if (!soundEnabled) return;
    note(523, 110);
    setTimeout(() => note(659, 110), 90);
    setTimeout(() => note(784, 200), 180);
}
