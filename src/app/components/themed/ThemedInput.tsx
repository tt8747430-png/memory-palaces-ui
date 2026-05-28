import { InputHTMLAttributes, forwardRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
}

export const ThemedInput = forwardRef<HTMLInputElement, ThemedInputProps>(
  ({ error, helperText, label, className = '', id, ...props }, ref) => {
    const { theme } = useTheme();
    const inputId = id || `themed-input-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-medium text-[var(--theme-text-secondary)]"
            style={{ fontFamily: theme.typography.fontFamily.system }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full
            px-[var(--theme-input-px)]
            py-[var(--theme-input-py)]
            rounded-[var(--theme-radius-md)]
            bg-[var(--theme-bg)]
            border
            ${
              error
                ? 'border-[var(--theme-error)]'
                : 'border-[var(--theme-border)]'
            }
            text-[var(--theme-text-primary)]
            placeholder:text-[var(--theme-text-tertiary)]
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--theme-border-focus)]
            focus:border-transparent
            transition-[var(--theme-transition-base)]
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${className}
          `}
          style={{ fontFamily: theme.typography.fontFamily.system }}
          {...props}
        />
        {helperText && (
          <p
            className={`mt-1.5 text-sm ${
              error
                ? 'text-[var(--theme-error)]'
                : 'text-[var(--theme-text-tertiary)]'
            }`}
            style={{ fontFamily: theme.typography.fontFamily.system }}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

ThemedInput.displayName = 'ThemedInput';
