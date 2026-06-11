import {useEffect} from "react";
import {useLocalStorage} from "./useLocalStorage";
import {calculateLevel} from "./useSaveStatus";
import {type Grade, markKnown, schedule, type SrsState} from "../utils/srs";

/** Stable, collision-resistant id with a readable prefix. */
function genId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * A locus: one memory spot inside a room. `front` is the thing to recall,
 * `back` is what it means, `hint` is the image/place you picture it in (the
 * heart of the method of loci), and `tip` is an optional nudge you can peek at
 * before flipping. `srs` carries its spaced-repetition schedule.
 */
export interface Locus {
    id: string;
    front: string;
    back: string;
    hint?: string;
    tip?: string;
    srs?: SrsState;
    /** User-flagged for follow-up (e.g., marked tricky during study). */
    flagged?: boolean;
}

/** A multiple-choice recall question scoped to a room. */
export interface Question {
    id: string;
    prompt: string;
    options: string[];
    /** Index into `options` of the correct choice. */
    correctAnswer: number;
    explanation?: string;
}

/** A room is a place in the palace that holds an ordered set of loci. */
export interface Room {
    id: string;
    title: string;
    description: string;
    duration: number;
    content: string;
    isUnlocked: boolean;
    isCompleted: boolean;
    progress: number;
    order: number;
    loci?: Locus[];
    questions?: Question[];
}

export type StudyDirection = "front" | "back";
export type CardOrder = "inOrder" | "shuffle" | "reverse";

/** Per-palace study configuration. Absent means defaults (see DEFAULT_SETTINGS). */
export interface PalaceSettings {
    /** Run the per-question countdown in this palace's quiz. */
    quizTimer: boolean;
    /** Which face leads in training: `front` (recall meaning) or `back`. */
    studyDirection: StudyDirection;
    /** Default browse order for a study session. */
    cardOrder: CardOrder;
    /** Randomize question order in the quiz. */
    shuffleQuestions: boolean;
    /** Shuffle the flashcard deck at the start of each study session. */
    shuffleCards: boolean;
    /** Read the visible card face aloud (Web Speech API) during study. */
    textToSpeech: boolean;
    /** Swipe cards into "Still learning" / "Known" piles while studying. */
    sortIntoPiles: boolean;
}

export const DEFAULT_SETTINGS: PalaceSettings = {
    quizTimer: true,
    studyDirection: "front",
    cardOrder: "inOrder",
    shuffleQuestions: false,
    shuffleCards: false,
    textToSpeech: false,
    sortIntoPiles: true,
};

/** Read a palace's settings, applying defaults and mapping any legacy keys. */
export function palaceSettings(palace?: Palace): PalaceSettings {
    const raw = (palace?.settings ?? {}) as Partial<PalaceSettings> & {
        shuffle?: boolean;
    };
    return {
        ...DEFAULT_SETTINGS,
        ...raw,
        // Legacy `shuffle` boolean maps onto the new cardOrder.
        cardOrder: raw.cardOrder ?? (raw.shuffle ? "shuffle" : "inOrder"),
    };
}

export interface Palace {
    id: string;
    name: string;
    description: string;
    progress: number;
    icon: string;
    color: string;
    roomsCompleted: number;
    totalRooms: number;
    category: string;
    rooms?: Room[];
    settings?: PalaceSettings;
    createdAt: string;
    updatedAt: string;
    /** Pinned to the top of the list. */
    favorite?: boolean;
    /** Hidden from the main list without being deleted. */
    archived?: boolean;
    /** The collection this palace belongs to, or null/undefined for none. */
    folderId?: string | null;
}

/** A user-defined collection that groups palaces (like folders). */
export interface Folder {
    id: string;
    name: string;
    /** Tailwind gradient string, e.g. "from-blue-500 to-cyan-500". */
    color: string;
    icon: string;
    createdAt: string;
}

/** The kinds of milestone a notification can record. */
export type NotificationType =
    | "xp-gain"
    | "level-up"
    | "streak"
    | "room-complete"
    | "palace-complete"
    | "quiz-complete"
    | "info";

/** One entry in the persistent notification log shown on the bell screen. */
export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    subtitle?: string;
    xpGain?: number;
    createdAt: string;
    read: boolean;
}

/** Newest entries first; the log is capped so it never grows unbounded. */
const NOTIFICATION_CAP = 40;

