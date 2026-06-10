import {useLocalStorage} from "./useLocalStorage";
import {calculateLevel} from "./useSaveStatus";

/** Stable, collision-resistant id with a readable prefix. */
function genId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/** A single study card: a prompt (front) and what it should recall (back). */
export interface Flashcard {
    id: string;
    front: string;
    back: string;
    /** Optional method-of-loci cue: the image to picture in the room. */
    hint?: string;
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
    flashcards?: Flashcard[];
    questions?: Question[];
}

export interface Floor {
    id: string;
    title: string;
    description: string;
    rooms: Room[];
    order: number;
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
    floors?: Floor[];
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
    hasNotifications: boolean;
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

/**
 * Recompute a palace's room-derived stats from its floors. Every mutation that
 * adds, edits, or removes rooms (including deleting a whole floor) must go
 * through this, or `totalRooms` / `roomsCompleted` / `progress` drift from the
 * real structure.
 */
function withRoomStats(palace: Palace): Palace {
    const rooms = (palace.floors || []).flatMap((floor) => floor.rooms);
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
            floors: [],
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
            floors: [],
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
            floors: [],
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
            floors: [],
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
            floors: [],
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
            floors: [],
        },
    ],
    folders: [],
    trainingDays: [],
    currentProgress: 65,
    totalRoomsCompleted: 87,
    hasNotifications: true,
};

