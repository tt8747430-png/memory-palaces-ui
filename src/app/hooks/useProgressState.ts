import {useLocalStorage} from "./useLocalStorage";
import {calculateLevel} from "./useSaveStatus";

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
}

export interface ProgressState {
    userXP: number;
    currentLevel: number;
    streakCount: number;
    lastTrainingDate: string | null;
    palaces: Palace[];
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
        },
    };
}