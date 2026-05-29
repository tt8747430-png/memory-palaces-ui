import {useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {ArrowLeft, CheckCircle, Clock, Edit2, Folder, Lock, Plus, Trash2,} from "lucide-react";
import {StatusBar} from "../ui/StatusBar";
import {DynamicBackground} from "../DynamicBackground";
import {AmbientParticles} from "../AmbientParticles";
import {useProgressState} from "../../hooks/useProgressState";

interface RoomManagementScreenProps {
    palaceId: string;
    onBack: () => void;
    onCreateFloor: () => void;
    onCreateRoom: (floorId: string) => void;
    onEditRoom: (floorId: string, roomId: string) => void;
}

export function RoomManagementScreen({
                                         palaceId,
                                         onBack,
                                         onCreateFloor,
                                         onCreateRoom,
                                         onEditRoom,
                                     }: RoomManagementScreenProps) {
    const {state, actions} = useProgressState();
    const palace = state.palaces.find((p) => p.id === palaceId);
    const [expandedFloors, setExpandedFloors] = useState<string[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
        type: "floor" | "room";
        id: string;
        floorId?: string;
    } | null>(null);

    if (!palace) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-body text-[#6B7280]">Palace not found</p>
            </div>
        );
    }

    const floors = palace.floors || [];

    const toggleFloor = (floorId: string) => {
        setExpandedFloors((prev) =>
            prev.includes(floorId)
                ? prev.filter((id) => id !== floorId)
                : [...prev, floorId]
        );
    };

    const handleDeleteFloor = (floorId: string) => {
        actions.deleteFloor(palaceId, floorId);
        setShowDeleteConfirm(null);
    };

    const handleDeleteRoom = (floorId: string, roomId: string) => {
        actions.deleteRoom(palaceId, floorId, roomId);
        setShowDeleteConfirm(null);
    };

    return (
        <div className="size-full flex flex-col relative">
            <DynamicBackground/>
            <AmbientParticles/>

            <div className="relative z-10 flex-1 flex flex-col">
                <div
                    className="bg-gradient-to-b from-[#091A7A]/95 to-[#4F8EFF]/95 relative flex-shrink-0 backdrop-blur-md">
                    <div
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]"/>

                    <div className="relative z-10">
                        <StatusBar textColor="white"/>
                    </div>

                    <div className="px-6 pt-3 pb-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={onBack}
                                className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
                            >
                                <ArrowLeft className="w-5 h-5 text-white"/>
                            </motion.button>

                            <div className="flex-1 text-center">
                                <h1 className="text-[18px] font-bold text-white">Room Management</h1>
                                <p className="text-white/70 text-[13px] mt-1">{palace.name}</p>
                            </div>

                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={onCreateFloor}
                                className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
                            >
                                <Plus className="w-6 h-6 text-white"/>
                            </motion.button>
                        </div>

                        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/70 text-[13px]">Total Floors</p>
                                    <p className="text-white text-[20px] font-bold">{floors.length}</p>
                                </div>
                                <div>
                                    <p className="text-white/70 text-[13px]">Total Rooms</p>
                                    <p className="text-white text-[20px] font-bold">{palace.totalRooms}</p>
                                </div>
                                <div>
                                    <p className="text-white/70 text-[13px]">Progress</p>
                                    <p className="text-white text-[20px] font-bold">{palace.progress}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-6 pb-24">
                    {floors.length === 0 ? (
                        <motion.div
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            className="flex flex-col items-center justify-center py-20 px-6"
                        >
                            <div className="text-6xl mb-4">📁</div>
                            <h3 className="text-xl font-bold text-[#000000] mb-2">
                                No floors yet
                            </h3>
                            <p className="text-[15px] text-[#86868B] text-center mb-6">
                                Create your first floor to organize rooms in this palace
                            </p>
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={onCreateFloor}
                                className="px-6 py-3 bg-[#007AFF] text-white rounded-full font-semibold shadow-lg flex items-center gap-2"
                            >
                                <Plus size={20}/>
                                Create Floor
                            </motion.button>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {floors.map((floor, floorIndex) => {
                                const isExpanded = expandedFloors.includes(floor.id);
                                const totalRooms = floor.rooms.length;
                                const completedRooms = floor.rooms.filter((r) => r.isCompleted).length;
                                const floorProgress = totalRooms > 0 ? Math.round((completedRooms / totalRooms) * 100) : 0;

                                return (
                                    <motion.div
                                        key={floor.id}
                                        initial={{opacity: 0, y: 20}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{delay: floorIndex * 0.05}}
                                        className="bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-card border border-white/60"
                                    >
                                        <div className="p-5">
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className="w-12 h-12 bg-gradient-to-br from-[#007AFF] to-[#0051D5] rounded-2xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[18px] font-bold">
                            {floor.order}
                          </span>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="text-[17px] font-semibold text-[#000000] mb-1">
                                                                {floor.title}
                                                            </h3>
                                                            <p className="text-[14px] text-[#86868B]">
                                                                {floor.description}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 mb-3">
                            <span className="text-[13px] text-[#86868B]">
                              {totalRooms} {totalRooms === 1 ? "room" : "rooms"}
                            </span>
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-16 h-1.5 bg-[#F5F5F7] rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-[#007AFF] rounded-full transition-all"
                                                                    style={{width: `${floorProgress}%`}}
                                                                />
                                                            </div>
                                                            <span className="text-[12px] font-semibold text-[#007AFF]">
                                {floorProgress}%
                              </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <motion.button
                                                            whileHover={{scale: 1.02}}
                                                            whileTap={{scale: 0.98}}
                                                            onClick={() => onCreateRoom(floor.id)}
                                                            className="px-4 py-2 bg-[#F5F5F7] rounded-xl text-[13px] font-medium text-[#007AFF] flex items-center gap-1"
                                                        >
                                                            <Plus size={14}/>
                                                            Add Room
                                                        </motion.button>

                                                        <motion.button
                                                            whileHover={{scale: 1.02}}
                                                            whileTap={{scale: 0.98}}
                                                            onClick={() => toggleFloor(floor.id)}
                                                            className="px-4 py-2 bg-[#F5F5F7] rounded-xl text-[13px] font-medium text-[#000000] flex items-center gap-1"
                                                        >
                                                            <Folder size={14}/>
                                                            {isExpanded ? "Hide" : "Show"} Rooms
                                                        </motion.button>

                                                        <motion.button
                                                            whileHover={{scale: 1.02}}
                                                            whileTap={{scale: 0.98}}
                                                            onClick={() =>
                                                                setShowDeleteConfirm({
                                                                    type: "floor",
                                                                    id: floor.id,
                                                                })
                                                            }
                                                            className="px-3 py-2 bg-red-50 rounded-xl text-[13px] font-medium text-red-600"
                                                        >
                                                            <Trash2 size={14}/>
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{height: 0, opacity: 0}}
                                                        animate={{height: "auto", opacity: 1}}
                                                        exit={{height: 0, opacity: 0}}
                                                        transition={{duration: 0.3}}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-4 pt-4 border-t border-[#E5E5EA] space-y-3">
                                                            {floor.rooms.length === 0 ? (
                                                                <p className="text-[14px] text-[#86868B] text-center py-4">
                                                                    No rooms in this floor yet
                                                                </p>
                                                            ) : (
                                                                floor.rooms.map((room, roomIndex) => (
                                                                    <motion.div
                                                                        key={room.id}
                                                                        initial={{opacity: 0, x: -10}}
                                                                        animate={{opacity: 1, x: 0}}
                                                                        transition={{delay: roomIndex * 0.05}}
                                                                        className="bg-white/90 rounded-2xl p-4 border border-[#E5E5EA]"
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <div
                                                                                className="w-10 h-10 bg-[#F5F5F7] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-[14px] font-semibold text-[#000000]">
                                          {roomIndex + 1}
                                        </span>
                                                                            </div>

                                                                            <div className="flex-1 min-w-0">
                                                                                <h4 className="text-[15px] font-semibold text-[#000000] mb-1">
                                                                                    {room.title}
                                                                                </h4>
                                                                                <div
                                                                                    className="flex items-center gap-3">
                                                                                    <div
                                                                                        className="flex items-center gap-1">
                                                                                        <Clock size={12}
                                                                                               className="text-[#86868B]"/>
                                                                                        <span
                                                                                            className="text-[12px] text-[#86868B]">
                                              {room.duration} min
                                            </span>
                                                                                    </div>
                                                                                    {room.isCompleted && (
                                                                                        <div
                                                                                            className="flex items-center gap-1">
                                                                                            <CheckCircle size={12}
                                                                                                         className="text-green-600"/>
                                                                                            <span
                                                                                                className="text-[11px] text-green-600 font-medium">
                                                Complete
                                              </span>
                                                                                        </div>
                                                                                    )}
                                                                                    {!room.isUnlocked && (
                                                                                        <div
                                                                                            className="flex items-center gap-1">
                                                                                            <Lock size={12}
                                                                                                  className="text-[#86868B]"/>
                                                                                            <span
                                                                                                className="text-[11px] text-[#86868B]">
                                                Locked
                                              </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex gap-2">
                                                                                <motion.button
                                                                                    whileHover={{scale: 1.1}}
                                                                                    whileTap={{scale: 0.9}}
                                                                                    onClick={() => onEditRoom(floor.id, room.id)}
                                                                                    className="w-8 h-8 bg-[#F5F5F7] rounded-lg flex items-center justify-center"
                                                                                >
                                                                                    <Edit2 size={14}
                                                                                           className="text-[#007AFF]"/>
                                                                                </motion.button>

                                                                                <motion.button
                                                                                    whileHover={{scale: 1.1}}
                                                                                    whileTap={{scale: 0.9}}
                                                                                    onClick={() =>
                                                                                        setShowDeleteConfirm({
                                                                                            type: "room",
                                                                                            id: room.id,
                                                                                            floorId: floor.id,
                                                                                        })
                                                                                    }
                                                                                    className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center"
                                                                                >
                                                                                    <Trash2 size={14}
                                                                                            className="text-red-600"/>
                                                                                </motion.button>
                                                                            </div>
                                                                        </div>

                                                                        {room.progress > 0 && !room.isCompleted && (
                                                                            <div className="mt-3">
                                                                                <div
                                                                                    className="h-1.5 bg-[#F5F5F7] rounded-full overflow-hidden">
                                                                                    <div
                                                                                        className="h-full bg-[#007AFF] rounded-full transition-all"
                                                                                        style={{width: `${room.progress}%`}}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </motion.div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showDeleteConfirm && (
                    <>
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="absolute inset-0 bg-black/40 z-50"
                            onClick={() => setShowDeleteConfirm(null)}
                        />

                        <motion.div
                            initial={{opacity: 0, scale: 0.9, y: 20}}
                            animate={{opacity: 1, scale: 1, y: 0}}
                            exit={{opacity: 0, scale: 0.9, y: 20}}
                            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 shadow-2xl"
                        >
                            <div className="text-center mb-6">
                                <div
                                    className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 size={32} className="text-red-600"/>
                                </div>
                                <h3 className="text-xl font-bold text-[#000000] mb-2">
                                    Delete {showDeleteConfirm.type === "floor" ? "Floor" : "Room"}?
                                </h3>
                                <p className="text-[15px] text-[#86868B]">
                                    {showDeleteConfirm.type === "floor"
                                        ? "This will delete all rooms in this floor. This action cannot be undone."
                                        : "This action cannot be undone."}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="flex-1 py-4 bg-[#F5F5F7] rounded-2xl font-semibold text-[#000000]"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                    onClick={() => {
                                        if (showDeleteConfirm.type === "floor") {
                                            handleDeleteFloor(showDeleteConfirm.id);
                                        } else {
                                            handleDeleteRoom(
                                                showDeleteConfirm.floorId!,
                                                showDeleteConfirm.id
                                            );
                                        }
                                    }}
                                    className="flex-1 py-4 bg-red-600 rounded-2xl font-semibold text-white"
                                >
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
