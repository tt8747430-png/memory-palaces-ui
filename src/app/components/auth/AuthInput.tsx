import { motion } from "motion/react";
import type { ReactNode } from "react";

export function ValidCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: 180 }}
      animate={{ scale: 1, rotate: 0 }}
    >
      <div className="w-5 h-5 bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-full" />
        <svg
          width="12"
          height="10"
          viewBox="0 0 12 10"
          fill="none"
          className="relative z-10"
        >
          <path
            d="M1.5 5L4.5 8L10.5 2"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    </motion.div>
  );
}

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  icon: ReactNode;
  rightElement?: ReactNode;
  bottomElement?: ReactNode;
}

export function AuthInput({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  focusedField,
  setFocusedField,
  icon,
  rightElement,
  bottomElement,
}: AuthInputProps) {
  const isFocused = focusedField === id;

  return (
    <motion.div
      animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-2"
    >
      <label
        className="text-small font-medium"
        style={{ color: "#091A7A" }}
      >
        {label}
      </label>
      <div className="relative">
        <motion.div
          animate={
            isFocused
              ? { scale: 1.1, color: "#ADC8FF" }
              : { scale: 1, color: "#6B7280" }
          }
          transition={{ duration: 0.2 }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
        >
          {icon}
        </motion.div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocusedField(id)}
          onBlur={() => setFocusedField(null)}
          className={`w-full h-14 bg-card-glass border border-white/30 rounded-[20px] pl-12 ${
            rightElement ? "pr-12" : "pr-4"
          } text-body placeholder-gray-400 backdrop-blur-lg shadow-card focus:outline-none focus:ring-2 focus:ring-[#ADC8FF]/50 focus:border-[#ADC8FF]/50 animate-touch min-h-[44px] transition-all duration-200`}
          style={{
            fontSize: "14px",
            fontFamily: "Lexend, sans-serif",
          }}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {bottomElement}
    </motion.div>
  );
}
