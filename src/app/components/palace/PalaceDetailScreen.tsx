import {useState} from "react";
import {animate, AnimatePresence, HTMLMotionProps, motion, useMotionValue} from "motion/react";
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  ChevronRight,
  Clock,
  Edit2,
  Lock,
  MoreVertical,
  Play,
  Plus,
  Save,
  Trash2,
  Unlock,
  X,
  Zap,
} from "lucide-react";
import {Floor as StateFloor, Room as StateRoom, useProgressState} from "../../hooks/useProgressState";
import {useDrag} from "@use-gesture/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "../ui/dropdown-menu";
import {EmptyState} from "../ui/EmptyState";
import {Drawer} from "vaul";

interface PalaceDetailScreenProps {
    palaceId: string;
    onBack: () => void;
    onRoomClick?: (roomTitle: string) => void;
    onQuizClick?: () => void;
}

const getCurrentRoom = (floors: StateFloor[]) => {
    for (const floor of floors) {
        for (const room of floor.rooms) {
            if (!room.isCompleted && room.isUnlocked) {
                return {
                    floor: floor.title,
                    room: room.title,
                    progress: room.progress,
                };
            }
        }
    }

    if (floors.length > 0 && floors[0].rooms.length > 0) {
        return {
            floor: floors[0].title,
            room: floors[0].rooms[0].title,
            progress: floors[0].rooms[0].progress,
        };
    }

    return null;
};

interface SwipeableRoomCardProps {
    room: StateRoom;
    roomIndex: number;
    floor: StateFloor;
    onEditRoom: (floorId: string, room: StateRoom) => void;
    onDeleteRoom: (floorId: string, roomId: string) => void;
    onRoomClick?: (roomTitle: string) => void;
}

