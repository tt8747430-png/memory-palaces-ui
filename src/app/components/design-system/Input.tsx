import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, helperText, label, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-medium text-[var(--form-label-text)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full
            px-4
            py-2.5
            rounded-[var(--modal-radius)]
            bg-[var(--form-input-bg)]
            border
            ${
              error
                ? 'border-[var(--form-error-border)]'
                : 'border-[var(--form-input-border)]'
            }
            text-[var(--form-input-text)]
            placeholder:text-[var(--form-input-placeholder)]
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--form-input-border-focus)]
            focus:border-transparent
            transition-all
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
                ? 'text-[var(--form-error-text)]'
                : 'text-[var(--form-label-text)]'
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
