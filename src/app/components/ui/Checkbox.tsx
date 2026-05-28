import { motion } from "motion/react";
import { cn } from "./utils";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Checkbox({ checked, onChange, label, className }: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 cursor-pointer group",
        className
      )}
    >
      <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <motion.div
          initial={false}
          animate={{
            backgroundColor: checked ? "#091A7A" : "rgba(255, 255, 255, 0.4)",
            borderColor: checked ? "#091A7A" : "rgba(255, 255, 255, 0.8)",
            scale: checked ? 1 : 1,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 rounded-[6px] border backdrop-blur-md shadow-sm"
        />
        <motion.svg
          initial={false}
          animate={{
            pathLength: checked ? 1 : 0,
            opacity: checked ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
          className="absolute inset-0 w-full h-full pointer-events-none p-[3px] text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path d="M4 12.6111L8.92308 17.5L20 6.5" />
        </motion.svg>
      </div>
      {label && (
        <span
          className="text-[15px] text-[#000000] select-none leading-[22px] pt-[1px]"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {label}
        </span>
      )}
    </label>
  );
}