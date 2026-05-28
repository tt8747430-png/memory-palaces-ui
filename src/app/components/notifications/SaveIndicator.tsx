import { motion, AnimatePresence } from "motion/react";
import { Cloud, CloudOff, Check, Loader } from "lucide-react";

interface SaveIndicatorProps {
  show: boolean;
  status: "saving" | "saved" | "error";
}

export function SaveIndicator({
  show,
  status,
}: SaveIndicatorProps) {
  const getIcon = () => {
    switch (status) {
      case "saving":
        return <Loader className="w-3.5 h-3.5 animate-spin" />;
      case "saved":
        return <Check className="w-3.5 h-3.5" />;
      case "error":
        return <CloudOff className="w-3.5 h-3.5" />;
      default:
        return <Cloud className="w-3.5 h-3.5" />;
    }
  };

  const getColors = () => {
    switch (status) {
      case "saving":
        return "bg-blue-500/90 text-white border-blue-400/30";
      case "saved":
        return "bg-green-500/90 text-white border-green-400/30";
      case "error":
        return "bg-red-500/90 text-white border-red-400/30";
      default:
        return "bg-gray-500/90 text-white border-gray-400/30";
    }
  };

  const getText = () => {
    switch (status) {
      case "saving":
        return "Saving...";
      case "saved":
        return "Saved";
      case "error":
        return "Save failed";
      default:
        return "Saved";
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed top-6 right-6 z-50"
        >
          <div
            className={`
            flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium
            backdrop-blur-xl border shadow-lg
            ${getColors()}
          `}
          >
            {getIcon()}
            <span>{getText()}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}