type NotificationDraft = Omit<AppNotification, "id" | "createdAt" | "read">;

function appendNotifications(
    log: AppNotification[],
    drafts: NotificationDraft[],
): AppNotification[] {
    if (drafts.length === 0) return log;
    const now = new Date().toISOString();
    const created: AppNotification[] = drafts.map((draft) => ({
        ...draft,
        id: genId("ntf"),
        createdAt: now,
        read: false,
    }));
    return [...created, ...log].slice(0, NOTIFICATION_CAP);
}

export interface ProgressState {
    userXP: number;
    currentLevel: number;
    streakCount: number;
    lastTrainingDate: string | null;
    palaces: Palace[];
    folders: Folder[];
    trainingDays: string[];
    currentProgress: number;
    totalRoomsCompleted: number;
    notifications: AppNotification[];
}

/**
 * Recompute a palace's room-derived stats from its rooms. Every mutation that
 * adds, edits, or removes rooms must go through this, or `totalRooms` /
 * `roomsCompleted` / `progress` drift from the real structure.
 */
function withRoomStats(palace: Palace): Palace {
    const rooms = palace.rooms || [];
    const roomsCompleted = rooms.filter((room) => room.isCompleted).length;
    return {
        ...palace,
        totalRooms: rooms.length,
        roomsCompleted,
        progress:
            rooms.length > 0
                ? Math.round((roomsCompleted / rooms.length) * 100)
                : 0,
    };
}

// --- Migration --------------------------------------------------------------
// The model dropped the Floor layer (Palace → Floor → Room became
// Palace → Room) and renamed a room's `flashcards` to `loci`. Older saved
// state is upgraded on load, in place, with no data loss.

interface LegacyRoom extends Omit<Room, "loci"> {
    flashcards?: Locus[];
}

interface LegacyPalace extends Palace {
    floors?: {rooms?: LegacyRoom[]}[];
}

function migrateRoom(room: Room | LegacyRoom): Room {
    const legacy = room as LegacyRoom;
    if (legacy.flashcards && !(room as Room).loci) {
        const {flashcards, ...rest} = legacy;
        return {...rest, loci: flashcards};
    }
    return room as Room;
}

/** A small starter log so the bell screen is alive on first run. */
function seedNotifications(): AppNotification[] {
    const now = Date.now();
    const at = (minutesAgo: number) =>
        new Date(now - minutesAgo * 60_000).toISOString();
    const make = (
        minutesAgo: number,
        draft: NotificationDraft,
    ): AppNotification => ({
        ...draft,
        id: genId("ntf"),
        createdAt: at(minutesAgo),
        read: false,
    });
    return [
        make(7, {
            type: "streak",
            title: "5-day streak",
            subtitle: "You're on a roll — keep the chain alive.",
        }),
        make(95, {
            type: "level-up",
            title: "Level 12 reached",
            subtitle: "Fresh rooms are ready to explore.",
            xpGain: 100,
        }),
        make(1440, {
            type: "room-complete",
            title: "Room complete",
            subtitle: "World Capitals",
            xpGain: 50,
        }),
    ];
}

function isLegacy(state: ProgressState): boolean {
    if (state.folders === undefined) return true;
    if (state.notifications === undefined) return true;
    return state.palaces.some((p) => {
        const lp = p as LegacyPalace;
        if (lp.floors !== undefined && lp.rooms === undefined) return true;
        return (p.rooms || []).some(
            (r) => (r as LegacyRoom).flashcards !== undefined,
        );
    });
}

function migrateState(state: ProgressState): ProgressState {
    if (!isLegacy(state)) return state;
    const palaces = state.palaces.map((palace) => {
        const lp = palace as LegacyPalace;
        if (lp.floors !== undefined && lp.rooms === undefined) {
            const {floors, ...rest} = lp;
            const flattened = (floors || []).flatMap((f) => f.rooms || []);
            const rooms = flattened.map(migrateRoom);
            // Empty floors were demo placeholders; keep their displayed totals.
            return rooms.length > 0
                ? withRoomStats({...rest, rooms})
                : ({...rest, rooms} as Palace);
        }
        if (palace.rooms?.some((r) => (r as LegacyRoom).flashcards)) {
            return {...palace, rooms: palace.rooms.map(migrateRoom)};
        }
        return palace;
    });
    return {
        ...state,
        palaces,
        folders: state.folders ?? [],
        notifications: state.notifications ?? seedNotifications(),
    };
}