function SwipeableRoomCard({room, roomIndex, floor, onEditRoom, onDeleteRoom, onRoomClick}: SwipeableRoomCardProps) {
    const x = useMotionValue(0);

    const bind = useDrag(({down, movement: [mx], velocity: [vx], direction: [dx]}) => {
        // Only allow swiping left
        const boundedX = Math.min(0, mx);

        if (down) {
            x.set(boundedX);
        } else {
            if (boundedX < -60 || (vx > 0.5 && dx < 0)) {
                animate(x, -140, {type: "spring", stiffness: 400, damping: 30});
            } else {
                animate(x, 0, {type: "spring", stiffness: 400, damping: 30});
            }
        }
    }, {axis: 'x', filterTaps: true});

    return (
        <motion.div
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{
                delay: roomIndex * 0.06,
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
            }}
            className="relative overflow-hidden rounded-2xl touch-pan-y"
        >
            {/* Hidden Action Buttons behind the card */}
            <div
                className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 gap-3 bg-[#EAF4FF]/70 rounded-2xl w-full">
                <motion.button
                    whileTap={{scale: 0.9}}
                    aria-label={`Edit ${room.title}`}
                    onClick={() => {
                        animate(x, 0);
                        onEditRoom(floor.id, room);
                    }}
                    className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md text-[#091A7A]"
                >
                    <Edit2 size={18}/>
                </motion.button>
                <motion.button
                    whileTap={{scale: 0.9}}
                    aria-label={`Delete ${room.title}`}
                    onClick={() => {
                        animate(x, 0);
                        onDeleteRoom(floor.id, room.id);
                    }}
                    className="w-11 h-11 bg-red-100 rounded-full flex items-center justify-center shadow-md text-red-600"
                >
                    <Trash2 size={18}/>
                </motion.button>
            </div>

            {/* Foreground Card. Drag offset lives solely in the `x` motion value;
                entrance animation is on the wrapper so the two never fight.
                The cast bridges use-gesture's DOM handler types with motion's
                overloaded event props (onAnimationStart etc.); only pointer
                handlers are actually produced by bind(). */}
            <motion.div
                {...(bind() as unknown as HTMLMotionProps<"div">)}
                style={{x}}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-white/70 shadow-card relative z-10 w-full"
            >
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4 flex-1">
                        <div
                            className="w-11 h-11 bg-gradient-to-br from-[#ADC8FF]/40 to-[#ADC8FF]/20 rounded-full flex items-center justify-center border border-white/50">
              <span className="text-small font-semibold text-[#091A7A]">
                {roomIndex + 1}
              </span>
                        </div>

                        <div className="flex-1">
                            <h4 className="text-subheading text-[#091A7A] mb-1.5 font-medium">
                                {room.title}
                            </h4>
                            <p className="text-[12px] text-[#4b5563] mb-2">
                                {room.description}
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-[#4b5563]"/>
                                    <span className="text-small font-medium">
                    {room.duration} min
                  </span>
                                </div>
                                {room.isUnlocked ? (
                                    <div className="flex items-center gap-1">
                                        <Unlock className="w-3.5 h-3.5 text-green-700"/>
                                        <span className="text-[11px] text-green-700 font-medium">
                      Unlocked
                    </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <Lock className="w-3.5 h-3.5 text-[#4b5563]"/>
                                        <span className="text-[11px] text-[#4b5563]">
                      Locked
                    </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {room.isCompleted ? (
                            <div
                                className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center border border-green-200">
                                <CheckCircle className="w-4.5 h-4.5 text-green-600"/>
                            </div>
                        ) : room.isUnlocked ? (
                            <motion.button
                                whileTap={{scale: 0.9}}
                                aria-label={`Start ${room.title}`}
                                onClick={() => onRoomClick?.(room.title)}
                                className="w-11 h-11 bg-[#091A7A] rounded-full flex items-center justify-center shadow-interactive"
                            >
                                <Play className="w-4 h-4 text-white"/>
                            </motion.button>
                        ) : (
                            <div
                                className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200">
                                <Lock className="w-4 h-4 text-gray-400"/>
                            </div>
                        )}
                    </div>
                </div>

                {room.progress > 0 && !room.isCompleted && (
                    <div className="mt-3">
                        <div className="h-2 bg-[#ADC8FF]/25 rounded-full overflow-hidden">
                            <motion.div
                                initial={{width: 0}}
                                animate={{
                                    width: `${room.progress}%`,
                                }}
                                transition={{
                                    delay: 0.3,
                                    duration: 0.8,
                                    ease: "easeOut",
                                }}
                                className="h-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-full"
                            />
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

export function PalaceDetailScreen({
                                       palaceId,
                                       onBack,
                                       onRoomClick,
                                       onQuizClick,
                                   }: PalaceDetailScreenProps) {
    const {state, actions} = useProgressState();
    const [expandedFloors, setExpandedFloors] = useState<string[]>([]);
    const [editingFloorId, setEditingFloorId] = useState<string | null>(null);
    const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
    const [showAddFloor, setShowAddFloor] = useState(false);
    const [showAddRoom, setShowAddRoom] = useState<string | null>(null);
    const [showDeleteFloorConfirm, setShowDeleteFloorConfirm] = useState<string | null>(null);
    const [showDeleteRoomConfirm, setShowDeleteRoomConfirm] = useState<{
        floorId: string;
        roomId: string
    } | null>(null);

    const [floorFormData, setFloorFormData] = useState({title: "", description: ""});
    const [roomFormData, setRoomFormData] = useState({
        title: "",
        description: "",
        duration: 10,
        content: "",
        isUnlocked: true,
    });

    const palace = state.palaces.find((p) => p.id === palaceId);
    const floors = palace?.floors || [];
    const currentRoom = floors.length > 0 ? getCurrentRoom(floors) : null;
    const totalDuration = floors.reduce(
        (sum, floor) =>
            sum + floor.rooms.reduce((s, room) => s + room.duration, 0),
        0,
    );
    const floorToDelete = floors.find((f) => f.id === showDeleteFloorConfirm);
    const roomToDelete = showDeleteRoomConfirm
        ? floors
            .find((f) => f.id === showDeleteRoomConfirm.floorId)
            ?.rooms.find((r) => r.id === showDeleteRoomConfirm.roomId)
        : undefined;

    const toggleFloor = (floorId: string) => {
        setExpandedFloors((prev) =>
            prev.includes(floorId)
                ? prev.filter((id) => id !== floorId)
                : [...prev, floorId],
        );
    };

    const openAddFloor = () => {
        // The add-floor modal shares floorFormData with the inline floor editor;
        // clear both so an in-progress edit never leaks into the new-floor form.
        setEditingFloorId(null);
        setFloorFormData({title: "", description: ""});
        setShowAddFloor(true);
    };

    const handleAddFloor = () => {
        if (!floorFormData.title.trim() || !floorFormData.description.trim()) return;

        actions.createFloor(palaceId, {
            title: floorFormData.title.trim(),
            description: floorFormData.description.trim(),
            order: floors.length + 1,
        });

        setFloorFormData({title: "", description: ""});
        setShowAddFloor(false);
    };

    const handleEditFloor = (floor: StateFloor) => {
        setFloorFormData({title: floor.title, description: floor.description});
        setEditingFloorId(floor.id);
    };

    const handleSaveFloor = (floorId: string) => {
        if (!floorFormData.title.trim() || !floorFormData.description.trim()) return;

        actions.updateFloor(palaceId, floorId, {
            title: floorFormData.title.trim(),
            description: floorFormData.description.trim(),
        });

        setEditingFloorId(null);
        setFloorFormData({title: "", description: ""});
    };

    const handleDeleteFloor = (floorId: string) => {
        actions.deleteFloor(palaceId, floorId);
        setShowDeleteFloorConfirm(null);
    };

    const handleAddRoom = (floorId: string) => {
        if (!roomFormData.title.trim() || !roomFormData.description.trim() || !roomFormData.content.trim()) return;

        const floor = floors.find(f => f.id === floorId);
        if (!floor) return;

        actions.createRoom(palaceId, floorId, {
            title: roomFormData.title.trim(),
            description: roomFormData.description.trim(),
            duration: roomFormData.duration,
            content: roomFormData.content.trim(),
            isUnlocked: roomFormData.isUnlocked,
            isCompleted: false,
            progress: 0,
            order: floor.rooms.length + 1,
        });

        setRoomFormData({title: "", description: "", duration: 10, content: "", isUnlocked: true});
        setShowAddRoom(null);
    };

    const handleEditRoom = (floorId: string, room: StateRoom) => {
        setRoomFormData({
            title: room.title,
            description: room.description,
            duration: room.duration,
            content: room.content,
            isUnlocked: room.isUnlocked,
        });
        setEditingRoomId(room.id);
        setShowAddRoom(floorId);
    };

    const handleSaveRoom = (floorId: string, roomId: string) => {
        if (!roomFormData.title.trim() || !roomFormData.description.trim() || !roomFormData.content.trim()) return;

        actions.updateRoom(palaceId, floorId, roomId, {
            title: roomFormData.title.trim(),
            description: roomFormData.description.trim(),
            duration: roomFormData.duration,
            content: roomFormData.content.trim(),
            isUnlocked: roomFormData.isUnlocked,
        });

        setEditingRoomId(null);
        setShowAddRoom(null);
        setRoomFormData({title: "", description: "", duration: 10, content: "", isUnlocked: true});
    };

    const handleDeleteRoom = (floorId: string, roomId: string) => {
        actions.deleteRoom(palaceId, floorId, roomId);
        setShowDeleteRoomConfirm(null);
    };

    if (!palace) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-body text-[#6B7280]">
                    Palace not found
                </p>
            </div>
        );
    }

    return (
        <div className="h-full bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white overflow-y-auto">
            {/* Header Section */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ADC8FF]/30 via-transparent to-transparent"/>

                <div className="relative px-6 pt-6 pb-6">
                    {/* Top Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <motion.button
                            whileTap={{scale: 0.92}}
                            aria-label="Go back"
                            onClick={onBack}
                            className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-card border border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#091A7A]"/>
                        </motion.button>

                        <h1 className="text-section-header text-[#091A7A]">
                            Palace Details
                        </h1>

                        <motion.button
                            whileTap={{scale: 0.92}}
                            aria-label="Add floor"
                            onClick={openAddFloor}
                            className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-card border border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                        >
                            <Plus className="w-5 h-5 text-[#091A7A]"/>
                        </motion.button>
                    </div>

                    {/* Palace Banner Card */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 mb-6"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="text-5xl">{palace.icon}</div>

                            <div className="flex-1">
                                <h1 className="text-main-heading text-[#091A7A] mb-2">
                                    {palace.name}
                                </h1>
                                <p className="text-small mb-3">
                                    {palace.description}
                                </p>

                                {totalDuration > 0 && (
                                    <div
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EAF4FF] rounded-full">
                                        <Clock className="w-3.5 h-3.5 text-[#3D8FEF]"/>
                                        <span className="text-[12px] font-medium text-[#3D8FEF]">
                      {totalDuration >= 60
                          ? `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}min`
                          : `${totalDuration}min`}{" "}
                                            of training
                    </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Overall Progress */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                <span className="text-subheading text-[#091A7A]">
                  Overall Progress
                </span>
                                <span className="text-subheading font-semibold text-[#091A7A]">
                  {palace.progress}%
                </span>
                            </div>

                            <div className="h-3 bg-[#ADC8FF]/30 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{width: 0}}
                                    animate={{width: `${palace.progress}%`}}
                                    transition={{
                                        delay: 0.3,
                                        duration: 1.2,
                                        ease: "easeOut",
                                    }}
                                    className="h-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-full shadow-sm"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                <span className="text-tiny text-[#6B7280]">
                  Palace Content
                </span>
                                <span className="text-tiny text-[#6B7280]">
                  {palace.roomsCompleted}/{palace.totalRooms}{" "}
                                    Rooms
                </span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Continue Exploring Button */}
            {currentRoom && (
                <div className="px-6 mb-4">
                    <motion.button
                        whileTap={{scale: 0.98}}
                        onClick={() => onRoomClick?.(currentRoom.room)}
                        className="w-full bg-gradient-to-br from-[#ADC8FF]/90 to-[#ADC8FF]/70 backdrop-blur-lg text-[#091A7A] rounded-3xl p-5 shadow-card border border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-white/30 rounded-xl flex items-center justify-center">
                                        <Play className="w-4 h-4 text-[#091A7A]"/>
                                    </div>
                                    <span className="text-subheading font-semibold">
                    Continue exploring
                  </span>
                                </div>
                                <p className="text-small text-[#091A7A]/80 font-medium">
                                    {currentRoom.floor}: {currentRoom.room}
                                </p>
                                <p className="text-small text-[#091A7A]/70 font-medium">
                                    {currentRoom.progress}% completed
                                </p>
                            </div>
                            <div
                                className="w-14 h-14 bg-white backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                                <Play className="w-6 h-6 text-[#091A7A]"/>
                            </div>
                        </div>
                    </motion.button>
                </div>
            )}

            {/* Test Your Knowledge Button */}
            <div className="px-6 mb-6">
                <motion.button
                    whileTap={{scale: 0.98}}
                    onClick={onQuizClick}
                    className="w-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white rounded-3xl p-5 shadow-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                >
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-white"/>
                                </div>
                                <span className="text-subheading font-semibold">
                  Test your knowledge
                </span>
                            </div>
                            <p className="text-small text-white/80 font-medium">
                                Quiz yourself on this palace and earn bonus XP
                            </p>
                        </div>
                        <div
                            className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                            <Brain className="w-6 h-6 text-white"/>
                        </div>
                    </div>
                </motion.button>
            </div>

            {/* Floors & Rooms */}
            <div className="px-6 pb-6">
                {floors.length === 0 ? (
                    <EmptyState
                        emoji="🏛️"
                        title="No floors yet"
                        description="Floors group the rooms of your palace by topic or level. Add one to start placing rooms."
                        action={
                            <button
                                onClick={openAddFloor}
                                className="inline-flex items-center gap-2 rounded-full bg-[#091A7A] px-5 py-3 text-sm font-medium text-white shadow-interactive"
                            >
                                <Plus className="h-4 w-4"/>
                                Add floor
                            </button>
                        }
                    />
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-baseline justify-between px-1">
                            <h2 className="text-section-header text-[#091A7A]">
                                Floors
                            </h2>
                            <span className="text-small">
                                {floors.length} {floors.length === 1 ? "floor" : "floors"}
                            </span>
                        </div>
                        {floors.map((floor, floorIndex) => {
                            const isExpanded = expandedFloors.includes(
                                floor.id,
                            );
                            const completedRooms = floor.rooms.filter((r) => r.isCompleted).length;
                            const floorProgress = floor.rooms.length > 0
                                ? Math.round((completedRooms / floor.rooms.length) * 100)
                                : 0;

                            return (
                                <motion.div
                                    key={floor.id}
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{
                                        delay: floorIndex * 0.1,
                                        duration: 0.3,
                                        ease: "easeOut",
                                    }}
                                    className="bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-elevated border border-white/60"
                                >
                                    {/* Floor Header */}
                                    <div className="p-6">
                                        {editingFloorId === floor.id ? (
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    value={floorFormData.title}
                                                    onChange={(e) => setFloorFormData({
                                                        ...floorFormData,
                                                        title: e.target.value
                                                    })}
                                                    placeholder="Floor title"
                                                    className="w-full px-4 py-3 bg-white rounded-xl border-2 border-[#E5E5EA] focus:border-[#4F8EFF] text-[#2C2C2C] placeholder:text-[#6B7280] outline-none transition-colors"
                                                />
                                                <textarea
                                                    value={floorFormData.description}
                                                    onChange={(e) => setFloorFormData({
                                                        ...floorFormData,
                                                        description: e.target.value
                                                    })}
                                                    placeholder="Floor description"
                                                    rows={2}
                                                    className="w-full px-4 py-3 bg-white rounded-xl border-2 border-[#E5E5EA] focus:border-[#4F8EFF] text-[#2C2C2C] placeholder:text-[#6B7280] outline-none transition-colors resize-none"
                                                />
                                                <div className="flex gap-2">
                                                    <motion.button
                                                        whileTap={{scale: 0.95}}
                                                        onClick={() => handleSaveFloor(floor.id)}
                                                        disabled={!floorFormData.title.trim() || !floorFormData.description.trim()}
                                                        className="flex-1 py-3 bg-[#091A7A] disabled:bg-[#091A7A]/40 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                                                    >
                                                        <Save size={16}/>
                                                        Save floor
                                                    </motion.button>
                                                    <motion.button
                                                        whileTap={{scale: 0.95}}
                                                        aria-label="Cancel editing"
                                                        onClick={() => {
                                                            setEditingFloorId(null);
                                                            setFloorFormData({title: "", description: ""});
                                                        }}
                                                        className="px-4 py-3 bg-[#F5F5F7] text-[#2C2C2C] rounded-xl font-semibold"
                                                    >
                                                        <X size={16}/>
                                                    </motion.button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-start justify-between">
                                                <motion.button
                                                    whileTap={{scale: 0.98}}
                                                    onClick={() => toggleFloor(floor.id)}
                                                    className="flex-1 text-left"
                                                >
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <div
                                                            className="w-10 h-10 bg-[#ADC8FF] rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                            <span className="text-small font-semibold text-[#091A7A]">
                              {floorIndex + 1}
                            </span>
                                                        </div>
                                                        <span className="text-body font-semibold text-[#091A7A]/80">
                            Floor {floorIndex + 1}
                          </span>
                                                    </div>
                                                    <h3 className="text-subheading text-[#091A7A] mb-2">
                                                        {floor.title}
                                                    </h3>
                                                    <p className="text-[13px] text-[#4b5563] mb-3">
                                                        {floor.description}
                                                    </p>
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className="h-2.5 w-24 bg-[#ADC8FF]/30 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{width: 0}}
                                                                animate={{
                                                                    width: `${floorProgress}%`,
                                                                }}
                                                                transition={{
                                                                    delay: 0.5,
                                                                    duration: 1,
                                                                    ease: "easeOut",
                                                                }}
                                                                className="h-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-full"
                                                            />
                                                        </div>
                                                        <span className="text-small font-semibold text-[#091A7A]">
                            {floorProgress}%
                          </span>
                                                        <span className="text-[13px] text-[#4b5563]">
                            {floor.rooms.length} {floor.rooms.length === 1 ? 'room' : 'rooms'}
                          </span>
                                                    </div>
                                                </motion.button>

                                                <div className="flex items-center gap-2">
                                                    <motion.div
                                                        animate={{rotate: isExpanded ? 90 : 0}}
                                                        transition={{
                                                            duration: 0.3,
                                                            ease: "easeInOut",
                                                        }}
                                                        className="w-10 h-10 bg-[#ADC8FF]/15 rounded-full flex items-center justify-center border border-white/40"
                                                    >
                                                        <ChevronRight className="w-5 h-5 text-[#091A7A]/70"/>
                                                    </motion.div>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            render={
                                                                <motion.button
                                                                    whileTap={{scale: 0.9}}
                                                                    aria-label={`Options for ${floor.title}`}
                                                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md relative outline-none border-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                                                                >
                                                                    <MoreVertical size={18} className="text-[#2C2C2C]"/>
                                                                </motion.button>
                                                            }
                                                        />
                                                        <DropdownMenuContent align="end"
                                                                             className="w-[180px] rounded-[16px] p-1.5">
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setShowAddRoom(floor.id);
                                                                    setExpandedFloors((prev) =>
                                                                        prev.includes(floor.id) ? prev : [...prev, floor.id]
                                                                    );
                                                                }}
                                                                className="rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3"
                                                            >
                                                                <Plus size={16} className="text-[#091A7A]"/>
                                                                <span
                                                                    className="text-[14px] font-medium text-[#2C2C2C]">Add room</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleEditFloor(floor)}
                                                                className="rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3"
                                                            >
                                                                <Edit2 size={16} className="text-[#091A7A]"/>
                                                                <span
                                                                    className="text-[14px] font-medium text-[#2C2C2C]">Edit floor</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setShowDeleteFloorConfirm(floor.id)}
                                                                className="rounded-[10px] px-3 py-2.5 hover:bg-red-50 focus:bg-red-50 cursor-pointer flex items-center gap-3"
                                                            >
                                                                <Trash2 size={16} className="text-red-600"/>
                                                                <span className="text-[14px] font-medium text-red-600">Delete floor</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Floor Rooms */}
                                    <motion.div
                                        initial={false}
                                        animate={{height: isExpanded ? "auto" : 0}}
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeInOut",
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 space-y-4">
                                            <div
                                                className="h-px bg-gradient-to-r from-transparent via-[#ADC8FF]/30 to-transparent mb-4"/>


                                            {floor.rooms.length === 0 && showAddRoom !== floor.id && (
                                                <p className="text-[14px] text-[#4b5563] text-center py-4">
                                                    No rooms on this floor yet. Open the floor menu and choose “Add
                                                    room”.
                                                </p>
                                            )}


                                            {floor.rooms.map((room, roomIndex) => (
                                                <SwipeableRoomCard
                                                    key={room.id}
                                                    room={room}
                                                    roomIndex={roomIndex}
                                                    floor={floor}
                                                    onEditRoom={handleEditRoom}
                                                    onDeleteRoom={(fId, rId) => setShowDeleteRoomConfirm({
                                                        floorId: fId,
                                                        roomId: rId
                                                    })}
                                                    onRoomClick={onRoomClick}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Drawer.Root open={!!showAddRoom} onOpenChange={(open) => {
                if (!open) {
                    setShowAddRoom(null);
                    setEditingRoomId(null);
                    setRoomFormData({title: "", description: "", duration: 10, content: "", isUnlocked: true});
                }
            }}>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-[#091A7A]/40 z-[100]"/>
                    <Drawer.Content
                        aria-describedby={undefined}
                        className="bg-[#F5F5F7] flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 z-[101] outline-none h-auto max-h-[90%]">
                        <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-y-auto">
                            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-6"/>

                            <div className="px-2 pb-6 space-y-4">
                                <Drawer.Title
                                    className="text-[20px] font-bold text-[#091A7A] mb-4 block">
                                    {editingRoomId ? "Edit room" : "Add a room"}
                                </Drawer.Title>
                                <div className="space-y-4">
                                    <div>
                                        <label
                                            className="text-[14px] font-medium text-[#2C2C2C] mb-2 block">Room
                                            title</label>
                                        <input
                                            type="text"
                                            value={roomFormData.title}
                                            onChange={(e) => setRoomFormData({...roomFormData, title: e.target.value})}
                                            placeholder="e.g., The Grand Hall"
                                            className="w-full px-4 py-3.5 bg-white rounded-2xl border border-[#E5E5EA] shadow-sm text-[#2C2C2C] placeholder:text-[#6B7280] outline-none focus:border-[#4F8EFF] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="text-[14px] font-medium text-[#2C2C2C] mb-2 block">Description</label>
                                        <textarea
                                            value={roomFormData.description}
                                            onChange={(e) => setRoomFormData({
                                                ...roomFormData,
                                                description: e.target.value
                                            })}
                                            placeholder="What is this room about?"
                                            rows={2}
                                            className="w-full px-4 py-3.5 bg-white rounded-2xl border border-[#E5E5EA] shadow-sm text-[#2C2C2C] placeholder:text-[#6B7280] outline-none focus:border-[#4F8EFF] transition-colors resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="text-[14px] font-medium text-[#2C2C2C] mb-2 block">Learning
                                            content</label>
                                        <textarea
                                            value={roomFormData.content}
                                            onChange={(e) => setRoomFormData({
                                                ...roomFormData,
                                                content: e.target.value
                                            })}
                                            placeholder="The facts or concepts to memorize in this room..."
                                            rows={4}
                                            className="w-full px-4 py-3.5 bg-white rounded-2xl border border-[#E5E5EA] shadow-sm text-[#2C2C2C] placeholder:text-[#6B7280] outline-none focus:border-[#4F8EFF] transition-colors resize-none font-mono text-[14px]"
                                        />
                                    </div>

                                    <div className="flex gap-4 items-end pt-2">
                                        <div className="flex-1">
                                            <label
                                                className="text-[14px] font-medium text-[#2C2C2C] mb-3 block">Duration</label>
                                            <input
                                                type="range"
                                                min="5"
                                                max="60"
                                                step="5"
                                                value={roomFormData.duration}
                                                onChange={(e) => setRoomFormData({
                                                    ...roomFormData,
                                                    duration: Number(e.target.value)
                                                })}
                                                aria-label="Duration in minutes"
                                                className="w-full accent-[#091A7A]"
                                            />
                                            <div className="text-center mt-2">
                                                <span
                                                    className="text-[#091A7A] font-bold text-[18px]">{roomFormData.duration}</span>
                                                <span className="text-[#4b5563] text-[14px] ml-1">min</span>
                                            </div>
                                        </div>

                                        <motion.button
                                            whileTap={{scale: 0.95}}
                                            onClick={() => setRoomFormData({
                                                ...roomFormData,
                                                isUnlocked: !roomFormData.isUnlocked
                                            })}
                                            className={`h-[52px] px-5 rounded-2xl font-semibold text-[14px] flex items-center gap-2 border shadow-sm transition-colors ${
                                                roomFormData.isUnlocked
                                                    ? 'bg-white border-[#E5E5EA] text-[#091A7A]'
                                                    : 'bg-[#F5F5F7] border-[#E5E5EA] text-[#4b5563]'
                                            }`}
                                        >
                                            {roomFormData.isUnlocked ? <Unlock size={18} className="text-[#091A7A]"/> :
                                                <Lock size={18}/>}
                                            {roomFormData.isUnlocked ? 'Unlocked' : 'Locked'}
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <motion.button
                                        whileTap={{scale: 0.95}}
                                        onClick={() => {
                                            if (editingRoomId && showAddRoom) {
                                                handleSaveRoom(showAddRoom, editingRoomId);
                                            } else if (showAddRoom) {
                                                handleAddRoom(showAddRoom);
                                            }
                                        }}
                                        disabled={!roomFormData.title || !roomFormData.description || !roomFormData.content}
                                        className="w-full py-4 bg-[#091A7A] disabled:bg-[#091A7A]/50 text-white rounded-2xl font-bold shadow-interactive flex items-center justify-center gap-2 transition-colors"
                                    >
                                        {editingRoomId ? <Save size={20}/> : <Plus size={20}/>}
                                        {editingRoomId ? "Save changes" : "Create room"}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>

            {/* Add Floor Modal */}
            <AnimatePresence>
                {showAddFloor && (
                    <>
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="fixed inset-0 bg-[#091A7A]/40 z-50"
                            onClick={() => setShowAddFloor(false)}
                        />

                        <motion.div
                            initial={{opacity: 0, y: 40}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 40}}
                            transition={{duration: 0.3, ease: [0.16, 1, 0.3, 1]}}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 shadow-elevated max-h-[80vh] overflow-y-auto"
                        >
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-[#091A7A]">
                                        Add a floor
                                    </h3>
                                    <motion.button
                                        whileTap={{scale: 0.9}}
                                        aria-label="Close"
                                        onClick={() => setShowAddFloor(false)}
                                        className="w-11 h-11 bg-[#F5F5F7] rounded-full flex items-center justify-center text-[#2C2C2C]"
                                    >
                                        <X size={18}/>
                                    </motion.button>
                                </div>
                                <p className="text-[15px] text-[#4b5563]">
                                    Floors group the rooms of {palace.name} by topic or level.
                                </p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-[14px] font-medium text-[#2C2C2C] mb-2 block">
                                        Floor title
                                    </label>
                                    <input
                                        type="text"
                                        value={floorFormData.title}
                                        onChange={(e) => setFloorFormData({...floorFormData, title: e.target.value})}
                                        placeholder="e.g., Introduction Level"
                                        className="w-full px-5 py-4 bg-white rounded-2xl text-[#2C2C2C] placeholder:text-[#6B7280] outline-none border-2 border-[#E5E5EA] focus:border-[#4F8EFF] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-[14px] font-medium text-[#2C2C2C] mb-2 block">
                                        Description
                                    </label>
                                    <textarea
                                        value={floorFormData.description}
                                        onChange={(e) => setFloorFormData({
                                            ...floorFormData,
                                            description: e.target.value
                                        })}
                                        placeholder="What you'll learn on this floor..."
                                        rows={4}
                                        className="w-full px-5 py-4 bg-white rounded-2xl text-[#2C2C2C] placeholder:text-[#6B7280] outline-none border-2 border-[#E5E5EA] focus:border-[#4F8EFF] transition-colors resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <motion.button
                                    whileTap={{scale: 0.98}}
                                    onClick={() => setShowAddFloor(false)}
                                    className="flex-1 py-4 bg-[#F5F5F7] rounded-2xl font-semibold text-[#2C2C2C]"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileTap={{scale: 0.98}}
                                    onClick={handleAddFloor}
                                    disabled={!floorFormData.title.trim() || !floorFormData.description.trim()}
                                    className="flex-1 py-4 bg-[#091A7A] disabled:bg-[#091A7A]/40 text-white rounded-2xl font-semibold shadow-interactive flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Plus size={20}/>
                                    Add floor
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Delete Floor Confirmation */}
            <AlertDialog
                open={!!showDeleteFloorConfirm}
                onOpenChange={(open) => !open && setShowDeleteFloorConfirm(null)}
            >
                <AlertDialogContent className="rounded-3xl!">
                    <AlertDialogHeader>
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} className="text-red-600"/>
                        </div>
                        <AlertDialogTitle className="text-center text-xl font-bold text-[#2C2C2C]">
                            {floorToDelete
                                ? `Delete “${floorToDelete.title}”?`
                                : "Delete floor?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-[15px] text-[#4b5563]">
                            {floorToDelete && floorToDelete.rooms.length > 0
                                ? `This can’t be undone. ${floorToDelete.rooms.length === 1
                                    ? "Its room and your training progress there are"
                                    : `Its ${floorToDelete.rooms.length} rooms and your training progress there are`} deleted for good.`
                                : "This can’t be undone."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-3 sm:justify-center mt-6">
                        <AlertDialogCancel
                            className="flex-1 py-4 bg-[#F5F5F7] rounded-2xl font-semibold text-[#2C2C2C] border-none hover:bg-[#E5E5EA]">
                            Keep floor
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => showDeleteFloorConfirm && handleDeleteFloor(showDeleteFloorConfirm)}
                            className="flex-1 py-4 bg-red-600 rounded-2xl font-semibold text-white hover:bg-red-700"
                        >
                            Delete floor
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Room Confirmation */}
            <AlertDialog
                open={!!showDeleteRoomConfirm}
                onOpenChange={(open) => !open && setShowDeleteRoomConfirm(null)}
            >
                <AlertDialogContent className="rounded-3xl!">
                    <AlertDialogHeader>
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} className="text-red-600"/>
                        </div>
                        <AlertDialogTitle className="text-center text-xl font-bold text-[#2C2C2C]">
                            {roomToDelete
                                ? `Delete “${roomToDelete.title}”?`
                                : "Delete room?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-[15px] text-[#4b5563]">
                            This can’t be undone. The room’s content and your training progress in it are deleted for
                            good.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-3 sm:justify-center mt-6">
                        <AlertDialogCancel
                            className="flex-1 py-4 bg-[#F5F5F7] rounded-2xl font-semibold text-[#2C2C2C] border-none hover:bg-[#E5E5EA]">
                            Keep room
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => showDeleteRoomConfirm && handleDeleteRoom(showDeleteRoomConfirm.floorId, showDeleteRoomConfirm.roomId)}
                            className="flex-1 py-4 bg-red-600 rounded-2xl font-semibold text-white hover:bg-red-700"
                        >
                            Delete room
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}