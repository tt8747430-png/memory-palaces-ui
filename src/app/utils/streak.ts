/**
 * Date helpers for the streak views. Training days are stored as `YYYY-MM-DD`
 * keys (see `recordTrainingDay`, which uses `toISOString().split("T")[0]`), so
 * everything here works in the same UTC-day space to avoid off-by-one drift.
 */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** The `YYYY-MM-DD` key for a date, matching how training days are stored. */
export function dayKey(date: Date): string {
    return date.toISOString().slice(0, 10);
}

export interface DayCell {
    key: string;
    weekdayShort: string;
    /** Single letter for the dense calendar header (S M T W T F S). */
    weekdayInitial: string;
    isToday: boolean;
    trained: boolean;
    /** A day later than today; rendered as a faint placeholder, never "missed". */
    future: boolean;
}

function makeCell(date: Date, trained: Set<string>, todayKey: string): DayCell {
    const key = dayKey(date);
    const wd = date.getUTCDay();
    return {
        key,
        weekdayShort: WEEKDAYS[wd],
        weekdayInitial: WEEKDAYS[wd][0],
        isToday: key === todayKey,
        future: key > todayKey,
        trained: trained.has(key) && key <= todayKey,
    };
}

/** The last `count` days ending today, oldest first. */
export function buildDayCells(
    trainingDays: string[],
    count: number,
    endDate: Date = new Date(),
): DayCell[] {
    const trained = new Set(trainingDays);
    const todayKey = dayKey(endDate);
    const cells: DayCell[] = [];
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(endDate);
        d.setUTCDate(d.getUTCDate() - i);
        cells.push(makeCell(d, trained, todayKey));
    }
    return cells;
}

/**
 * A Sunday→Saturday grid of the last `weeks` weeks (oldest week first), aligned
 * so columns line up under an S M T W T F S header — the layout in the
 * reference Training History sheet.
 */
export function buildWeekGrid(
    trainingDays: string[],
    weeks: number,
    endDate: Date = new Date(),
): DayCell[][] {
    const trained = new Set(trainingDays);
    const todayKey = dayKey(endDate);

    // Sunday of the current week.
    const currentSunday = new Date(endDate);
    currentSunday.setUTCDate(currentSunday.getUTCDate() - currentSunday.getUTCDay());

    const grid: DayCell[][] = [];
    for (let w = weeks - 1; w >= 0; w--) {
        const row: DayCell[] = [];
        for (let d = 0; d < 7; d++) {
            const date = new Date(currentSunday);
            date.setUTCDate(currentSunday.getUTCDate() - w * 7 + d);
            row.push(makeCell(date, trained, todayKey));
        }
        grid.push(row);
    }
    return grid;
}

/** Total distinct days trained. */
export function totalTrainingDays(trainingDays: string[]): number {
    return new Set(trainingDays).size;
}
