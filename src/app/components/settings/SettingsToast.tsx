import { motion, AnimatePresence } from "motion/react";
import { Check, X, Info, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

interface SettingsToastProps {
  show: boolean;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose: () => void;
  duration?: number;
}

export function SettingsToast({
  show,
  message,
  type = "success",
  onClose,
  duration = 3000,
}: SettingsToastProps) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const config = {
    success: {
      icon: Check,
      bgColor: "from-green-500 to-green-600",
      iconBg: "bg-white/20",
    },
    error: {
      icon: X,
      bgColor: "from-red-500 to-red-600",
      iconBg: "bg-white/20",
    },
    info: {
      icon: Info,
      bgColor: "from-blue-500 to-blue-600",
      iconBg: "bg-white/20",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "from-amber-500 to-amber-600",
      iconBg: "bg-white/20",
    },
  };

  const { icon: Icon, bgColor, iconBg } = config[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] max-w-sm w-full px-6"
        >
          <div
            className={`bg-gradient-to-r ${bgColor} rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-3`}
          >
            <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <p className="text-white font-medium flex-1">{message}</p>
            <button
              onClick={onClose}
              className="w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
