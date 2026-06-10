/**
 * Lightweight spaced-repetition scheduler (an SM-2 variant) for loci.
 *
 * Each locus optionally carries an `SrsState`. A locus with no state is "new"
 * and always due. Grading a locus advances its schedule and sets the next due
 * date. Kept deliberately small: four grades, one ease factor, day intervals.
 */

export type Grade = "again" | "hard" | "good" | "easy";

export interface SrsState {
    /** ISO date the card is next due. */
    due: string;
    /** Current interval in days. */
    interval: number;
    /** Ease factor (>= 1.3). */
    ease: number;
    /** Consecutive successful reviews. */
    reps: number;
    /** Times the card was forgotten. */
    lapses: number;
    /** ISO timestamp of the last review. */
    lastReviewed: string;
}

const DAY_MS = 86_400_000;
const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;

function isoInDays(days: number): string {
    return new Date(Date.now() + days * DAY_MS).toISOString();
}

/** A locus with no SRS state is brand new and therefore due. */
export function isDue(srs: SrsState | undefined, now: number = Date.now()): boolean {
    if (!srs) return true;
    return new Date(srs.due).getTime() <= now;
}

/** Apply a grade to a card's prior state and return its next schedule. */
export function schedule(prev: SrsState | undefined, grade: Grade): SrsState {
    let ease = prev?.ease ?? DEFAULT_EASE;
    let reps = prev?.reps ?? 0;
    let lapses = prev?.lapses ?? 0;
    let interval = prev?.interval ?? 0;

    if (grade === "again") {
        ease = Math.max(MIN_EASE, ease - 0.2);
        lapses += 1;
        reps = 0;
        interval = 0; // due again this session and today
    } else {
        if (grade === "hard") {
            ease = Math.max(MIN_EASE, ease - 0.15);
            interval = reps === 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
        } else if (grade === "good") {
            interval = reps === 0 ? 1 : reps === 1 ? 3 : Math.round(interval * ease);
        } else {
            // easy
            ease = ease + 0.15;
            interval =
                reps === 0 ? 2 : reps === 1 ? 5 : Math.round(interval * ease * 1.3);
        }
        reps += 1;
    }

    return {
        ease,
        reps,
        lapses,
        interval,
        due: isoInDays(interval),
        lastReviewed: new Date().toISOString(),
    };
}

/** Human-friendly preview of when a grade would schedule the card next. */
export function nextIntervalLabel(prev: SrsState | undefined, grade: Grade): string {
    const next = schedule(prev, grade);
    if (next.interval <= 0) return "now";
    if (next.interval === 1) return "1d";
    if (next.interval < 30) return `${next.interval}d`;
    if (next.interval < 365) return `${Math.round(next.interval / 30)}mo`;
    return `${Math.round(next.interval / 365)}y`;
}
