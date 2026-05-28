import { motion } from "motion/react";
import { useProgressState } from "../../hooks/useProgressState";
import { Trash2, Plus } from "lucide-react";

export function ProgressDebugPanel() {
  const { state, actions } = useProgressState();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-6 mb-6 p-4 bg-white/80 backdrop-blur-lg rounded-[20px] border border-[#E5E5EA] shadow-sm"
    >
      <h3 className="text-section-header text-[#091A7A] mb-4">
        Debug Panel
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-small text-[#6B7280]">
              XP: {state.userXP}
            </p>
            <p className="text-small text-[#6B7280]">
              Level: {state.currentLevel}
            </p>
            <p className="text-small text-[#6B7280]">
              Streak: {state.streakCount} days
            </p>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => actions.addXP(100)}
              className="px-3 py-2 bg-[#091A7A] text-white rounded-[12px] text-small flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              100 XP
            </motion.button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-small text-[#6B7280]">
              Training Days: {state.trainingDays.length}
            </p>
            <p className="text-tiny text-[#9CA3AF]">
              {state.trainingDays.join(", ") || "None"}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => actions.recordTrainingDay()}
            className="px-3 py-2 bg-[#10B981] text-white rounded-[12px] text-small"
          >
            Add Today
          </motion.button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E5E5EA]">
          <p className="text-small text-[#6B7280]">
            Rooms: {state.totalRoomsCompleted}
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => actions.resetProgress()}
            className="px-3 py-2 bg-[#EF4444] text-white rounded-[12px] text-small flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Reset All
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}