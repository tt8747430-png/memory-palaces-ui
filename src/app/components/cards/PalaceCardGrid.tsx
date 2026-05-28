import { motion } from "motion/react";
import { PalaceCard } from "./PalaceCard";

interface Palace {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  totalRooms: number;
  roomsCompleted: number;
  estimatedTime?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  rating?: number;
  isLocked?: boolean;
  isFavorite?: boolean;
}

interface PalaceCardGridProps {
  palaces: Palace[];
  variant?: "default" | "compact" | "featured";
  columns?: 1 | 2 | 3;
  onPalaceClick: (palaceId: string) => void;
  onFavoriteToggle?: (palaceId: string) => void;
}

export function PalaceCardGrid({
  palaces,
  variant = "default",
  columns = 2,
  onPalaceClick,
  onFavoriteToggle,
}: PalaceCardGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {palaces.map((palace, index) => (
        <motion.div
          key={palace.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.05,
            duration: 0.3,
            ease: "easeOut",
          }}
        >
          <PalaceCard
            {...palace}
            variant={variant}
            onClick={() => onPalaceClick(palace.id)}
            onFavoriteToggle={() => onFavoriteToggle?.(palace.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}