const DEFAULT_STATE: ProgressState = {
    userXP: 2450,
    currentLevel: 12,
    streakCount: 5,
    lastTrainingDate: null,
    palaces: [
        {
            id: "greek-mythology",
            name: "Greek Mythology",
            description: "Ancient gods and heroes",
            progress: 75,
            icon: "🏛️",
            color: "from-purple-500 to-pink-500",
            roomsCompleted: 9,
            totalRooms: 12,
            category: "History",
            createdAt: "2026-01-15T10:00:00.000Z",
            updatedAt: "2026-05-20T14:30:00.000Z",
            rooms: [],
        },
        {
            id: "solar-system",
            name: "Solar System",
            description: "Planets and celestial bodies",
            progress: 50,
            icon: "🌌",
            color: "from-blue-500 to-cyan-500",
            roomsCompleted: 4,
            totalRooms: 8,
            category: "Science",
            createdAt: "2026-02-10T08:00:00.000Z",
            updatedAt: "2026-05-18T16:45:00.000Z",
            rooms: [],
        },
        {
            id: "world-capitals",
            name: "World Capitals",
            description: "Major cities around the globe",
            progress: 90,
            icon: "🌍",
            color: "from-green-500 to-emerald-500",
            roomsCompleted: 22,
            totalRooms: 24,
            category: "Geography",
            createdAt: "2026-01-05T12:00:00.000Z",
            updatedAt: "2026-05-21T09:15:00.000Z",
            rooms: [],
        },
        {
            id: "human-anatomy",
            name: "Human Anatomy",
            description: "Body systems and organs",
            progress: 30,
            icon: "🫀",
            color: "from-red-500 to-orange-500",
            roomsCompleted: 5,
            totalRooms: 15,
            category: "Science",
            createdAt: "2026-03-01T14:00:00.000Z",
            updatedAt: "2026-05-19T11:20:00.000Z",
            rooms: [],
        },
        {
            id: "periodic-table",
            name: "Periodic Table",
            description: "Chemical elements",
            progress: 60,
            icon: "⚗️",
            color: "from-indigo-500 to-purple-500",
            roomsCompleted: 11,
            totalRooms: 18,
            category: "Science",
            createdAt: "2026-02-20T10:30:00.000Z",
            updatedAt: "2026-05-20T13:40:00.000Z",
            rooms: [],
        },
        {
            id: "programming-languages",
            name: "Programming Languages",
            description: "Syntax and concepts",
            progress: 45,
            icon: "💻",
            color: "from-amber-500 to-yellow-500",
            roomsCompleted: 5,
            totalRooms: 10,
            category: "Technology",
            createdAt: "2026-04-01T09:00:00.000Z",
            updatedAt: "2026-05-22T10:00:00.000Z",
            rooms: [],
        },
    ],
    folders: [],
    trainingDays: [],
    currentProgress: 65,
    totalRoomsCompleted: 87,
    notifications: seedNotifications(),
};

