import { ReactNode, HTMLAttributes } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemedCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  elevated?: boolean;
  className?: string;
}

export function ThemedCard({
  children,
  hoverable = false,
  elevated = false,
  className = '',
  ...props
}: ThemedCardProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`
        bg-[var(--theme-card)]
        border border-[var(--theme-border)]
        rounded-[var(--theme-radius-lg)]
        p-[var(--theme-card-padding)]
        ${elevated ? 'shadow-[var(--theme-shadow-lg)]' : 'shadow-[var(--theme-shadow-sm)]'}
        ${hoverable ? 'transition-[var(--theme-transition-base)] hover:shadow-[var(--theme-shadow-xl)] hover:scale-[1.02] cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function ThemedCardHeader({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-[var(--theme-space-4)] ${className}`}>
      {children}
    </div>
  );
}

export function ThemedCardTitle({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const { theme } = useTheme();

  return (
    <h3
      className={`text-xl font-semibold text-[var(--theme-text-primary)] ${className}`}
      style={{ fontFamily: theme.typography.fontFamily.brand }}
    >
      {children}
    </h3>
  );
}

export function ThemedCardDescription({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const { theme } = useTheme();

  return (
    <p
      className={`text-sm text-[var(--theme-text-secondary)] mt-1 ${className}`}
      style={{ fontFamily: theme.typography.fontFamily.system }}
    >
      {children}
    </p>
  );
}

export function ThemedCardContent({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function ThemedCardFooter({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mt-[var(--theme-space-6)] ${className}`}>
      {children}
    </div>
  );
}
