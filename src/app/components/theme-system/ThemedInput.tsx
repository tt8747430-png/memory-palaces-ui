import { InputHTMLAttributes, forwardRef } from 'react';

interface ThemedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
  variant?: 'default' | 'filled';
}

export const ThemedInput = forwardRef<HTMLInputElement, ThemedInputProps>(
  ({ error, helperText, label, variant = 'default', className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

    const variantStyles = {
      default: 'bg-transparent border border-[var(--theme-border)]',
      filled: 'bg-[var(--theme-gray-100)] border-2 border-transparent',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-medium text-[var(--theme-text-secondary)]"
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
            ${variantStyles[variant]}
            ${error ? 'border-[var(--theme-error)] focus:ring-[var(--theme-error)]' : 'focus:border-[var(--theme-border-focus)] focus:ring-[var(--theme-border-focus)]'}
            text-[var(--theme-text-primary)]
            placeholder:text-[var(--theme-text-tertiary)]
            focus:outline-none
            focus:ring-2
            transition-[var(--theme-transition-fast)]
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {helperText && (
          <p
            className={`mt-1.5 text-sm ${
              error
                ? 'text-[var(--theme-error)]'
                : 'text-[var(--theme-text-tertiary)]'
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

ThemedInput.displayName = 'ThemedInput';
