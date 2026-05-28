import { motion } from "motion/react";
import {KeyboardEvent} from "react";
import {MouseEvent} from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: {
    container: "w-[45px] h-[28px]",
    circle: "w-[20px] h-[20px]",
    checkedX: 21,
    uncheckedX: 4,
  },
  md: {
    container: "w-[51px] h-[31px]",
    circle: "w-[27px] h-[27px]",
    checkedX: 22,
    uncheckedX: 2,
  },
  lg: {
    container: "w-[60px] h-[36px]",
    circle: "w-[32px] h-[32px]",
    checkedX: 26,
    uncheckedX: 2,
  },
};

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
  size = "md",
}: ToggleProps) {
  const sizeConfig = SIZES[size];

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        onChange(!checked);
      }
    }
  };

  return (
    <div className="inline-flex items-center gap-[12px] group">
      <div
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          relative ${sizeConfig.container} rounded-full transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${checked ? "bg-[#091A7A]" : "bg-[#d4d6dd]"}
          ${!disabled && "hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#091A7A] focus:ring-offset-2"}
        `}
      >
        <motion.div
          className={`absolute ${sizeConfig.circle} bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.15)]`}
          animate={{
            x: checked ? sizeConfig.checkedX : sizeConfig.uncheckedX,
          }}
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          style={{
            top: size === "sm" ? "4px" : "2px",
          }}
        />
      </div>
      {label && (
        <span
          className={`select-none ${
            disabled ? "opacity-50" : ""
          } text-[15px] text-[#091A7A] font-medium`}
        >
          {label}
        </span>
      )}
    </div>
  );
}