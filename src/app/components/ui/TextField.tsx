import { useState, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  variant?: "outlined" | "filled";
}

export function TextField({
  label,
  error,
  helperText,
  leadingIcon,
  trailingIcon,
  variant = "filled",
  type = "text",
  className = "",
  ...props
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const actualType = isPassword && showPassword ? "text" : type;

  return (
    <div className="w-full">
      {label && (
        <label
          className="block text-[13px] font-medium text-[#86868B] mb-[6px]"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leadingIcon && (
          <div className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#86868B]">
            {leadingIcon}
          </div>
        )}

        <input
          type={actualType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full h-[50px] rounded-[10px] text-[17px]
            transition-all duration-200
            ${leadingIcon ? "pl-[44px]" : "pl-[16px]"}
            ${isPassword || trailingIcon ? "pr-[44px]" : "pr-[16px]"}
            ${
              variant === "filled"
                ? `bg-[rgba(120,120,128,0.12)] border-0 ${isFocused ? "bg-[rgba(120,120,128,0.16)]" : ""}`
                : `bg-white border ${isFocused ? "border-[#007AFF] ring-4 ring-[#007AFF]/10" : error ? "border-[#FF3B30]" : "border-[#D1D1D6]"}`
            }
            text-[#000000] placeholder:text-[#86868B]
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#000000] transition-colors p-2"
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}

        {!isPassword && trailingIcon && (
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#86868B]">
            {trailingIcon}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p
          className={`text-[13px] mt-[6px] ${error ? "text-[#FF3B30]" : "text-[#86868B]"}`}
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}