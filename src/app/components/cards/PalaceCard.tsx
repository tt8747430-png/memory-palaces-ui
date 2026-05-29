import {motion} from "motion/react";
import {Clock, Heart, Lock, Play, Star} from "lucide-react";
import {useState} from "react";

interface PalaceCardProps {
    id: string;
    name: string;
    description: string;
    icon: string;
    progress: number;
    totalRooms: number;
    roomsCompleted: number;
    estimatedTime: string;
    difficulty?: "Beginner" | "Intermediate" | "Advanced";
    rating?: number;
    isLocked?: boolean;
    isFavorite?: boolean;
    variant?: "default" | "compact" | "featured";
    onClick?: () => void;
    onFavoriteToggle?: () => void;
}

export function PalaceCard({
                               id,
                               name,
                               description,
                               icon,
                               progress,
                               totalRooms,
                               roomsCompleted,
                               estimatedTime,
                               difficulty = "Beginner",
                               rating,
                               isLocked = false,
                               isFavorite = false,
                               variant = "default",
                               onClick,
                               onFavoriteToggle,
                           }: PalaceCardProps) {
    const [localFavorite, setLocalFavorite] = useState(isFavorite);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLocalFavorite(!localFavorite);
        onFavoriteToggle?.();
    };

    if (variant === "compact") {
        return (
            <motion.div
                whileHover={{y: -4, scale: 1.02}}
                whileTap={{scale: 0.98}}
                onClick={onClick}
                className="bg-white rounded-2xl shadow-[0px_6px_16px_0px_rgba(19,44,74,0.06)] overflow-hidden cursor-pointer relative"
            >
                {/* Image Section */}
                <div
                    className="relative h-[110px] bg-gradient-to-br from-[#ADC8FF] to-[#E8F2FF] flex items-center justify-center overflow-hidden">
                    <span className="text-6xl">{icon}</span>
                    {isLocked && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                                <Lock className="w-5 h-5 text-[#091A7A]"/>
                            </div>
                        </div>
                    )}
                    {!isLocked && progress > 0 && (
                        <div className="absolute top-3 right-3">
                            <div
                                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                                <Play className="w-4 h-4 text-[#091A7A]"/>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-4">
                    <h3 className="font-semibold text-[#2c2c2c] text-base mb-1 truncate">
                        {name}
                    </h3>
                    <p className="text-sm text-[#8c8c8c] mb-3">
                        <span className="font-medium text-[#2c2c2c]">{difficulty}</span>
                        <span className="text-[#aeaeae]"> • {totalRooms} rooms</span>
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-[#eaf4ff] px-2.5 py-1 rounded-lg">
                                <Clock className="w-3.5 h-3.5 text-[#3d8fef]"/>
                                <span className="text-xs font-medium text-[#3d8fef]">
                  {estimatedTime}
                </span>
                            </div>
                            {rating && (
                                <div className="flex items-center gap-1 bg-[#eaf4ff] px-2.5 py-1 rounded-lg">
                                    <Star className="w-3.5 h-3.5 text-[#FFC71E] fill-current"/>
                                    <span className="text-xs font-medium text-[#aeaeae]">
                    {rating}
                  </span>
                                </div>
                            )}
                        </div>

                        <motion.button
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                            onClick={handleFavoriteClick}
                            className="w-8 h-8 bg-[#fafafa] rounded-full flex items-center justify-center"
                        >
                            <Heart
                                className={`w-4 h-4 transition-colors ${
                                    localFavorite
                                        ? "text-[#FF4C4C] fill-current"
                                        : "text-[#aeaeae]"
                                }`}
                            />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (variant === "featured") {
        return (
            <motion.div
                whileHover={{y: -6}}
                whileTap={{scale: 0.98}}
                onClick={onClick}
                className="bg-white rounded-3xl shadow-[0px_10px_28px_0px_rgba(19,44,74,0.08)] overflow-hidden cursor-pointer relative"
            >
                {/* Large Image Section */}
                <div
                    className="relative h-[180px] bg-gradient-to-br from-[#ADC8FF] to-[#E8F2FF] flex items-center justify-center overflow-hidden">
                    <span className="text-8xl">{icon}</span>

                    {/* Favorite Button */}
                    <motion.button
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        onClick={handleFavoriteClick}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                    >
                        <Heart
                            className={`w-5 h-5 transition-colors ${
                                localFavorite
                                    ? "text-[#FF4C4C] fill-current"
                                    : "text-[#aeaeae]"
                            }`}
                        />
                    </motion.button>

                    {/* Progress Badge */}
                    {progress > 0 && !isLocked && (
                        <div
                            className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              <span className="text-xs font-semibold text-[#091A7A]">
                {progress}% Complete
              </span>
                        </div>
                    )}

                    {isLocked && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                                <Lock className="w-8 h-8 text-[#091A7A]"/>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-5">
                    <h3 className="font-bold text-[#2c2c2c] text-xl mb-2">
                        {name}
                    </h3>
                    <p className="text-sm text-[#8c8c8c] mb-4 line-clamp-2">
                        {description}
                    </p>

                    {/* Difficulty & Stats */}
                    <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-semibold text-[#2c2c2c]">
              {difficulty}
            </span>
                        <span className="w-1 h-1 bg-[#d2d2d2] rounded-full"/>
                        <span className="text-sm text-[#aeaeae]">
              {totalRooms} rooms
            </span>
                        {rating && (
                            <>
                                <span className="w-1 h-1 bg-[#d2d2d2] rounded-full"/>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-[#FFC71E] fill-current"/>
                                    <span className="text-sm font-medium text-[#aeaeae]">
                    {rating}
                  </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Time Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#eaf4ff] px-3 py-2 rounded-xl">
                        <Clock className="w-4 h-4 text-[#3d8fef]"/>
                        <span className="text-sm font-medium text-[#3d8fef]">
              {estimatedTime}
            </span>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Default variant
    return (
        <motion.div
            whileHover={{y: -4, scale: 1.01}}
            whileTap={{scale: 0.98}}
            onClick={onClick}
            className="bg-white rounded-2xl shadow-[0px_6px_16px_0px_rgba(19,44,74,0.06)] overflow-hidden cursor-pointer relative group"
        >
            {/* Image Section */}
            <div
                className="relative h-[143px] bg-gradient-to-br from-[#ADC8FF] to-[#E8F2FF] flex items-center justify-center overflow-hidden">
        <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </span>

                {isLocked && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                            <Lock className="w-6 h-6 text-[#091A7A]"/>
                        </div>
                    </div>
                )}

                {!isLocked && (
                    <motion.button
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        onClick={handleFavoriteClick}
                        className="absolute top-3 right-3 w-9 h-9 bg-[#fafafa] rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Heart
                            className={`w-4 h-4 transition-colors ${
                                localFavorite
                                    ? "text-[#FF4C4C] fill-current"
                                    : "text-[#aeaeae]"
                            }`}
                        />
                    </motion.button>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4">
                <h3 className="font-semibold text-[#2c2c2c] text-base mb-1">
                    {name}
                </h3>
                <p className="text-sm mb-3">
                    <span className="font-medium text-[#2c2c2c]">{difficulty}</span>
                    <span className="text-[#aeaeae]"> ({totalRooms} rooms)</span>
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-[#eaf4ff] px-2.5 py-1.5 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-[#3d8fef]"/>
                        <span className="text-sm font-medium text-[#3d8fef]">
              {estimatedTime}
            </span>
                    </div>

                    {rating && (
                        <div className="flex items-center gap-1.5">
                            <Star className="w-5 h-5 text-[#FFC71E] fill-current"/>
                            <span className="text-sm font-medium text-[#aeaeae]">
                {rating}
              </span>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                {progress > 0 && !isLocked && (
                    <div className="mt-3 pt-3 border-t border-[#f2f2f2]">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-[#8c8c8c]">Progress</span>
                            <span className="text-xs font-semibold text-[#091A7A]">
                {progress}%
              </span>
                        </div>
                        <div className="h-1.5 bg-[#f2f2f2] rounded-full overflow-hidden">
                            <motion.div
                                initial={{width: 0}}
                                animate={{width: `${progress}%`}}
                                transition={{duration: 0.8, ease: "easeOut"}}
                                className="h-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-full"
                            />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
