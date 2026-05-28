import { ReactNode } from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface ThemedBadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles = {
  primary: 'bg-[var(--theme-primary-light)] text-[var(--theme-primary)] border-[var(--theme-primary)]',
  secondary: 'bg-[var(--theme-secondary-light)] text-[var(--theme-secondary)] border-[var(--theme-secondary)]',
  success: 'bg-[var(--theme-success-light)] text-[var(--theme-success)] border-[var(--theme-success)]',
  warning: 'bg-[var(--theme-warning-light)] text-[var(--theme-warning)] border-[var(--theme-warning)]',
  error: 'bg-[var(--theme-error-light)] text-[var(--theme-error)] border-[var(--theme-error)]',
  info: 'bg-[var(--theme-info-light)] text-[var(--theme-info)] border-[var(--theme-info)]',
} as const;

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
} as const;

export function ThemedBadge({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  dot = false,
}: ThemedBadgeProps) {
  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-[var(--theme-radius-full)]
        font-medium
        border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
