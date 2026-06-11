import {useEffect, useState} from "react";
import {animate, AnimatePresence, HTMLMotionProps, motion, useMotionValue} from "motion/react";
import {useCollapsibleHeader} from "../../hooks/useCollapsibleHeader";
import {
    ArrowLeft,
    ArrowLeftRight,
    Brain,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Clock,
    GraduationCap,
    Copy,
    DownloadCloud,
    Edit2,
    HelpCircle,
    Lock,
    MapPin,
    MoreVertical,
    Play,
    Plus,
    RotateCcw,
    Settings2,
    Shuffle,
    Target,
    Timer,
    Trash2,
    Unlock,
    X,
} from "lucide-react";
import {
    type CardOrder,
    Palace,
    type PalaceSettings,
    palaceSettings,
    Room as StateRoom,
    type StudyDirection,
    useProgressState,
} from "../../hooks/useProgressState";
import {useDrag} from "@use-gesture/react";
import {toast} from "sonner";
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
import {EmptyState} from "../ui/EmptyState";
import {Switch} from "../ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import {KeyboardSheet} from "../ui/KeyboardSheet";
import {LociPreviewCarousel} from "./LociPreviewCarousel";
import {PalaceCover} from "../cards/PalaceCover";
import {isDue, srsStatus} from "../../utils/srs";

interface PalaceDetailScreenProps {
    palaceId: string;
    onBack: () => void;
    onRoomClick?: (roomTitle: string) => void;
    /** Jump straight into a room's flashcard deck (skips the detail page). */
    onStudyRoom?: (roomTitle: string) => void;
    onQuizClick?: () => void;
    /** Open the full edit flow (name, icon, color) for this palace. */
    onEditPalace?: () => void;
}

const getCurrentRoom = (rooms: StateRoom[]) => {
    const next =
        rooms.find((r) => !r.isCompleted && r.isUnlocked) ?? rooms[0];
    return next ? {room: next.title, progress: next.progress} : null;
};

