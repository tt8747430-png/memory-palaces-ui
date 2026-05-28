import { ReactNode, HTMLAttributes } from 'react';

interface ThemedCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  elevated?: boolean;
  glass?: boolean;
  className?: string;
}

export function ThemedCard({
  children,
  hoverable = false,
  elevated = false,
  glass = false,
  className = '',
  ...props
}: ThemedCardProps) {
  const bgColor = glass ? 'bg-[var(--theme-card-glass)]' : 'bg-[var(--theme-card)]';
  const shadow = elevated ? 'shadow-[var(--theme-shadow-lg)]' : 'shadow-[var(--theme-shadow-md)]';

  return (
    <div
      className={`
        ${bgColor}
        ${glass ? 'backdrop-blur-xl' : ''}
        border
        border-[var(--theme-border)]
        rounded-[var(--theme-radius-lg)]
        p-[var(--theme-card-padding)]
        ${shadow}
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
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function ThemedCardTitle({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-xl font-semibold text-[var(--theme-text-primary)] ${className}`}>
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
  return (
    <p className={`text-sm text-[var(--theme-text-secondary)] mt-1 ${className}`}>
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
  return <div className={`mt-4 pt-4 border-t border-[var(--theme-border)] ${className}`}>{children}</div>;
}
