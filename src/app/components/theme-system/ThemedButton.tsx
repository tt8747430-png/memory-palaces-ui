import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ThemedButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
export type ThemedButtonSize = 'sm' | 'md' | 'lg';

interface ThemedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ThemedButtonVariant;
  size?: ThemedButtonSize;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: `
    bg-[var(--theme-primary)]
    text-[var(--theme-text-on-primary)]
    hover:bg-[var(--theme-primary-hover)]
    active:bg-[var(--theme-primary-active)]
    shadow-[var(--theme-shadow-sm)]
  `,
  secondary: `
    bg-[var(--theme-secondary)]
    text-[var(--theme-text-on-secondary)]
    hover:bg-[var(--theme-secondary-hover)]
    active:bg-[var(--theme-secondary-active)]
  `,
  accent: `
    bg-[var(--theme-accent)]
    text-[var(--theme-text-on-accent)]
    hover:bg-[var(--theme-accent-hover)]
    active:bg-[var(--theme-accent-active)]
  `,
  outline: `
    bg-transparent
    border-2
    border-[var(--theme-primary)]
    text-[var(--theme-primary)]
    hover:bg-[var(--theme-primary)]
    hover:text-[var(--theme-text-on-primary)]
  `,
  ghost: `
    bg-transparent
    text-[var(--theme-primary)]
    hover:bg-[var(--theme-gray-100)]
  `,
} as const;

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-[var(--theme-button-px)] py-[var(--theme-button-py)] text-base',
  lg: 'px-6 py-3 text-lg',
} as const;

export function ThemedButton({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ThemedButtonProps) {
  return (
    <button
      className={`
        rounded-[var(--theme-radius-md)]
        font-medium
        transition-[var(--theme-transition-base)]
        disabled:opacity-50
        disabled:cursor-not-allowed
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
