import { motion } from "motion/react";
import { AlertCircle, X } from "lucide-react";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorModal({
  isOpen,
  onClose,
  title,
  message,
  actionLabel = "Try Again",
  onAction,
}: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl pointer-events-auto relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-[#F5F5F7] rounded-full flex items-center justify-center"
          >
            <X size={16} className="text-[#86868B]" />
          </button>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <AlertCircle size={40} className="text-red-600" />
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-[#000000] mb-3"
            >
              {title}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[15px] text-[#86868B] mb-8"
            >
              {message}
            </motion.p>

            <div className="flex gap-3">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-4 bg-[#F5F5F7] rounded-2xl font-semibold text-[#000000]"
              >
                Close
              </motion.button>

              {onAction && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onAction}
                  className="flex-1 py-4 bg-gradient-to-r from-[#007AFF] to-[#0051D5] text-white rounded-2xl font-semibold shadow-lg"
                >
                  {actionLabel}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