export function useProgressState(onEvent?: (event: ProgressEvent) => void) {
    const [stored, setState] = useLocalStorage<ProgressState>(
        "memory-palace-progress",
        DEFAULT_STATE,
    );

    // Migrate on read so the UI is never handed legacy shapes, and persist the
    // upgrade once so later writes operate on the new model.
    const state = migrateState(stored);
    useEffect(() => {
        setState((prev) => migrateState(prev));
        // Runs once; migrateState is a no-op when already current.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addXP = (amount: number) => {
        setState((prev) => {
            const oldLevel = prev.currentLevel;
            const newXP = prev.userXP + amount;
            const {currentLevel: newLevel} = calculateLevel(newXP);

            onEvent?.({type: "xp-gain", data: {xpGain: amount}});
            const leveledUp = newLevel > oldLevel;
            if (leveledUp) {
                onEvent?.({type: "level-up", data: {newLevel, xpGain: amount}});
            }

            return {
                ...prev,
                userXP: newXP,
                currentLevel: newLevel,
                notifications: leveledUp
                    ? appendNotifications(prev.notifications, [
                        {
                            type: "level-up",
                            title: `Level ${newLevel} reached`,
                            subtitle: "New rooms are ready to explore.",
                            xpGain: amount,
                        },
                    ])
                    : prev.notifications,
            };
        });
    };

    /** Recompute top-level progress totals across all palaces. */
    const recomputeTotals = (palaces: Palace[]) => {
        const totalRooms = palaces.reduce((s, p) => s + p.roomsCompleted, 0);
        const totalPossible = palaces.reduce((s, p) => s + p.totalRooms, 0);
        return {
            totalRoomsCompleted: totalRooms,
            currentProgress:
                totalPossible > 0
                    ? Math.round((totalRooms / totalPossible) * 100)
                    : 0,
        };
    };

    const completeRoom = (palaceId: string) => {
        let palaceName = "";
        let isPalaceComplete = false;

        setState((prev) => {
            const updatedPalaces = prev.palaces.map((palace) => {
                if (palace.id !== palaceId) return palace;
                const rooms = palace.rooms || [];
                // Mark the first unlocked, incomplete room done; unlock the next.
                const idx = rooms.findIndex(
                    (r) => r.isUnlocked && !r.isCompleted,
                );
                if (idx === -1) return palace;
                const nextRooms = rooms.map((room, i) => {
                    if (i === idx)
                        return {...room, isCompleted: true, progress: 100};
                    if (i === idx + 1) return {...room, isUnlocked: true};
                    return room;
                });
                const stats = withRoomStats({...palace, rooms: nextRooms});
                palaceName = palace.name;
                isPalaceComplete = stats.progress === 100;
                return {...stats, updatedAt: new Date().toISOString()};
            });

            const drafts: NotificationDraft[] = [
                {
                    type: "room-complete",
                    title: "Room complete",
                    subtitle: palaceName,
                    xpGain: 50,
                },
            ];
            if (isPalaceComplete) {
                drafts.unshift({
                    type: "palace-complete",
                    title: "Palace mastered",
                    subtitle: `You completed ${palaceName}.`,
                });
            }

            return {
                ...prev,
                palaces: updatedPalaces,
                ...recomputeTotals(updatedPalaces),
                notifications: appendNotifications(prev.notifications, drafts),
            };
        });

        onEvent?.({type: "room-complete", data: {palaceName}});
        if (isPalaceComplete) {
            onEvent?.({type: "palace-complete", data: {palaceName}});
        }
        addXP(50);
    };

    const recordTrainingDay = () => {
        const today = new Date().toISOString().split("T")[0];
        let newStreakCount = 0;
        let isNewStreak = false;

        setState((prev) => {
            if (prev.trainingDays.includes(today)) return prev;

            const newTrainingDays = [...prev.trainingDays, today].slice(-7);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split("T")[0];

            const isConsecutive =
                prev.lastTrainingDate === yesterdayStr ||
                prev.lastTrainingDate === today;
            newStreakCount = isConsecutive ? prev.streakCount + 1 : 1;
            isNewStreak = isConsecutive && newStreakCount > prev.streakCount;
            const isMilestone = isNewStreak && newStreakCount % 7 === 0;

            return {
                ...prev,
                trainingDays: newTrainingDays,
                lastTrainingDate: today,
                streakCount: newStreakCount,
                notifications: isMilestone
                    ? appendNotifications(prev.notifications, [
                        {
                            type: "streak",
                            title: "Streak milestone",
                            subtitle: `${newStreakCount}-day streak — incredible focus.`,
                        },
                    ])
                    : prev.notifications,
            };
        });

        if (isNewStreak && newStreakCount > 1) {
            onEvent?.({type: "streak", data: {streakCount: newStreakCount}});
        }
    };

    const updatePalaceProgress = (palaceId: string, progress: number) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) =>
                palace.id === palaceId ? {...palace, progress} : palace,
            ),
        }));
    };

    // --- Notifications ------------------------------------------------------

    /** Append a notification to the persistent log (newest first, capped). */
    const pushNotification = (draft: NotificationDraft) => {
        setState((prev) => ({
            ...prev,
            notifications: appendNotifications(prev.notifications, [draft]),
        }));
    };

    const markAllNotificationsRead = () => {
        setState((prev) =>
            prev.notifications.every((n) => n.read)
                ? prev
                : {
                    ...prev,
                    notifications: prev.notifications.map((n) => ({
                        ...n,
                        read: true,
                    })),
                },
        );
    };

    const removeNotification = (id: string) => {
        setState((prev) => ({
            ...prev,
            notifications: prev.notifications.filter((n) => n.id !== id),
        }));
    };

    /** Empty the entire notification log. */
    const clearNotifications = () => {
        setState((prev) => ({...prev, notifications: []}));
    };

    const resetProgress = () => {
        setState(DEFAULT_STATE);
    };

    // --- Developer tools ----------------------------------------------------

    /** Set XP directly and recompute the derived level. */
    const setUserXP = (xp: number) => {
        const safe = Math.max(0, Math.round(xp));
        setState((prev) => ({
            ...prev,
            userXP: safe,
            currentLevel: calculateLevel(safe).currentLevel,
        }));
    };

    const setStreak = (count: number) => {
        setState((prev) => ({...prev, streakCount: Math.max(0, Math.round(count))}));
    };

    const clearTrainingDays = () => {
        setState((prev) => ({
            ...prev,
            trainingDays: [],
            lastTrainingDate: null,
            streakCount: 0,
        }));
    };

    /** Replace the whole persisted state (used by the debug import tool). */
    const replaceState = (next: ProgressState) => {
        setState(migrateState(next));
    };

    // --- Palaces ------------------------------------------------------------

    const createPalace = (
        palaceData: Omit<
            Palace,
            | "id"
            | "progress"
            | "roomsCompleted"
            | "totalRooms"
            | "createdAt"
            | "updatedAt"
        >,
    ) => {
        const now = new Date().toISOString();
        const newPalace: Palace = {
            ...palaceData,
            id: genId("palace"),
            progress: 0,
            roomsCompleted: 0,
            totalRooms: 0,
            createdAt: now,
            updatedAt: now,
            rooms: palaceData.rooms || [],
            settings: palaceData.settings || {...DEFAULT_SETTINGS},
        };
        setState((prev) => ({...prev, palaces: [...prev.palaces, newPalace]}));
        return newPalace.id;
    };

    const updatePalace = (
        palaceId: string,
        updates: Partial<Omit<Palace, "id" | "createdAt">>,
    ) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) =>
                palace.id === palaceId
                    ? {...palace, ...updates, updatedAt: new Date().toISOString()}
                    : palace,
            ),
        }));
    };

    const updatePalaceSettings = (
        palaceId: string,
        updates: Partial<PalaceSettings>,
    ) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) =>
                palace.id === palaceId
                    ? {
                        ...palace,
                        settings: {...palaceSettings(palace), ...updates},
                        updatedAt: new Date().toISOString(),
                    }
                    : palace,
            ),
        }));
    };

    /** Clear completion/progress for every room without deleting content. */
    const resetPalaceProgress = (palaceId: string) => {
        setState((prev) => {
            const updatedPalaces = prev.palaces.map((palace) => {
                if (palace.id !== palaceId) return palace;
                const rooms = (palace.rooms || []).map((room, i) => ({
                    ...room,
                    isCompleted: false,
                    isUnlocked: i === 0,
                    progress: 0,
                }));
                return withRoomStats({
                    ...palace,
                    rooms,
                    updatedAt: new Date().toISOString(),
                });
            });
            return {
                ...prev,
                palaces: updatedPalaces,
                ...recomputeTotals(updatedPalaces),
            };
        });
    };

    const deletePalace = (palaceId: string) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.filter((palace) => palace.id !== palaceId),
        }));
    };

    /** Deep-clone a palace (rooms, loci, questions) with fresh ids and reset
     *  completion, appending it. Returns the new palace id. */
    const duplicatePalace = (palaceId: string) => {
        let newId = "";
        setState((prev) => {
            const original = prev.palaces.find((p) => p.id === palaceId);
            if (!original) return prev;
            newId = genId("palace");
            const now = new Date().toISOString();
            const clone: Palace = withRoomStats({
                ...original,
                id: newId,
                name: `${original.name} (Copy)`,
                favorite: false,
                archived: false,
                createdAt: now,
                updatedAt: now,
                rooms: (original.rooms || []).map((room, idx) => ({
                    ...room,
                    id: genId("room"),
                    isCompleted: false,
                    isUnlocked: idx === 0,
                    progress: 0,
                    loci: (room.loci || []).map((l) => ({
                        ...l,
                        id: genId("locus"),
                        srs: undefined, // a copy starts unscheduled
                    })),
                    questions: (room.questions || []).map((q) => ({
                        ...q,
                        id: genId("q"),
                    })),
                })),
            });
            return {...prev, palaces: [...prev.palaces, clone]};
        });
        return newId;
    };

    const togglePalaceFavorite = (palaceId: string) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((p) =>
                p.id === palaceId ? {...p, favorite: !p.favorite} : p,
            ),
        }));
    };

    const togglePalaceArchived = (palaceId: string) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((p) =>
                p.id === palaceId
                    ? {...p, archived: !p.archived, favorite: false}
                    : p,
            ),
        }));
    };

    const setPalaceFolder = (palaceId: string, folderId: string | null) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((p) =>
                p.id === palaceId ? {...p, folderId} : p,
            ),
        }));
    };

    // --- Rooms --------------------------------------------------------------

    const createRoom = (palaceId: string, roomData: Omit<Room, "id">) => {
        const newRoom: Room = {...roomData, id: genId("room")};
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) =>
                palace.id === palaceId
                    ? withRoomStats({
                        ...palace,
                        rooms: [...(palace.rooms || []), newRoom],
                        updatedAt: new Date().toISOString(),
                    })
                    : palace,
            ),
        }));
        return newRoom.id;
    };

    const updateRoom = (
        palaceId: string,
        roomId: string,
        updates: Partial<Omit<Room, "id">>,
    ) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) =>
                palace.id === palaceId
                    ? withRoomStats({
                        ...palace,
                        rooms: (palace.rooms || []).map((room) =>
                            room.id === roomId ? {...room, ...updates} : room,
                        ),
                        updatedAt: new Date().toISOString(),
                    })
                    : palace,
            ),
        }));
    };

    const deleteRoom = (palaceId: string, roomId: string) => {
        setState((prev) => {
            const updatedPalaces = prev.palaces.map((palace) =>
                palace.id === palaceId
                    ? withRoomStats({
                        ...palace,
                        rooms: (palace.rooms || []).filter(
                            (room) => room.id !== roomId,
                        ),
                        updatedAt: new Date().toISOString(),
                    })
                    : palace,
            );
            return {
                ...prev,
                palaces: updatedPalaces,
                ...recomputeTotals(updatedPalaces),
            };
        });
    };

    /** Move a room one slot up or down within its palace. */
    const moveRoom = (
        palaceId: string,
        roomId: string,
        direction: "up" | "down",
    ) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) => {
                if (palace.id !== palaceId) return palace;
                const rooms = [...(palace.rooms || [])];
                const i = rooms.findIndex((r) => r.id === roomId);
                const j = direction === "up" ? i - 1 : i + 1;
                if (i < 0 || j < 0 || j >= rooms.length) return palace;
                [rooms[i], rooms[j]] = [rooms[j], rooms[i]];
                return {
                    ...palace,
                    rooms: rooms.map((r, idx) => ({...r, order: idx + 1})),
                    updatedAt: new Date().toISOString(),
                };
            }),
        }));
    };

    // --- Room content: loci & questions ------------------------------------

    /** Apply `fn` to a single room, bumping the palace's updatedAt. */
    const mutateRoom = (
        palaceId: string,
        roomId: string,
        fn: (room: Room) => Room,
    ) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) =>
                palace.id === palaceId
                    ? {
                        ...palace,
                        rooms: (palace.rooms || []).map((room) =>
                            room.id === roomId ? fn(room) : room,
                        ),
                        updatedAt: new Date().toISOString(),
                    }
                    : palace,
            ),
        }));
    };

    const createLocus = (
        palaceId: string,
        roomId: string,
        data: Omit<Locus, "id">,
    ) => {
        const locus: Locus = {...data, id: genId("locus")};
        mutateRoom(palaceId, roomId, (room) => ({
            ...room,
            loci: [...(room.loci || []), locus],
        }));
        return locus.id;
    };

    const updateLocus = (
        palaceId: string,
        roomId: string,
        locusId: string,
        updates: Partial<Omit<Locus, "id">>,
    ) => {
        mutateRoom(palaceId, roomId, (room) => ({
            ...room,
            loci: (room.loci || []).map((l) =>
                l.id === locusId ? {...l, ...updates} : l,
            ),
        }));
    };

    const deleteLocus = (palaceId: string, roomId: string, locusId: string) => {
        mutateRoom(palaceId, roomId, (room) => ({
            ...room,
            loci: (room.loci || []).filter((l) => l.id !== locusId),
        }));
    };

    const createQuestion = (
        palaceId: string,
        roomId: string,
        data: Omit<Question, "id">,
    ) => {
        const question: Question = {...data, id: genId("q")};
        mutateRoom(palaceId, roomId, (room) => ({
            ...room,
            questions: [...(room.questions || []), question],
        }));
        return question.id;
    };

    const updateQuestion = (
        palaceId: string,
        roomId: string,
        questionId: string,
        updates: Partial<Omit<Question, "id">>,
    ) => {
        mutateRoom(palaceId, roomId, (room) => ({
            ...room,
            questions: (room.questions || []).map((q) =>
                q.id === questionId ? {...q, ...updates} : q,
            ),
        }));
    };

    const deleteQuestion = (
        palaceId: string,
        roomId: string,
        questionId: string,
    ) => {
        mutateRoom(palaceId, roomId, (room) => ({
            ...room,
            questions: (room.questions || []).filter((q) => q.id !== questionId),
        }));
    };

    /** Record a spaced-repetition grade for a locus, advancing its schedule. */
    const reviewLocus = (
        palaceId: string,
        roomId: string,
        locusId: string,
        grade: Grade,
    ) => {
        mutateRoom(palaceId, roomId, (room) => ({
            ...room,
            loci: (room.loci || []).map((l) =>
                l.id === locusId ? {...l, srs: schedule(l.srs, grade)} : l,
            ),
        }));
    };

    /** Toggle a locus's "flagged" marker (used by in-study tools). */
    const toggleLocusFlag = (palaceId: string, roomId: string, locusId: string) => {
        mutateRoom(palaceId, roomId, (room) => ({
            ...room,
            loci: (room.loci || []).map((l) =>
                l.id === locusId ? {...l, flagged: !l.flagged} : l,
            ),
        }));
    };

    /** Delete many loci at once (bulk select). */
    const deleteLoci = (palaceId: string, roomId: string, ids: string[]) => {
        const remove = new Set(ids);
        mutateRoom(palaceId, roomId, (room) => ({
            ...room,
            loci: (room.loci || []).filter((l) => !remove.has(l.id)),
        }));
    };

    /** Delete many questions at once (bulk select). */
    const deleteQuestions = (palaceId: string, roomId: string, ids: string[]) => {
        const remove = new Set(ids);
        mutateRoom(palaceId, roomId, (room) => ({
            ...room,
            questions: (room.questions || []).filter((q) => !remove.has(q.id)),
        }));
    };

    /** Clear the spaced-repetition schedule for the given loci (back to "new"). */
    const resetLociSrs = (palaceId: string, roomId: string, ids: string[]) => {
        const target = new Set(ids);
        mutateRoom(palaceId, roomId, (room) => ({
            ...room,
            loci: (room.loci || []).map((l) =>
                target.has(l.id) ? {...l, srs: undefined} : l,
            ),
        }));
    };

    /** Force the given loci into a long-interval "known" schedule. */
    const markLociKnown = (palaceId: string, roomId: string, ids: string[]) => {
        const target = new Set(ids);
        mutateRoom(palaceId, roomId, (room) => ({
            ...room,
            loci: (room.loci || []).map((l) =>
                target.has(l.id) ? {...l, srs: markKnown(l.srs)} : l,
            ),
        }));
    };

    /** Insert a copy of a locus right after the original, unscheduled. */
    const duplicateLocus = (palaceId: string, roomId: string, locusId: string) => {
        mutateRoom(palaceId, roomId, (room) => {
            const loci = room.loci || [];
            const i = loci.findIndex((l) => l.id === locusId);
            if (i < 0) return room;
            const copy: Locus = {...loci[i], id: genId("locus"), srs: undefined};
            return {...room, loci: [...loci.slice(0, i + 1), copy, ...loci.slice(i + 1)]};
        });
    };

    const duplicateQuestion = (
        palaceId: string,
        roomId: string,
        questionId: string,
    ) => {
        mutateRoom(palaceId, roomId, (room) => {
            const questions = room.questions || [];
            const i = questions.findIndex((q) => q.id === questionId);
            if (i < 0) return room;
            const copy: Question = {...questions[i], id: genId("q")};
            return {
                ...room,
                questions: [
                    ...questions.slice(0, i + 1),
                    copy,
                    ...questions.slice(i + 1),
                ],
            };
        });
    };

    /** Move a locus one slot up or down within its room. */
    const moveLocus = (
        palaceId: string,
        roomId: string,
        locusId: string,
        direction: "up" | "down",
    ) => {
        mutateRoom(palaceId, roomId, (room) => {
            const loci = [...(room.loci || [])];
            const i = loci.findIndex((l) => l.id === locusId);
            const j = direction === "up" ? i - 1 : i + 1;
            if (i < 0 || j < 0 || j >= loci.length) return room;
            [loci[i], loci[j]] = [loci[j], loci[i]];
            return {...room, loci};
        });
    };

    const moveQuestion = (
        palaceId: string,
        roomId: string,
        questionId: string,
        direction: "up" | "down",
    ) => {
        mutateRoom(palaceId, roomId, (room) => {
            const questions = [...(room.questions || [])];
            const i = questions.findIndex((q) => q.id === questionId);
            const j = direction === "up" ? i - 1 : i + 1;
            if (i < 0 || j < 0 || j >= questions.length) return room;
            [questions[i], questions[j]] = [questions[j], questions[i]];
            return {...room, questions};
        });
    };

    /**
     * Bulk-add imported content to a room. `merge` appends, `replace` swaps the
     * whole set. Incoming items always get fresh ids so imports never collide.
     */
    const importRoomContent = (
        palaceId: string,
        roomId: string,
        content: {loci?: Locus[]; questions?: Question[]},
        mode: "merge" | "replace",
    ) => {
        const incomingLoci = (content.loci || []).map((l) => ({
            ...l,
            id: genId("locus"),
        }));
        const incomingQuestions = (content.questions || []).map((q) => ({
            ...q,
            id: genId("q"),
        }));
        mutateRoom(palaceId, roomId, (room) => ({
            ...room,
            loci:
                mode === "replace"
                    ? incomingLoci
                    : [...(room.loci || []), ...incomingLoci],
            questions:
                mode === "replace"
                    ? incomingQuestions
                    : [...(room.questions || []), ...incomingQuestions],
        }));
        return {
            loci: incomingLoci.length,
            questions: incomingQuestions.length,
        };
    };

    // --- Folders ------------------------------------------------------------

    const createFolder = (data: Omit<Folder, "id" | "createdAt">) => {
        const folder: Folder = {
            ...data,
            id: genId("folder"),
            createdAt: new Date().toISOString(),
        };
        setState((prev) => ({
            ...prev,
            folders: [...(prev.folders || []), folder],
        }));
        return folder.id;
    };

    const updateFolder = (
        folderId: string,
        updates: Partial<Omit<Folder, "id" | "createdAt">>,
    ) => {
        setState((prev) => ({
            ...prev,
            folders: (prev.folders || []).map((f) =>
                f.id === folderId ? {...f, ...updates} : f,
            ),
        }));
    };

    /** Delete a folder and detach (do not delete) any palaces inside it. */
    const deleteFolder = (folderId: string) => {
        setState((prev) => ({
            ...prev,
            folders: (prev.folders || []).filter((f) => f.id !== folderId),
            palaces: prev.palaces.map((p) =>
                p.folderId === folderId ? {...p, folderId: null} : p,
            ),
        }));
    };

    return {
        state,
        actions: {
            addXP,
            completeRoom,
            recordTrainingDay,
            updatePalaceProgress,
            pushNotification,
            markAllNotificationsRead,
            removeNotification,
            clearNotifications,
            resetProgress,
            setUserXP,
            setStreak,
            clearTrainingDays,
            replaceState,
            createPalace,
            updatePalace,
            updatePalaceSettings,
            resetPalaceProgress,
            deletePalace,
            duplicatePalace,
            togglePalaceFavorite,
            togglePalaceArchived,
            setPalaceFolder,
            createRoom,
            updateRoom,
            deleteRoom,
            moveRoom,
            createLocus,
            updateLocus,
            deleteLocus,
            duplicateLocus,
            moveLocus,
            reviewLocus,
            toggleLocusFlag,
            deleteLoci,
            deleteQuestions,
            resetLociSrs,
            markLociKnown,
            createQuestion,
            updateQuestion,
            deleteQuestion,
            duplicateQuestion,
            moveQuestion,
            importRoomContent,
            createFolder,
            updateFolder,
            deleteFolder,
        },
    };
}

export type ProgressEvent = {
    type:
        | "xp-gain"
        | "level-up"
        | "streak"
        | "room-complete"
        | "palace-complete";
    data: {
        xpGain?: number;
        newLevel?: number;
        streakCount?: number;
        palaceName?: string;
    };
};
