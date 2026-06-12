import {motion} from "motion/react";
import {ChevronRight, Plus, Star} from "lucide-react";
import {useProgressState,} from "../../hooks/useProgressState";
import {PalaceCard} from "../cards/PalaceCard";
import {Skeleton} from "../ui/Skeleton";
import {EmptyState} from "../ui/EmptyState";

interface PalacesOverviewProps {
    onPalaceClick: (palaceId: string) => void;
    variant?: "circular" | "cards";
    /** Render skeletons instead of content while palaces resolve. */
    loading?: boolean;
    /** Wires the first-run empty state's "Create palace" action. */
    onCreatePalace?: () => void;
    /** Navigate to the full Palaces tab (the "View all" / "See All" action). */
    onViewAll?: () => void;
}

export function PalacesOverview({
                                    onPalaceClick,
                                    variant = "circular",
                                    loading = false,
                                    onCreatePalace,
                                    onViewAll,
                                }: PalacesOverviewProps) {
    const {state} = useProgressState();
    const palaces = state.palaces;

    const circumference = 2 * Math.PI * 30;

    if (variant === "cards") {
        return (
            <div className="relative mb-6">
                <div className="flex items-center justify-between mb-4 px-6">
                    <motion.h3
                        initial={{opacity: 0, x: -8}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.3}}
                        className="text-lg font-semibold text-[#2c2c2c]"
                    >
                        Popular Palaces
                    </motion.h3>
                    <motion.button
                        initial={{opacity: 0, x: 8}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.4}}
                        whileTap={{scale: 0.95}}
                        onClick={onViewAll}
                        className="text-sm font-semibold text-[#1E5FBF] flex items-center gap-1 hover:gap-2 transition-all"
                    >
                        See All
                        <ChevronRight className="w-4 h-4"/>
                    </motion.button>
                </div>

                {/* Horizontal Scrollable Cards */}
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-4 px-6 pb-2">
                        {palaces.slice(0, 4).map((palace, index) => (
                            <motion.div
                                key={palace.id}
                                initial={{opacity: 0, x: 20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{
                                    delay: 0.5 + index * 0.1,
                                    duration: 0.4,
                                }}
                                className="flex-shrink-0 w-[220px]"
                            >
                                <PalaceCard
                                    id={palace.id}
                                    name={palace.name}
                                    description={palace.description}
                                    icon={palace.icon}
                                    color={palace.color}
                                    image={palace.image}
                                    progress={palace.progress}
                                    totalRooms={palace.totalRooms}
                                    roomsCompleted={palace.roomsCompleted}
                                    difficulty={
                                        palace.totalRooms < 5
                                            ? "Beginner"
                                            : palace.totalRooms < 10
                                                ? "Intermediate"
                                                : "Advanced"
                                    }
                                    variant="default"
                                    onClick={() => onPalaceClick(palace.id)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative mx-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-section-header text-[#091A7A]">
                    Your Memory Palaces
                </h3>
                <motion.button
                    whileTap={{scale: 0.98}}
                    onClick={onViewAll}
                    className="text-xs font-semibold text-[#1E5FBF] flex items-center gap-1 px-3 py-1.5 rounded-[50px] transition-all duration-200 hover:bg-white/30 hover:gap-1.5"
                >
                    View all
                    <ChevronRight className="w-3.5 h-3.5"/>
                </motion.button>
            </div>

            {loading && (
                <div className="grid grid-cols-2 gap-5">
                    {Array.from({length: 2}).map((_, i) => (
                        <Skeleton
                            key={`overview-skeleton-${i}`}
                            className="h-[155px] w-full rounded-[24px]"
                        />
                    ))}
                </div>
            )}

            {!loading && palaces.length === 0 && (
                <EmptyState
                    emoji="🏛️"
                    title="No palaces yet"
                    description="Build a memory palace to start training your recall."
                    action={
                        onCreatePalace ? (
                            <button
                                onClick={onCreatePalace}
                                className="inline-flex items-center gap-2 rounded-full bg-[#091A7A] px-5 py-3 text-sm font-medium text-white shadow-interactive"
                            >
                                <Plus className="h-4 w-4"/>
                                Create palace
                            </button>
                        ) : undefined
                    }
                    className="py-10"
                />
            )}

            {!loading && palaces.length > 0 && (
            <div className="grid grid-cols-2 gap-5">
                {palaces.map((palace, index) => (
                    <motion.div
                        key={palace.id}
                        initial={{opacity: 0, y: 14}}
                        animate={{opacity: 1, y: 0}}
                        transition={{
                            delay: 0.08 + index * 0.06,
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        whileTap={{scale: 0.98}}
                        onClick={() => onPalaceClick(palace.id)}
                        className="relative flex-1 cursor-pointer"
                    >
                        <motion.div
                            className="absolute -top-4 right-2 opacity-90 z-50 pointer-events-none text-5xl"
                            initial={{opacity: 0, scale: 0.85, y: 12}}
                            animate={{opacity: 0.9, scale: 1, y: 0}}
                            transition={{
                                delay: 0.14 + index * 0.06,
                                duration: 0.45,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            style={{
                                filter:
                                    "drop-shadow(0 6px 20px rgba(9, 26, 122, 0.15))",
                            }}
                        >
                            {palace.icon}
                        </motion.div>

                        <div
                            className="relative p-4 backdrop-blur-lg border rounded-[24px] overflow-hidden group h-[155px]"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(173, 200, 255, 0.9) 0%, rgba(173, 200, 255, 0.7) 100%)",
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                                borderColor: "rgba(255, 255, 255, 0.3)",
                                boxShadow:
                                    "0 10px 28px rgba(9, 26, 122, 0.14)",
                            }}
                        >
                            {palace.progress >= 70 && (
                                <motion.div
                                    initial={{scale: 0, rotate: -15}}
                                    animate={{scale: 1, rotate: 0}}
                                    transition={{
                                        delay: 0.5 + index * 0.06,
                                        type: "spring",
                                        stiffness: 300,
                                    }}
                                    className="absolute -top-2 -right-2 z-30 p-1 rounded-full bg-gradient-to-br from-[#FFC71E] to-[#F59E0B]"
                                >
                                    <Star
                                        className="w-4 h-4 text-white"
                                        fill="currentColor"
                                    />
                                </motion.div>
                            )}

                            <div className="h-full flex flex-col items-center justify-center text-center gap-[2px]">
                                <motion.div className="relative">
                                    <svg
                                        viewBox="0 0 80 80"
                                        className="size-20"
                                        style={{
                                            filter:
                                                "drop-shadow(0 4px 8px rgba(9, 26, 122, 0.15))",
                                        }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id={`progressGradient-${palace.id}`}
                                                x1="0%"
                                                y1="100%"
                                                x2="0%"
                                                y2="0%"
                                            >
                                                <stop offset="0%" stopColor="#091a7a"/>
                                                <stop
                                                    offset="50%"
                                                    stopColor="#1a2fb8"
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="#3b82f6"
                                                />
                                            </linearGradient>
                                        </defs>

                                        <circle
                                            cx="40"
                                            cy="40"
                                            r="30"
                                            fill="none"
                                            stroke="rgba(255, 255, 255, 0.3)"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                        />

                                        <motion.circle
                                            cx="40"
                                            cy="40"
                                            r="30"
                                            fill="none"
                                            stroke={`url(#progressGradient-${palace.id})`}
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                            strokeDasharray={circumference}
                                            initial={{
                                                strokeDashoffset: circumference,
                                            }}
                                            animate={{
                                                strokeDashoffset:
                                                    circumference -
                                                    (palace.progress / 100) *
                                                    circumference,
                                            }}
                                            transition={{
                                                delay: 0.2 + index * 0.06,
                                                duration: 0.9,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            transform="rotate(-90 40 40)"
                                        />
                                    </svg>

                                    <motion.div
                                        initial={{scale: 0, opacity: 0}}
                                        animate={{scale: 1, opacity: 1}}
                                        transition={{
                                            delay: 0.45 + index * 0.06,
                                            duration: 0.4,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                        className="absolute inset-0 flex items-center justify-center text-section-header text-[#091A7A]"
                                    >
                                        {palace.progress}%
                                    </motion.div>
                                </motion.div>

                                <div className="space-y-1">
                                    <h4 className="text-subheading text-[#091A7A]">
                                        {palace.name}
                                    </h4>
                                    <p className="text-[11px] font-medium text-[#33417A]">
                                        {palace.roomsCompleted}/{palace.totalRooms}{" "}
                                        rooms
                                    </p>
                                </div>
                            </div>

                            <div
                                className="absolute inset-0 pointer-events-none rounded-[24px] bg-gradient-to-br from-white/10 via-white/5 to-transparent"/>
                        </div>
                    </motion.div>
                ))}
            </div>
            )}
        </div>
    );
}