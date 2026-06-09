import {motion} from "motion/react";
import {Heart, X} from "lucide-react";
import {useState} from "react";

interface SearchResultProps {
    id: string;
    name: string;
    description: string;
    icon: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    totalRooms: number;
    estimatedTime: string;
    rating: number;
    isFavorite?: boolean;
    isHighlighted?: boolean;
    onClick: () => void;
    onFavoriteToggle?: () => void;
}

export function SearchResultCard({
                                     name,
                                     icon,
                                     difficulty,
                                     totalRooms,
                                     estimatedTime,
                                     rating,
                                     isFavorite = false,
                                     isHighlighted = false,
                                     onClick,
                                     onFavoriteToggle,
                                 }: SearchResultProps) {
    const [localFavorite, setLocalFavorite] = useState(isFavorite);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLocalFavorite(!localFavorite);
        onFavoriteToggle?.();
    };

    return (
        <motion.div
            whileHover={{y: -2}}
            whileTap={{scale: 0.98}}
            onClick={onClick}
            className={`relative rounded-2xl shadow-[0px_10px_18px_0px_rgba(19,44,74,0.04)] overflow-hidden cursor-pointer ${
                isHighlighted
                    ? "bg-gradient-to-br from-[#3d8fef] to-[#4F8EFF]"
                    : "bg-white"
            }`}
        >
            <div className="flex items-center gap-4 p-3">
                {/* Thumbnail */}
                <div
                    className={`w-[110px] h-[88px] rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isHighlighted
                            ? "bg-white/20 backdrop-blur-sm"
                            : "bg-gradient-to-br from-[#ADC8FF] to-[#E8F2FF]"
                    }`}
                >
          <span className={`text-5xl ${isHighlighted ? "opacity-90" : ""}`}>
            {icon}
          </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3
                        className={`font-medium text-base mb-1 truncate ${
                            isHighlighted ? "text-white" : "text-[#2c2c2c]"
                        }`}
                    >
                        {name}
                    </h3>
                    <p
                        className={`text-sm mb-2 truncate ${
                            isHighlighted ? "text-white/90" : "text-[#8c8c8c]"
                        }`}
                    >
                        {difficulty} / {totalRooms} rooms
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 20 20"
                                fill="none"
                            >
                                <path
                                    d="M10 0L12.245 6.91L19.511 6.91L13.633 11.18L15.878 18.09L10 13.82L4.122 18.09L6.367 11.18L0.489 6.91L7.755 6.91L10 0Z"
                                    fill="#FFC71E"
                                />
                            </svg>
                            <span
                                className={`text-sm font-medium ${
                                    isHighlighted ? "text-white/80" : "text-[#aeaeae]"
                                }`}
                            >
                {rating}
              </span>
                        </div>

                        <span
                            className={`w-0.5 h-0.5 rounded-full ${
                                isHighlighted ? "bg-white/60" : "bg-[#d2d2d2]"
                            }`}
                        />

                        <span
                            className={`text-sm ${
                                isHighlighted ? "text-white/80" : "text-[#d2d2d2]"
                            }`}
                        >
              {estimatedTime}
            </span>
                    </div>
                </div>

                {/* Favorite Button */}
                <motion.button
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    onClick={handleFavoriteClick}
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isHighlighted
                            ? "bg-white/20 backdrop-blur-sm"
                            : "bg-[#fafafa]"
                    }`}
                >
                    <Heart
                        className={`w-5 h-5 transition-colors ${
                            localFavorite
                                ? "text-[#FF4C4C] fill-current"
                                : isHighlighted
                                    ? "text-white/70"
                                    : "text-[#aeaeae]"
                        }`}
                    />
                </motion.button>
            </div>
        </motion.div>
    );
}

interface SearchFilter {
    id: string;
    label: string;
    active: boolean;
}

interface SearchFiltersProps {
    filters: SearchFilter[];
    onFilterToggle: (filterId: string) => void;
}

export function SearchFilters({filters, onFilterToggle}: SearchFiltersProps) {
    return (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {filters.map((filter, index) => (
                <motion.button
                    key={filter.id}
                    initial={{opacity: 0, x: -10}}
                    animate={{opacity: 1, x: 0}}
                    transition={{delay: index * 0.05}}
                    whileTap={{scale: 0.95}}
                    onClick={() => onFilterToggle(filter.id)}
                    className={`relative flex-shrink-0 rounded-xl px-3 py-1.5 transition-all ${
                        filter.active
                            ? "bg-[#eaf4ff]"
                            : "bg-white"
                    }`}
                >
          <span
              className={`text-base font-medium ${
                  filter.active ? "text-[#3d8fef]" : "text-[#d1d1d1]"
              }`}
          >
            {filter.label}
          </span>

                    {filter.active && (
                        <>
                            <motion.div
                                layoutId="activeFilter"
                                className="absolute inset-0 bg-[#eaf4ff] rounded-xl -z-10"
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30,
                                }}
                            />
                            <motion.button
                                initial={{scale: 0}}
                                animate={{scale: 1}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFilterToggle(filter.id);
                                }}
                                className="ml-2 inline-flex"
                            >
                                <X className="w-3.5 h-3.5 text-[#3d8fef]"/>
                            </motion.button>
                        </>
                    )}
                </motion.button>
            ))}
        </div>
    );
}
