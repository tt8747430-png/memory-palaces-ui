import { motion } from "motion/react";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "liquid-glass"
    | "liquid-glass-text"
    | "primary"
    | "secondary";
  size?: "small" | "medium" | "large";
  icon?: ReactNode;
  children: ReactNode;
}

function LiquidGlassFillShadow() {
  return (
    <div className="absolute inset-0 rounded-[296px] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.12)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-[296px]"
      >
        <div className="absolute bg-[rgba(255,255,255,0.65)] inset-0 rounded-[296px]" />
        <div className="absolute bg-[#ddd] inset-0 mix-blend-color-burn rounded-[296px]" />
        <div className="absolute bg-[#f7f7f7] inset-0 mix-blend-darken rounded-[296px]" />
      </div>
    </div>
  );
}

function LiquidGlassEffect() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[296px]" />
  );
}

export function Button({
  variant = "liquid-glass",
  size = "medium",
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    small: "h-[36px] px-[16px] text-[15px]",
    medium: "h-[48px] px-[20px] text-[17px]",
    large: "h-[56px] px-[24px] text-[17px]",
  };

  if (variant === "liquid-glass") {
    return (
      <motion.button
        className={`relative overflow-hidden rounded-[1000px] flex items-center justify-center gap-[8px] ${sizeClasses[size]} ${className}`}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        disabled={disabled}
        {...props}
      >
        <LiquidGlassFillShadow />
        <LiquidGlassEffect />
        {icon && <span className="relative z-10">{icon}</span>}
        <span
          className="relative z-10 font-medium text-[#1a1a1a] whitespace-nowrap"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            fontVariationSettings: "'wdth' 100",
            fontFeatureSettings: "'ss16'",
          }}
        >
          {children}
        </span>
      </motion.button>
    );
  }

  if (variant === "liquid-glass-text") {
    return (
      <motion.button
        className={`relative overflow-hidden rounded-[100px] flex items-center justify-center gap-[8px] ${sizeClasses[size]} ${className}`}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        disabled={disabled}
        {...props}
      >
        <LiquidGlassFillShadow />
        <LiquidGlassEffect />
        {icon && <span className="relative z-10">{icon}</span>}
        <span
          className="relative z-10 font-medium text-[#1a1a1a] whitespace-nowrap"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            fontVariationSettings: "'wdth' 100",
            fontFeatureSettings: "'ss16'",
          }}
        >
          {children}
        </span>
      </motion.button>
    );
  }

  if (variant === "primary") {
    return (
      <motion.button
        className={`relative overflow-hidden rounded-[1000px] flex items-center justify-center gap-[8px] bg-[#007AFF] hover:bg-[#0051D5] transition-colors ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${sizeClasses[size]} ${className}`}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        disabled={disabled}
        {...props}
      >
        {icon && (
          <span className="relative z-10 text-white">
            {icon}
          </span>
        )}
        <span
          className="relative z-10 font-semibold text-white whitespace-nowrap"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            fontVariationSettings: "'wdth' 100",
          }}
        >
          {children}
        </span>
      </motion.button>
    );
  }

  if (variant === "secondary") {
    return (
      <motion.button
        className={`relative overflow-hidden rounded-[1000px] flex items-center justify-center gap-[8px] bg-[rgba(120,120,128,0.16)] hover:bg-[rgba(120,120,128,0.24)] transition-colors ${sizeClasses[size]} ${className}`}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        disabled={disabled}
        {...props}
      >
        {icon && (
          <span className="relative z-10 text-[#007AFF]">
            {icon}
          </span>
        )}
        <span
          className="relative z-10 font-semibold text-[#007AFF] whitespace-nowrap"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            fontVariationSettings: "'wdth' 100",
          }}
        >
          {children}
        </span>
      </motion.button>
    );
  }

  return null;
}