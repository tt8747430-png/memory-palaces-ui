import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: `
    bg-[var(--btn-primary-bg)]
    text-[var(--btn-primary-text)]
    hover:bg-[var(--btn-primary-hover)]
    disabled:bg-[var(--btn-disabled-bg)]
    disabled:text-[var(--btn-disabled-text)]
    shadow-sm
  `,
  secondary: `
    bg-[var(--btn-secondary-bg)]
    text-[var(--btn-secondary-text)]
    hover:opacity-90
    disabled:bg-[var(--btn-disabled-bg)]
    disabled:text-[var(--btn-disabled-text)]
  `,
  outline: `
    bg-transparent
    border-2
    border-[var(--btn-outline-border)]
    text-[var(--btn-outline-border)]
    hover:bg-[var(--btn-primary-bg)]
    hover:text-[var(--btn-primary-text)]
    hover:border-transparent
    disabled:border-[var(--btn-disabled-text)]
    disabled:text-[var(--btn-disabled-text)]
  `,
  ghost: `
    bg-transparent
    text-[var(--btn-primary-bg)]
    hover:bg-[var(--card-hover-bg)]
    disabled:text-[var(--btn-disabled-text)]
  `,
} as const;

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
} as const;

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        rounded-[var(--modal-radius)]
        font-medium
        transition-all
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-60
        active:scale-[0.98]
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
