import {isDue} from "./srs";
import type {Locus, Palace} from "../hooks/useProgressState";

/**
 * One due card resolved across the whole library, carrying the ids needed to
 * write its grade back through `actions.reviewLocus(palaceId, roomId, locusId,
 * grade)`. Used by the cross-palace Daily Review.
 */
export interface DueCard {
    palaceId: string;
    palaceName: string;
    roomId: string;
    roomTitle: string;
    locus: Locus;
}

/**
 * Gather every locus due for review today across all non-archived palaces. A
 * locus with no SRS state is brand new and counts as due. Order is stable
 * (palace order, room order, locus order) so the queue feels deliberate.
 */
export function getDueLoci(palaces: Palace[], now: number = Date.now()): DueCard[] {
    const due: DueCard[] = [];
    for (const palace of palaces) {
        if (palace.archived) continue;
        for (const room of palace.rooms ?? []) {
            for (const locus of room.loci ?? []) {
                if (isDue(locus.srs, now)) {
                    due.push({
                        palaceId: palace.id,
                        palaceName: palace.name,
                        roomId: room.id,
                        roomTitle: room.title,
                        locus,
                    });
                }
            }
        }
    }
    return due;
}

/** Count of cards due across the library (cheap; for the Home feed badge). */
export function countDueLoci(palaces: Palace[], now: number = Date.now()): number {
    return getDueLoci(palaces, now).length;
}
