import {type ProgressState} from "../hooks/useProgressState";
import {countDueLoci} from "./dueCards";
import {totalTrainingDays} from "./streak";

/**
 * The single source of truth for the learner's derived stats. Before this, the
 * same numbers were recomputed (and drifted) in StatsScreen, ProfilePage, and
 * AboutScreen. Every stats surface now reads from here so a metric reads
 * identically everywhere.
 */
export interface Stats {
    totalXP: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    daysTrained: number;
    palaces: number;
    roomsCompleted: number;
    totalCards: number;
    dueToday: number;
    bestQuizAccuracy: number;
}

export function computeStats(state: ProgressState): Stats {
    const totalCards = state.palaces.reduce(
        (sum, p) => sum + (p.rooms || []).reduce((s, r) => s + (r.loci?.length || 0), 0),
        0,
    );
    return {
        totalXP: state.userXP,
        level: state.currentLevel,
        currentStreak: state.streakCount,
        longestStreak: state.longestStreak,
        daysTrained: totalTrainingDays(state.trainingDays),
        palaces: state.palaces.length,
        roomsCompleted: state.totalRoomsCompleted,
        totalCards,
        dueToday: countDueLoci(state.palaces),
        bestQuizAccuracy: state.bestQuizAccuracy,
    };
}