export function useProgressState(
    onEvent?: (event: ProgressEvent) => void,
) {
    const [state, setState] = useLocalStorage<ProgressState>(
        "memory-palace-progress",
        DEFAULT_STATE,
    );

    const addXP = (amount: number) => {
        setState((prev) => {
            const oldLevel = prev.currentLevel;
            const newXP = prev.userXP + amount;
            const {currentLevel: newLevel} = calculateLevel(newXP);

            // Emit events
            onEvent?.({type: "xp-gain", data: {xpGain: amount}});

            if (newLevel > oldLevel) {
                onEvent?.({
                    type: "level-up",
                    data: {newLevel, xpGain: amount},
                });
            }

            return {
                ...prev,
                userXP: newXP,
                currentLevel: newLevel,
            };
        });
    };

    const completeRoom = (palaceId: string) => {
        let palaceName = "";
        let isPalaceComplete = false;

        setState((prev) => {
            const updatedPalaces = prev.palaces.map((palace) => {
                if (
                    palace.id === palaceId &&
                    palace.roomsCompleted < palace.totalRooms
                ) {
                    const newRoomsCompleted = palace.roomsCompleted + 1;
                    const newProgress = Math.round(
                        (newRoomsCompleted / palace.totalRooms) * 100,
                    );
                    palaceName = palace.name;
                    isPalaceComplete = newProgress === 100;

                    return {
                        ...palace,
                        roomsCompleted: newRoomsCompleted,
                        progress: newProgress,
                    };
                }
                return palace;
            });

            const totalRooms = updatedPalaces.reduce(
                (sum, p) => sum + p.roomsCompleted,
                0,
            );
            const totalPossibleRooms = updatedPalaces.reduce(
                (sum, p) => sum + p.totalRooms,
                0,
            );
            const overallProgress = Math.round(
                (totalRooms / totalPossibleRooms) * 100,
            );

            return {
                ...prev,
                palaces: updatedPalaces,
                totalRoomsCompleted: totalRooms,
                currentProgress: overallProgress,
            };
        });

        // Emit events
        onEvent?.({type: "room-complete", data: {palaceName}});

        if (isPalaceComplete) {
            onEvent?.({
                type: "palace-complete",
                data: {palaceName},
            });
        }

        addXP(50);
    };

    const recordTrainingDay = () => {
        const today = new Date().toISOString().split("T")[0];
        let newStreakCount = 0;
        let isNewStreak = false;

        setState((prev) => {
            if (prev.trainingDays.includes(today)) {
                return prev;
            }

            const newTrainingDays = [
                ...prev.trainingDays,
                today,
            ].slice(-7);

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday
                .toISOString()
                .split("T")[0];

            const isConsecutive =
                prev.lastTrainingDate === yesterdayStr ||
                prev.lastTrainingDate === today;
            newStreakCount = isConsecutive ? prev.streakCount + 1 : 1;
            isNewStreak =
                isConsecutive && newStreakCount > prev.streakCount;

            return {
                ...prev,
                trainingDays: newTrainingDays,
                lastTrainingDate: today,
                streakCount: newStreakCount,
            };
        });

        // Emit streak event if it increased
        if (isNewStreak && newStreakCount > 1) {
            onEvent?.({
                type: "streak",
                data: {streakCount: newStreakCount},
            });
        }
    };

    const updatePalaceProgress = (
        palaceId: string,
        progress: number,
    ) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) =>
                palace.id === palaceId
                    ? {...palace, progress}
                    : palace,
            ),
        }));
    };

    const clearNotifications = () => {
        setState((prev) => ({...prev, hasNotifications: false}));
    };

    const resetProgress = () => {
        setState(DEFAULT_STATE);
    };

    const createPalace = (palaceData: Omit<Palace, 'id' | 'progress' | 'roomsCompleted' | 'createdAt' | 'updatedAt'>) => {
        const newPalace: Palace = {
            ...palaceData,
            id: `palace-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            progress: 0,
            roomsCompleted: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            floors: palaceData.floors || [],
        };

        setState((prev) => ({
            ...prev,
            palaces: [...prev.palaces, newPalace],
        }));

        return newPalace.id;
    };

    const updatePalace = (palaceId: string, updates: Partial<Omit<Palace, 'id' | 'createdAt'>>) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) =>
                palace.id === palaceId
                    ? {...palace, ...updates, updatedAt: new Date().toISOString()}
                    : palace
            ),
        }));
    };

    const deletePalace = (palaceId: string) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.filter((palace) => palace.id !== palaceId),
        }));
    };

    const createFloor = (palaceId: string, floorData: Omit<Floor, 'id' | 'rooms'>) => {
        const newFloor: Floor = {
            ...floorData,
            id: `floor-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            rooms: [],
        };

        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) =>
                palace.id === palaceId
                    ? {
                        ...palace,
                        floors: [...(palace.floors || []), newFloor],
                        updatedAt: new Date().toISOString(),
                    }
                    : palace
            ),
        }));

        return newFloor.id;
    };

    const updateFloor = (palaceId: string, floorId: string, updates: Partial<Omit<Floor, 'id' | 'rooms'>>) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) =>
                palace.id === palaceId
                    ? {
                        ...palace,
                        floors: (palace.floors || []).map((floor) =>
                            floor.id === floorId ? {...floor, ...updates} : floor
                        ),
                        updatedAt: new Date().toISOString(),
                    }
                    : palace
            ),
        }));
    };

    const deleteFloor = (palaceId: string, floorId: string) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) =>
                palace.id === palaceId
                    ? withRoomStats({
                        ...palace,
                        floors: (palace.floors || []).filter((floor) => floor.id !== floorId),
                        updatedAt: new Date().toISOString(),
                    })
                    : palace
            ),
        }));
    };

    const createRoom = (palaceId: string, floorId: string, roomData: Omit<Room, 'id'>) => {
        const newRoom: Room = {
            ...roomData,
            id: `room-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        };

        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) =>
                palace.id === palaceId
                    ? withRoomStats({
                        ...palace,
                        floors: (palace.floors || []).map((floor) =>
                            floor.id === floorId
                                ? {...floor, rooms: [...floor.rooms, newRoom]}
                                : floor
                        ),
                        updatedAt: new Date().toISOString(),
                    })
                    : palace
            ),
        }));

        return newRoom.id;
    };

    const updateRoom = (palaceId: string, floorId: string, roomId: string, updates: Partial<Omit<Room, 'id'>>) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) =>
                palace.id === palaceId
                    ? withRoomStats({
                        ...palace,
                        floors: (palace.floors || []).map((floor) =>
                            floor.id === floorId
                                ? {
                                    ...floor,
                                    rooms: floor.rooms.map((room) =>
                                        room.id === roomId ? {...room, ...updates} : room
                                    ),
                                }
                                : floor
                        ),
                        updatedAt: new Date().toISOString(),
                    })
                    : palace
            ),
        }));
    };

    const deleteRoom = (palaceId: string, floorId: string, roomId: string) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) =>
                palace.id === palaceId
                    ? withRoomStats({
                        ...palace,
                        floors: (palace.floors || []).map((floor) =>
                            floor.id === floorId
                                ? {...floor, rooms: floor.rooms.filter((room) => room.id !== roomId)}
                                : floor
                        ),
                        updatedAt: new Date().toISOString(),
                    })
                    : palace
            ),
        }));
    };

    // --- Room content: flashcards & questions ------------------------------

    /** Apply `fn` to a single room, bumping the palace's updatedAt. */
    const mutateRoom = (
        palaceId: string,
        floorId: string,
        roomId: string,
        fn: (room: Room) => Room,
    ) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) =>
                palace.id === palaceId
                    ? {
                        ...palace,
                        floors: (palace.floors || []).map((floor) =>
                            floor.id === floorId
                                ? {
                                    ...floor,
                                    rooms: floor.rooms.map((room) =>
                                        room.id === roomId ? fn(room) : room,
                                    ),
                                }
                                : floor,
                        ),
                        updatedAt: new Date().toISOString(),
                    }
                    : palace,
            ),
        }));
    };

    const createFlashcard = (
        palaceId: string,
        floorId: string,
        roomId: string,
        data: Omit<Flashcard, "id">,
    ) => {
        const card: Flashcard = {...data, id: genId("card")};
        mutateRoom(palaceId, floorId, roomId, (room) => ({
            ...room,
            flashcards: [...(room.flashcards || []), card],
        }));
        return card.id;
    };

    const updateFlashcard = (
        palaceId: string,
        floorId: string,
        roomId: string,
        cardId: string,
        updates: Partial<Omit<Flashcard, "id">>,
    ) => {
        mutateRoom(palaceId, floorId, roomId, (room) => ({
            ...room,
            flashcards: (room.flashcards || []).map((c) =>
                c.id === cardId ? {...c, ...updates} : c,
            ),
        }));
    };

    const deleteFlashcard = (
        palaceId: string,
        floorId: string,
        roomId: string,
        cardId: string,
    ) => {
        mutateRoom(palaceId, floorId, roomId, (room) => ({
            ...room,
            flashcards: (room.flashcards || []).filter((c) => c.id !== cardId),
        }));
    };

    const createQuestion = (
        palaceId: string,
        floorId: string,
        roomId: string,
        data: Omit<Question, "id">,
    ) => {
        const question: Question = {...data, id: genId("q")};
        mutateRoom(palaceId, floorId, roomId, (room) => ({
            ...room,
            questions: [...(room.questions || []), question],
        }));
        return question.id;
    };

    const updateQuestion = (
        palaceId: string,
        floorId: string,
        roomId: string,
        questionId: string,
        updates: Partial<Omit<Question, "id">>,
    ) => {
        mutateRoom(palaceId, floorId, roomId, (room) => ({
            ...room,
            questions: (room.questions || []).map((q) =>
                q.id === questionId ? {...q, ...updates} : q,
            ),
        }));
    };

    const deleteQuestion = (
        palaceId: string,
        floorId: string,
        roomId: string,
        questionId: string,
    ) => {
        mutateRoom(palaceId, floorId, roomId, (room) => ({
            ...room,
            questions: (room.questions || []).filter((q) => q.id !== questionId),
        }));
    };

    /**
     * Bulk-add imported content to a room. `merge` appends, `replace` swaps the
     * whole set. Incoming items always get fresh ids so imports never collide
     * with existing content or with each other.
     */
    const importRoomContent = (
        palaceId: string,
        floorId: string,
        roomId: string,
        content: {flashcards?: Flashcard[]; questions?: Question[]},
        mode: "merge" | "replace",
    ) => {
        const incomingCards = (content.flashcards || []).map((c) => ({
            ...c,
            id: genId("card"),
        }));
        const incomingQuestions = (content.questions || []).map((q) => ({
            ...q,
            id: genId("q"),
        }));
        mutateRoom(palaceId, floorId, roomId, (room) => ({
            ...room,
            flashcards:
                mode === "replace"
                    ? incomingCards
                    : [...(room.flashcards || []), ...incomingCards],
            questions:
                mode === "replace"
                    ? incomingQuestions
                    : [...(room.questions || []), ...incomingQuestions],
        }));
        return {
            cards: incomingCards.length,
            questions: incomingQuestions.length,
        };
    };

    // --- Palace management --------------------------------------------------

    /** Deep-clone a palace (floors, rooms, cards, questions) with fresh ids and
     *  reset completion, appending it to the list. Returns the new palace id. */
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
                floors: (original.floors || []).map((floor) => ({
                    ...floor,
                    id: genId("floor"),
                    rooms: floor.rooms.map((room, idx) => ({
                        ...room,
                        id: genId("room"),
                        isCompleted: false,
                        isUnlocked: idx === 0,
                        progress: 0,
                        flashcards: (room.flashcards || []).map((c) => ({
                            ...c,
                            id: genId("card"),
                        })),
                        questions: (room.questions || []).map((q) => ({
                            ...q,
                            id: genId("q"),
                        })),
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

    /** Move a floor one slot up or down, keeping `order` fields in sync. */
    const moveFloor = (
        palaceId: string,
        floorId: string,
        direction: "up" | "down",
    ) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) => {
                if (palace.id !== palaceId) return palace;
                const floors = [...(palace.floors || [])];
                const i = floors.findIndex((f) => f.id === floorId);
                const j = direction === "up" ? i - 1 : i + 1;
                if (i < 0 || j < 0 || j >= floors.length) return palace;
                [floors[i], floors[j]] = [floors[j], floors[i]];
                return {
                    ...palace,
                    floors: floors.map((f, idx) => ({...f, order: idx + 1})),
                    updatedAt: new Date().toISOString(),
                };
            }),
        }));
    };

    /** Move a room one slot up or down within its floor. */
    const moveRoom = (
        palaceId: string,
        floorId: string,
        roomId: string,
        direction: "up" | "down",
    ) => {
        setState((prev) => ({
            ...prev,
            palaces: prev.palaces.map((palace) => {
                if (palace.id !== palaceId) return palace;
                return {
                    ...palace,
                    floors: (palace.floors || []).map((floor) => {
                        if (floor.id !== floorId) return floor;
                        const rooms = [...floor.rooms];
                        const i = rooms.findIndex((r) => r.id === roomId);
                        const j = direction === "up" ? i - 1 : i + 1;
                        if (i < 0 || j < 0 || j >= rooms.length) return floor;
                        [rooms[i], rooms[j]] = [rooms[j], rooms[i]];
                        return {
                            ...floor,
                            rooms: rooms.map((r, idx) => ({...r, order: idx + 1})),
                        };
                    }),
                    updatedAt: new Date().toISOString(),
                };
            }),
        }));
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
            clearNotifications,
            resetProgress,
            createPalace,
            updatePalace,
            deletePalace,
            createFloor,
            updateFloor,
            deleteFloor,
            createRoom,
            updateRoom,
            deleteRoom,
            createFlashcard,
            updateFlashcard,
            deleteFlashcard,
            createQuestion,
            updateQuestion,
            deleteQuestion,
            importRoomContent,
            duplicatePalace,
            togglePalaceFavorite,
            togglePalaceArchived,
            setPalaceFolder,
            moveFloor,
            moveRoom,
            createFolder,
            updateFolder,
            deleteFolder,
        },
    };
}