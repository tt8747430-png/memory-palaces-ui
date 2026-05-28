import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export type ThemedButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';
export type ThemedButtonSize = 'sm' | 'md' | 'lg';

interface ThemedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ThemedButtonVariant;
  size?: ThemedButtonSize;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ThemedButtonVariant, string> = {
  primary: `
    bg-[var(--theme-primary)]
    text-[var(--theme-text-on-primary)]
    hover:bg-[var(--theme-primary-hover)]
    active:bg-[var(--theme-primary-active)]
  `,
  secondary: `
    bg-[var(--theme-secondary)]
    text-[var(--theme-text-on-secondary)]
    hover:bg-[var(--theme-secondary-hover)]
    active:bg-[var(--theme-secondary-active)]
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
    text-[var(--theme-text-primary)]
    hover:bg-[var(--theme-gray-100)]
  `,
  success: `
    bg-[var(--theme-success)]
    text-[var(--theme-text-on-accent)]
    hover:bg-[var(--theme-success-dark)]
  `,
  warning: `
    bg-[var(--theme-warning)]
    text-[var(--theme-text-on-secondary)]
    hover:bg-[var(--theme-warning-dark)]
  `,
  error: `
    bg-[var(--theme-error)]
    text-[var(--theme-text-on-primary)]
    hover:bg-[var(--theme-error-dark)]
  `,
};

const sizeStyles: Record<ThemedButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-[var(--theme-button-px)] py-[var(--theme-button-py)] text-base',
  lg: 'px-6 py-3 text-lg',
};

export function ThemedButton({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ThemedButtonProps) {
  const { theme } = useTheme();

  return (
    <button
      className={`
        rounded-[var(--theme-radius-md)]
        font-medium
        transition-[var(--theme-transition-base)]
        disabled:cursor-not-allowed
        disabled:opacity-60
        active:scale-[0.98]
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={{ fontFamily: theme.typography.fontFamily.brand }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