/** Download a single palace as JSON (rooms, loci, questions, settings). */
function exportPalace(palace: Palace) {
    const blob = new Blob(
        [
            JSON.stringify(
                {type: "mindscape-palace", version: 1, palace},
                null,
                2,
            ),
        ],
        {type: "application/json"},
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug =
        palace.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
        "palace";
    a.href = url;
    a.download = `${slug}-palace.json`;
    a.click();
    URL.revokeObjectURL(url);
}

interface SwipeableRoomCardProps {
    room: StateRoom;
    roomIndex: number;
    palaceId: string;
    canMoveUp: boolean;
    canMoveDown: boolean;
    onEditRoom: (room: StateRoom) => void;
    onDeleteRoom: (roomId: string) => void;
    onRoomClick?: (roomTitle: string) => void;
    onMoveRoom: (roomId: string, direction: "up" | "down") => void;
}

function SwipeableRoomCard({
                               room,
                               roomIndex,
                               canMoveUp,
                               canMoveDown,
                               onEditRoom,
                               onDeleteRoom,
                               onRoomClick,
                               onMoveRoom,
                           }: SwipeableRoomCardProps) {
    const x = useMotionValue(0);

    const bind = useDrag(
        ({down, movement: [mx], velocity: [vx], direction: [dx], tap}) => {
            // A clean tap anywhere on the card opens the room; a left swipe
            // reveals the move / edit / delete actions behind it.
            if (tap) {
                animate(x, 0, {type: "spring", stiffness: 400, damping: 30});
                onRoomClick?.(room.title);
                return;
            }
            const boundedX = Math.min(0, mx);
            if (down) {
                x.set(boundedX);
            } else if (boundedX < -60 || (vx > 0.5 && dx < 0)) {
                animate(x, -208, {type: "spring", stiffness: 400, damping: 30});
            } else {
                animate(x, 0, {type: "spring", stiffness: 400, damping: 30});
            }
        },
        {axis: "x", filterTaps: true},
    );

    const loci = room.loci ?? [];
    const lociCount = loci.length;
    const questionCount = room.questions?.length ?? 0;
    const knownCount = loci.filter((l) => srsStatus(l.srs) === "known").length;
    const dueCount = loci.filter((l) => isDue(l.srs)).length;

    return (
        <motion.div
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: roomIndex * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1]}}
            className="relative overflow-hidden rounded-2xl touch-pan-y"
        >
            {/* Hidden actions behind the card */}
            <div className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 gap-2 bg-[#EAF4FF]/70 rounded-2xl w-full">
                <motion.button
                    whileTap={{scale: 0.9}}
                    aria-label={`Move ${room.title} up`}
                    disabled={!canMoveUp}
                    onClick={() => {
                        animate(x, 0);
                        onMoveRoom(room.id, "up");
                    }}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-[#091A7A] disabled:opacity-35"
                >
                    <ChevronUp size={18}/>
                </motion.button>
                <motion.button
                    whileTap={{scale: 0.9}}
                    aria-label={`Move ${room.title} down`}
                    disabled={!canMoveDown}
                    onClick={() => {
                        animate(x, 0);
                        onMoveRoom(room.id, "down");
                    }}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-[#091A7A] disabled:opacity-35"
                >
                    <ChevronDown size={18}/>
                </motion.button>
                <motion.button
                    whileTap={{scale: 0.9}}
                    aria-label={`Edit ${room.title}`}
                    onClick={() => {
                        animate(x, 0);
                        onEditRoom(room);
                    }}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-[#091A7A]"
                >
                    <Edit2 size={18}/>
                </motion.button>
                <motion.button
                    whileTap={{scale: 0.9}}
                    aria-label={`Delete ${room.title}`}
                    onClick={() => {
                        animate(x, 0);
                        onDeleteRoom(room.id);
                    }}
                    className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shadow-md text-red-600"
                >
                    <Trash2 size={18}/>
                </motion.button>
            </div>

            {/* Foreground card */}
            <motion.div
                {...(bind() as unknown as HTMLMotionProps<"div">)}
                style={{x}}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-white/70 shadow-card relative z-10 w-full"
            >
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-11 h-11 bg-gradient-to-br from-[#ADC8FF]/40 to-[#ADC8FF]/20 rounded-full flex items-center justify-center border border-white/50 flex-shrink-0">
                            <span className="text-small font-semibold text-[#091A7A]">
                                {roomIndex + 1}
                            </span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-subheading text-[#091A7A] mb-1 font-medium line-clamp-1">
                                {room.title}
                            </h4>
                            <p className="text-[12px] text-[#4b5563] mb-2 line-clamp-1">
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
                                        <span className="text-[11px] text-[#4b5563]">Locked</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <RoomCardMenu
                            canMoveUp={canMoveUp}
                            canMoveDown={canMoveDown}
                            onEdit={() => onEditRoom(room)}
                            onMove={(dir) => onMoveRoom(room.id, dir)}
                            onDelete={() => onDeleteRoom(room.id)}
                        />
                        {room.isCompleted ? (
                            <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center border border-green-200">
                                <CheckCircle className="w-4.5 h-4.5 text-green-600"/>
                            </div>
                        ) : !room.isUnlocked ? (
                            <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200">
                                <Lock className="w-4 h-4 text-gray-400"/>
                            </div>
                        ) : (
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[#091A7A]/30">
                                <ChevronRight className="w-5 h-5"/>
                            </div>
                        )}
                    </div>
                </div>

                {room.progress > 0 && !room.isCompleted && (
                    <div className="mt-3">
                        <div className="h-2 bg-[#ADC8FF]/25 rounded-full overflow-hidden">
                            <motion.div
                                initial={{width: 0}}
                                animate={{width: `${room.progress}%`}}
                                transition={{delay: 0.3, duration: 0.8, ease: "easeOut"}}
                                className="h-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-full"
                            />
                        </div>
                    </div>
                )}

                {/* Stats: counts + mastery + a due nudge, at a glance. */}
                <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
                    <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#091A7A]">
                        <MapPin size={14} className="text-[#3D8FEF]"/>
                        {lociCount} {lociCount === 1 ? "locus" : "loci"}
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#091A7A]">
                        <HelpCircle size={14} className="text-[#3D8FEF]"/>
                        {questionCount} {questionCount === 1 ? "question" : "questions"}
                    </span>
                    {lociCount > 0 && (
                        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#091A7A]">
                            <GraduationCap size={14} className="text-[#047857]"/>
                            {knownCount}/{lociCount} mastered
                        </span>
                    )}
                    {dueCount > 0 && knownCount < lociCount && (
                        <span className="inline-flex items-center rounded-full bg-[#EAF4FF] px-2 py-0.5 text-[11px] font-bold text-[#3D8FEF]">
                            {dueCount} due
                        </span>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

/** Discoverable ⋯ menu on each room card, mirroring the swipe actions. */
function RoomCardMenu({
                          canMoveUp,
                          canMoveDown,
                          onEdit,
                          onMove,
                          onDelete,
                      }: {
    canMoveUp: boolean;
    canMoveDown: boolean;
    onEdit: () => void;
    onMove: (direction: "up" | "down") => void;
    onDelete: () => void;
}) {
    const item =
        "rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3 text-[14px] font-medium text-[#2C2C2C]";
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <motion.button
                        whileTap={{scale: 0.9}}
                        aria-label="Room actions"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="w-9 h-9 rounded-full bg-[#F4F8FF] flex items-center justify-center text-[#091A7A] hover:bg-[#EAF4FF] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                    >
                        <MoreVertical size={16}/>
                    </motion.button>
                }
            />
            <DropdownMenuContent align="end" className="w-[190px] rounded-[16px] p-1.5">
                <DropdownMenuItem onClick={onEdit} className={item}>
                    <Edit2 size={16} className="text-[#091A7A]"/>
                    Edit room
                </DropdownMenuItem>
                {canMoveUp && (
                    <DropdownMenuItem onClick={() => onMove("up")} className={item}>
                        <ChevronUp size={16} className="text-[#091A7A]"/>
                        Move up
                    </DropdownMenuItem>
                )}
                {canMoveDown && (
                    <DropdownMenuItem onClick={() => onMove("down")} className={item}>
                        <ChevronDown size={16} className="text-[#091A7A]"/>
                        Move down
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    onClick={onDelete}
                    className="rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3 text-[14px] font-medium text-red-600 hover:bg-red-50 focus:bg-red-50"
                >
                    <Trash2 size={16} className="text-red-600"/>
                    Delete room
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/** Friendly relative day label for "last updated". */
function relativeDay(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString(undefined, {month: "short", day: "numeric"});
}

export function PalaceDetailScreen({
                                       palaceId,
                                       onBack,
                                       onRoomClick,
                                       onStudyRoom,
                                       onQuizClick,
                                       onEditPalace,
                                   }: PalaceDetailScreenProps) {
    const {state, actions} = useProgressState();
    const palace = state.palaces.find((p) => p.id === palaceId);

    const [showInsights, setShowInsights] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [roomEditor, setRoomEditor] = useState<
        {mode: "add"} | {mode: "edit"; room: StateRoom} | null
    >(null);
    const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null);
    const [confirm, setConfirm] = useState<"reset" | "delete" | null>(null);

    const header = useCollapsibleHeader({distance: 150});

    if (!palace) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-body text-[#6B7280]">Palace not found</p>
            </div>
        );
    }

    const rooms = palace.rooms || [];
    const currentRoom = rooms.length > 0 ? getCurrentRoom(rooms) : null;
    const currentRoomObj = currentRoom
        ? rooms.find((r) => r.title === currentRoom.room)
        : undefined;
    const currentRoomLoci = currentRoomObj?.loci ?? [];
    const totalDuration = rooms.reduce((sum, r) => sum + r.duration, 0);
    const totalLoci = rooms.reduce((sum, r) => sum + (r.loci?.length ?? 0), 0);
    const totalQuestions = rooms.reduce(
        (sum, r) => sum + (r.questions?.length ?? 0),
        0,
    );
    const settings = palaceSettings(palace);
    const roomToDelete = rooms.find((r) => r.id === deleteRoomId);

    const handleArchive = () => {
        actions.togglePalaceArchived(palaceId);
        setShowSettings(false);
        toast.success("Palace archived");
        onBack();
    };

    return (
        <div
            ref={header.ref}
            className="h-full bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white overflow-y-auto"
        >
            {/* Compact sticky bar — fades in once the banner scrolls away */}
            <motion.div
                style={{
                    opacity: header.compactOpacity,
                    pointerEvents: header.compactPointerEvents,
                }}
                className="fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-2xl border-b border-[#091A7A]/[0.06] shadow-[0_4px_24px_rgba(9,26,122,0.04)]"
            >
                <div className="h-safe-top"/>
                <div className="flex items-center gap-2.5 px-3 py-2">
                    <button
                        onClick={onBack}
                        aria-label="Go back"
                        className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center text-[#091A7A] active:scale-95 transition-transform"
                    >
                        <ArrowLeft className="w-5 h-5"/>
                    </button>
                    <PalaceCover
                        icon={palace.icon}
                        color={palace.color}
                        image={palace.image}
                        className="w-8 h-8 rounded-lg flex-shrink-0"
                        iconClassName="text-[16px]"
                    />
                    <h2 className="text-[16px] font-bold text-[#091A7A] truncate flex-1 min-w-0">
                        {palace.name}
                    </h2>
                    <button
                        onClick={() => setShowSettings(true)}
                        aria-label="Palace settings"
                        className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center text-[#091A7A] active:scale-95 transition-transform"
                    >
                        <Settings2 className="w-5 h-5"/>
                    </button>
                </div>
            </motion.div>

            {/* Notch clearance */}
            <div className="h-safe-top"/>

            {/* Header — recedes on scroll */}
            <motion.div
                style={{
                    opacity: header.largeOpacity,
                    scale: header.largeScale,
                    y: header.largeY,
                    pointerEvents: header.largePointerEvents,
                }}
                className="relative origin-top will-change-transform"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#ADC8FF]/30 via-transparent to-transparent"/>

                <div className="relative px-6 pt-3 pb-6">
                    <div className="flex items-center justify-between mb-6">
                        <motion.button
                            whileTap={{scale: 0.92}}
                            aria-label="Go back"
                            onClick={onBack}
                            className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-card border border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#091A7A]"/>
                        </motion.button>

                        <h1 className="text-section-header text-[#091A7A]">Palace</h1>

                        <motion.button
                            whileTap={{scale: 0.92}}
                            aria-label="Palace settings"
                            onClick={() => setShowSettings(true)}
                            className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-card border border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                        >
                            <Settings2 className="w-5 h-5 text-[#091A7A]"/>
                        </motion.button>
                    </div>

                    {/* Banner with merged, expandable insights */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 mb-6"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <PalaceCover
                                icon={palace.icon}
                                color={palace.color}
                                image={palace.image}
                                className="w-16 h-16 rounded-2xl flex-shrink-0 shadow-md"
                                iconClassName="text-4xl"
                            />
                            <div className="flex-1 min-w-0">
                                <h1 className="text-main-heading text-[#091A7A] mb-2">
                                    {palace.name}
                                </h1>
                                <p className="text-small mb-3">{palace.description}</p>
                                {totalDuration > 0 && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EAF4FF] rounded-full">
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

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-subheading text-[#091A7A]">
                                    Overall progress
                                </span>
                                <span className="text-subheading font-semibold text-[#091A7A]">
                                    {palace.progress}%
                                </span>
                            </div>
                            <div className="h-3 bg-[#ADC8FF]/30 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{width: 0}}
                                    animate={{width: `${palace.progress}%`}}
                                    transition={{delay: 0.3, duration: 1.2, ease: "easeOut"}}
                                    className="h-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-full shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Stat tiles */}
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                {icon: CheckCircle, label: "Rooms", value: `${palace.roomsCompleted}/${palace.totalRooms}`},
                                {icon: Target, label: "Mastery", value: `${palace.progress}%`},
                                {icon: MapPin, label: "Loci", value: String(totalLoci)},
                                {icon: HelpCircle, label: "Questions", value: String(totalQuestions)},
                            ].map((tile) => (
                                <div key={tile.label} className="rounded-xl bg-[#F4F8FF] px-2 py-2.5 text-center">
                                    <tile.icon className="w-4 h-4 text-[#3D8FEF] mx-auto mb-1"/>
                                    <p className="text-[16px] font-bold text-[#091A7A] leading-none">
                                        {tile.value}
                                    </p>
                                    <p className="text-[10px] font-medium text-[#64748b] mt-1">
                                        {tile.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {rooms.length > 0 && (
                            <>
                                <button
                                    onClick={() => setShowInsights((v) => !v)}
                                    aria-expanded={showInsights}
                                    className="mt-3 w-full flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#3D8FEF] hover:text-[#091A7A] transition-colors"
                                >
                                    {showInsights ? "Hide details" : "More insights"}
                                    <motion.span animate={{rotate: showInsights ? 180 : 0}} transition={{duration: 0.25}}>
                                        <ChevronDown className="w-4 h-4"/>
                                    </motion.span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {showInsights && (
                                        <motion.div
                                            initial={{height: 0, opacity: 0}}
                                            animate={{height: "auto", opacity: 1}}
                                            exit={{height: 0, opacity: 0}}
                                            transition={{duration: 0.3, ease: [0.16, 1, 0.3, 1]}}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-3 pt-3 border-t border-[#091A7A]/[0.07] space-y-2">
                                                {rooms.map((r) => (
                                                    <div
                                                        key={r.id}
                                                        className="flex items-center justify-between gap-2"
                                                    >
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            {r.isCompleted ? (
                                                                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0"/>
                                                            ) : (
                                                                <span className="w-4 h-4 rounded-full border-2 border-[#ADC8FF] flex-shrink-0"/>
                                                            )}
                                                            <span className="text-[13px] font-medium text-[#091A7A] truncate">
                                                                {r.title}
                                                            </span>
                                                        </div>
                                                        <span className="text-[12px] text-[#64748b] flex-shrink-0">
                                                            {r.loci?.length ?? 0} loci · {r.questions?.length ?? 0} q
                                                        </span>
                                                    </div>
                                                ))}
                                                <p className="text-[12px] text-[#94a3b8] pt-1">
                                                    Last updated {relativeDay(palace.updatedAt)}.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            {/* Continue / loci preview */}
            {currentRoom && (
                <div className="px-6 mb-5">
                    {currentRoomLoci.length > 0 ? (
                        <div className="rounded-3xl bg-white/80 backdrop-blur-lg border border-white/50 shadow-card p-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-[12px] font-semibold text-[#3D8FEF]">
                                        Continue where you left off
                                    </p>
                                    <h3 className="text-[16px] font-bold text-[#091A7A] line-clamp-1">
                                        {currentRoom.room}
                                    </h3>
                                </div>
                                <motion.button
                                    whileTap={{scale: 0.95}}
                                    onClick={() => onRoomClick?.(currentRoom.room)}
                                    className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-[#EAF4FF] px-3 py-2 text-[13px] font-semibold text-[#091A7A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                                >
                                    Open room
                                    <ChevronRight size={15}/>
                                </motion.button>
                            </div>
                            <LociPreviewCarousel
                                loci={currentRoomLoci}
                                direction={settings.studyDirection}
                                onOpen={() => (onStudyRoom ?? onRoomClick)?.(currentRoom.room)}
                                openLabel="Study flashcards"
                            />
                        </div>
                    ) : (
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
                                            Open room
                                        </span>
                                    </div>
                                    <p className="text-small text-[#091A7A]/80 font-medium">
                                        {currentRoom.room}
                                    </p>
                                    <p className="text-small text-[#091A7A]/70 font-medium">
                                        Add cards to start studying
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-white backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                                    <ChevronRight className="w-6 h-6 text-[#091A7A]"/>
                                </div>
                            </div>
                        </motion.button>
                    )}
                </div>
            )}

            {/* Quiz */}
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
                                    <Brain className="w-4 h-4 text-white"/>
                                </div>
                                <span className="text-subheading font-semibold">
                                    Test your knowledge
                                </span>
                            </div>
                            <p className="text-small text-white/80 font-medium">
                                Quiz yourself on this palace and earn bonus XP
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                            <Brain className="w-6 h-6 text-white"/>
                        </div>
                    </div>
                </motion.button>
            </div>

            {/* Rooms */}
            <div className="px-6 pb-10">
                {rooms.length === 0 ? (
                    <EmptyState
                        emoji="🚪"
                        title="No rooms yet"
                        description="Rooms are the places along your palace's route. Add one, then fill it with loci to remember."
                        action={
                            <button
                                onClick={() => setRoomEditor({mode: "add"})}
                                className="inline-flex items-center gap-2 rounded-full bg-[#091A7A] px-5 py-3 text-sm font-medium text-white shadow-interactive"
                            >
                                <Plus className="h-4 w-4"/>
                                Add room
                            </button>
                        }
                    />
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-section-header text-[#091A7A]">Rooms</h2>
                            <motion.button
                                whileTap={{scale: 0.95}}
                                onClick={() => setRoomEditor({mode: "add"})}
                                className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF4FF] px-3.5 py-2 text-[13px] font-semibold text-[#091A7A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                            >
                                <Plus size={15}/>
                                Add room
                            </motion.button>
                        </div>

                        {rooms.map((room, roomIndex) => (
                            <SwipeableRoomCard
                                key={room.id}
                                room={room}
                                roomIndex={roomIndex}
                                palaceId={palaceId}
                                canMoveUp={roomIndex > 0}
                                canMoveDown={roomIndex < rooms.length - 1}
                                onEditRoom={(r) => setRoomEditor({mode: "edit", room: r})}
                                onDeleteRoom={(rId) => setDeleteRoomId(rId)}
                                onRoomClick={onRoomClick}
                                onMoveRoom={(rId, dir) => actions.moveRoom(palaceId, rId, dir)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Per-palace settings sheet */}
            <PalaceSettingsSheet
                open={showSettings}
                onOpenChange={setShowSettings}
                palace={palace}
                settings={settings}
                onEditPalace={() => {
                    setShowSettings(false);
                    onEditPalace?.();
                }}
                onUpdateSettings={(u) => actions.updatePalaceSettings(palaceId, u)}
                onDuplicate={() => {
                    actions.duplicatePalace(palaceId);
                    setShowSettings(false);
                    toast.success("Palace duplicated");
                }}
                onExport={() => {
                    exportPalace(palace);
                    toast.success("Palace exported");
                }}
                onReset={() => setConfirm("reset")}
                onArchive={handleArchive}
                onDelete={() => setConfirm("delete")}
            />

            {/* Room editor */}
            <RoomEditorDrawer
                editor={roomEditor}
                onClose={() => setRoomEditor(null)}
                onCreate={(data) => {
                    actions.createRoom(palaceId, {
                        ...data,
                        content: "",
                        isCompleted: false,
                        progress: 0,
                        order: rooms.length + 1,
                        loci: [],
                        questions: [],
                    });
                    setRoomEditor(null);
                    toast.success("Room added");
                }}
                onSave={(roomId, data) => {
                    actions.updateRoom(palaceId, roomId, data);
                    setRoomEditor(null);
                    toast.success("Room updated");
                }}
            />

            {/* Delete room */}
            <AlertDialog open={!!deleteRoomId} onOpenChange={(o) => !o && setDeleteRoomId(null)}>
                <AlertDialogContent className="sm:max-w-[360px] rounded-3xl!">
                    <AlertDialogHeader>
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Trash2 size={26} className="text-red-600"/>
                        </div>
                        <AlertDialogTitle className="text-center text-[#091A7A] text-lg">
                            {roomToDelete ? `Delete “${roomToDelete.title}”?` : "Delete room?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-[#475569]">
                            This removes the room and its loci and questions. It can't be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-3 sm:justify-center mt-2">
                        <AlertDialogCancel className="flex-1 py-3.5 h-auto border-none bg-[#EAF4FF] hover:bg-[#dcebff] text-[#091A7A] font-semibold rounded-2xl">
                            Keep room
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                if (deleteRoomId) {
                                    actions.deleteRoom(palaceId, deleteRoomId);
                                    setDeleteRoomId(null);
                                    toast.success("Room deleted");
                                }
                            }}
                            className="flex-1 py-3.5 h-auto bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reset / delete palace confirms */}
            <AlertDialog open={confirm === "reset"} onOpenChange={(o) => !o && setConfirm(null)}>
                <AlertDialogContent className="sm:max-w-[380px] rounded-3xl!">
                    <AlertDialogHeader>
                        <div className="w-14 h-14 bg-[#EAF4FF] rounded-full flex items-center justify-center mx-auto mb-3">
                            <RotateCcw size={26} className="text-[#091A7A]"/>
                        </div>
                        <AlertDialogTitle className="text-center text-[#091A7A] text-lg">
                            Reset this palace's progress?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-[#475569]">
                            Every room goes back to not started. Your loci and questions are kept.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-3 sm:justify-center mt-2">
                        <AlertDialogCancel className="flex-1 py-3.5 h-auto border-none bg-[#EAF4FF] hover:bg-[#dcebff] text-[#091A7A] font-semibold rounded-2xl">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                actions.resetPalaceProgress(palaceId);
                                setConfirm(null);
                                setShowSettings(false);
                                toast.success("Progress reset");
                            }}
                            className="flex-1 py-3.5 h-auto bg-[#091A7A] hover:bg-[#0a2090] text-white font-semibold rounded-2xl"
                        >
                            Reset
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={confirm === "delete"} onOpenChange={(o) => !o && setConfirm(null)}>
                <AlertDialogContent className="sm:max-w-[380px] rounded-3xl!">
                    <AlertDialogHeader>
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Trash2 size={26} className="text-red-600"/>
                        </div>
                        <AlertDialogTitle className="text-center text-[#091A7A] text-lg">
                            Delete “{palace.name}”?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-[#475569]">
                            This can't be undone. Every room, locus, question, and your progress here are
                            deleted for good.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-3 sm:justify-center mt-2">
                        <AlertDialogCancel className="flex-1 py-3.5 h-auto border-none bg-[#EAF4FF] hover:bg-[#dcebff] text-[#091A7A] font-semibold rounded-2xl">
                            Keep palace
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                actions.deletePalace(palaceId);
                                setConfirm(null);
                                onBack();
                            }}
                            className="flex-1 py-3.5 h-auto bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl"
                        >
                            Delete palace
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// --- Per-palace settings sheet ----------------------------------------------

function SettingRow({
                        icon,
                        label,
                        sublabel,
                        onClick,
                        right,
                        danger,
                    }: {
    icon: React.ReactNode;
    label: string;
    sublabel?: string;
    onClick?: () => void;
    right?: React.ReactNode;
    danger?: boolean;
}) {
    const Comp = onClick ? motion.button : "div";
    return (
        <Comp
            {...(onClick ? {whileTap: {scale: 0.98}, onClick} : {})}
            className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left ${
                onClick ? "transition-colors hover:bg-[#091A7A]/[0.03]" : ""
            }`}
        >
            <div
                className={`w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0 ${
                    danger ? "bg-red-50" : "bg-[#EAF4FF]"
                }`}
            >
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p
                    className={`text-[15px] font-semibold ${
                        danger ? "text-red-500" : "text-[#091A7A]"
                    }`}
                >
                    {label}
                </p>
                {sublabel && (
                    <p className="text-[12px] text-[#64748b] mt-0.5 leading-snug">
                        {sublabel}
                    </p>
                )}
            </div>
            {right}
        </Comp>
    );
}

function SettingsGroup({children}: {children: React.ReactNode}) {
    return (
        <div className="bg-white rounded-[20px] shadow-[0_8px_24px_rgba(9,26,122,0.06)] border border-[#091A7A]/[0.05] overflow-hidden divide-y divide-[#091A7A]/[0.06]">
            {children}
        </div>
    );
}

/** Compact pill segmented control used in the settings sheet. */
function Segmented({
                       value,
                       options,
                       onChange,
                   }: {
    value: string;
    options: {value: string; label: string}[];
    onChange: (value: string) => void;
}) {
    return (
        <div className="flex items-center gap-0.5 rounded-full bg-[#F1F5F9] p-0.5">
            {options.map((o) => {
                const active = o.value === value;
                return (
                    <button
                        key={o.value}
                        onClick={() => onChange(o.value)}
                        className={`rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors ${
                            active
                                ? "bg-[#091A7A] text-white shadow-sm"
                                : "text-[#475569] hover:text-[#091A7A]"
                        }`}
                    >
                        {o.label}
                    </button>
                );
            })}
        </div>
    );
}

function PalaceSettingsSheet({
                                 open,
                                 onOpenChange,
                                 palace,
                                 settings,
                                 onEditPalace,
                                 onUpdateSettings,
                                 onDuplicate,
                                 onExport,
                                 onReset,
                                 onArchive,
                                 onDelete,
                             }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    palace: Palace;
    settings: PalaceSettings;
    onEditPalace: () => void;
    onUpdateSettings: (updates: Partial<PalaceSettings>) => void;
    onDuplicate: () => void;
    onExport: () => void;
    onReset: () => void;
    onArchive: () => void;
    onDelete: () => void;
}) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{x: "100%"}}
                    animate={{x: 0}}
                    exit={{x: "100%"}}
                    transition={{ease: [0.22, 1, 0.36, 1], duration: 0.35}}
                    className="fixed inset-0 z-[100] bg-[#EEF4FF] flex flex-col shadow-[-20px_0_40px_rgba(9,26,122,0.10)]"
                >
                    {/* Header */}
                    <div className="flex-shrink-0 bg-white border-b border-[#091A7A]/[0.06]">
                        <div className="h-safe-top"/>
                        <div className="flex items-center gap-2 px-3 py-2.5">
                            <button
                                onClick={() => onOpenChange(false)}
                                aria-label="Go back"
                                className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center text-[#091A7A] active:scale-95 transition-transform"
                            >
                                <ArrowLeft className="w-5 h-5"/>
                            </button>
                            <div className="min-w-0">
                                <h1 className="text-[18px] font-bold text-[#091A7A] leading-tight">
                                    Palace settings
                                </h1>
                                <p className="text-[12px] text-[#64748b] truncate">
                                    {palace.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-5 space-y-5 pb-[max(env(safe-area-inset-bottom),2rem)]">
                        <div>
                            <h3 className="text-[12px] font-semibold text-[#091A7A]/70 mb-2 px-1 uppercase tracking-wider">
                                Palace
                            </h3>
                            <SettingsGroup>
                                <SettingRow
                                    icon={<Edit2 size={18} className="text-[#091A7A]"/>}
                                    label="Edit name, icon & color"
                                    sublabel="Rename and restyle this palace"
                                    onClick={onEditPalace}
                                    right={<ChevronRight className="w-5 h-5 text-[#091A7A]/30"/>}
                                />
                                <SettingRow
                                    icon={<Copy size={18} className="text-[#091A7A]"/>}
                                    label="Duplicate palace"
                                    sublabel="Copy its rooms, loci, and questions"
                                    onClick={onDuplicate}
                                    right={<ChevronRight className="w-5 h-5 text-[#091A7A]/30"/>}
                                />
                            </SettingsGroup>
                        </div>

                        <div>
                            <h3 className="text-[12px] font-semibold text-[#091A7A]/70 mb-2 px-1 uppercase tracking-wider">
                                Study
                            </h3>
                            <SettingsGroup>
                                <SettingRow
                                    icon={<ArrowLeftRight size={18} className="text-[#091A7A]"/>}
                                    label="Study direction"
                                    sublabel="Which face leads in training"
                                    right={
                                        <Segmented
                                            value={settings.studyDirection}
                                            options={[
                                                {value: "front", label: "Front"},
                                                {value: "back", label: "Back"},
                                            ]}
                                            onChange={(v) =>
                                                onUpdateSettings({
                                                    studyDirection: v as StudyDirection,
                                                })
                                            }
                                        />
                                    }
                                />
                                <SettingRow
                                    icon={<Shuffle size={18} className="text-[#091A7A]"/>}
                                    label="Card order"
                                    sublabel="Default order when browsing"
                                    right={
                                        <Segmented
                                            value={settings.cardOrder}
                                            options={[
                                                {value: "inOrder", label: "List"},
                                                {value: "shuffle", label: "Shuffle"},
                                                {value: "reverse", label: "Reverse"},
                                            ]}
                                            onChange={(v) =>
                                                onUpdateSettings({cardOrder: v as CardOrder})
                                            }
                                        />
                                    }
                                />
                                <SettingRow
                                    icon={<Timer size={18} className="text-[#091A7A]"/>}
                                    label="Quiz timer"
                                    sublabel="Count down each quiz question"
                                    right={
                                        <Switch
                                            checked={settings.quizTimer}
                                            onCheckedChange={(v) =>
                                                onUpdateSettings({quizTimer: v})
                                            }
                                        />
                                    }
                                />
                                <SettingRow
                                    icon={<Shuffle size={18} className="text-[#091A7A]"/>}
                                    label="Shuffle questions"
                                    sublabel="Randomize quiz question order"
                                    right={
                                        <Switch
                                            checked={settings.shuffleQuestions}
                                            onCheckedChange={(v) =>
                                                onUpdateSettings({shuffleQuestions: v})
                                            }
                                        />
                                    }
                                />
                            </SettingsGroup>
                        </div>

                        <div>
                            <h3 className="text-[12px] font-semibold text-[#091A7A]/70 mb-2 px-1 uppercase tracking-wider">
                                Manage
                            </h3>
                            <SettingsGroup>
                                <SettingRow
                                    icon={<DownloadCloud size={18} className="text-[#091A7A]"/>}
                                    label="Export palace"
                                    sublabel="Download as JSON"
                                    onClick={onExport}
                                    right={<ChevronRight className="w-5 h-5 text-[#091A7A]/30"/>}
                                />
                                <SettingRow
                                    icon={<RotateCcw size={18} className="text-[#091A7A]"/>}
                                    label="Reset progress"
                                    sublabel="Keep content, clear completion"
                                    onClick={onReset}
                                    right={<ChevronRight className="w-5 h-5 text-[#091A7A]/30"/>}
                                />
                                <SettingRow
                                    icon={<X size={18} className="text-[#091A7A]"/>}
                                    label={palace.archived ? "Unarchive palace" : "Archive palace"}
                                    sublabel="Hide it from the main list"
                                    onClick={onArchive}
                                    right={<ChevronRight className="w-5 h-5 text-[#091A7A]/30"/>}
                                />
                            </SettingsGroup>
                        </div>

                        <SettingsGroup>
                            <SettingRow
                                icon={<Trash2 size={18} className="text-red-500"/>}
                                label="Delete palace"
                                sublabel="Remove it and all its content"
                                onClick={onDelete}
                                danger
                                right={<ChevronRight className="w-5 h-5 text-red-300"/>}
                            />
                        </SettingsGroup>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// --- Room editor ------------------------------------------------------------

function RoomEditorDrawer({
                              editor,
                              onClose,
                              onCreate,
                              onSave,
                          }: {
    editor: {mode: "add"} | {mode: "edit"; room: StateRoom} | null;
    onClose: () => void;
    onCreate: (data: {
        title: string;
        description: string;
        duration: number;
        isUnlocked: boolean;
    }) => void;
    onSave: (
        roomId: string,
        data: {
            title: string;
            description: string;
            duration: number;
            isUnlocked: boolean;
        },
    ) => void;
}) {
    const editing = editor?.mode === "edit" ? editor.room : null;
    const open = !!editor;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState(10);
    const [isUnlocked, setIsUnlocked] = useState(true);

    // Re-seed the form each time a target opens (the sheet stays mounted).
    useEffect(() => {
        if (open) {
            setTitle(editing?.title ?? "");
            setDescription(editing?.description ?? "");
            setDuration(editing?.duration ?? 10);
            setIsUnlocked(editing ? editing.isUnlocked : true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, editing?.id]);

    const valid = title.trim().length > 0 && description.trim().length > 0;

    const submit = () => {
        if (!valid) return;
        const data = {
            title: title.trim(),
            description: description.trim(),
            duration: Math.max(1, duration || 1),
            isUnlocked,
        };
        if (editing) onSave(editing.id, data);
        else onCreate(data);
    };

    const fieldCls =
        "w-full bg-[#F4F8FF] rounded-xl px-4 text-[15px] text-[#091A7A] placeholder:text-[#091A7A]/40 border-2 border-transparent focus:border-[#4F8EFF]/60 outline-none";

    return (
        <KeyboardSheet
            open={open}
            onClose={onClose}
            title={editing ? "Edit room" : "New room"}
            footer={
                <button
                    onClick={submit}
                    disabled={!valid}
                    className={`w-full py-3.5 rounded-2xl font-semibold transition-colors ${
                        valid
                            ? "bg-[#091A7A] text-white shadow-[0_8px_20px_rgba(9,26,122,0.25)] active:scale-[0.98]"
                            : "bg-[#E2E8F0] text-[#94a3b8] cursor-not-allowed"
                    }`}
                >
                    {editing ? "Save changes" : "Add room"}
                </button>
            }
        >
            <div>
                <label className="block text-[13px] font-semibold text-[#091A7A] mb-1.5">
                    Room name
                </label>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., The Entrance Hall"
                    enterKeyHint="next"
                    className={`${fieldCls} h-12`}
                />
            </div>
            <div>
                <label className="block text-[13px] font-semibold text-[#091A7A] mb-1.5">
                    Description
                </label>
                <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What does this room hold?"
                    rows={3}
                    className={`${fieldCls} py-3 resize-none`}
                />
            </div>
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <label className="block text-[13px] font-semibold text-[#091A7A] mb-1.5">
                        Duration (min)
                    </label>
                    <Input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className={`${fieldCls} h-12`}
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-[13px] font-semibold text-[#091A7A] mb-1.5">
                        Unlocked
                    </label>
                    <div className="h-12 flex items-center justify-between rounded-xl bg-[#F4F8FF] px-4">
                        <span className="text-[14px] text-[#475569]">
                            {isUnlocked ? "Available" : "Locked"}
                        </span>
                        <Switch checked={isUnlocked} onCheckedChange={setIsUnlocked}/>
                    </div>
                </div>
            </div>
        </KeyboardSheet>
    );
}
