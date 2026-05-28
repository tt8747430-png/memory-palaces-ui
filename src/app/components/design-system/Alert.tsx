import { ReactNode } from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export type AlertVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

const variantStyles = {
  primary: {
    container:
      'bg-[var(--alert-primary-bg)] border-[var(--alert-primary-border)] text-[var(--alert-primary-text)]',
    icon: 'text-[var(--alert-primary-icon)]',
    defaultIcon: Info,
  },
  secondary: {
    container:
      'bg-[var(--alert-secondary-bg)] border-[var(--alert-secondary-border)] text-[var(--alert-secondary-text)]',
    icon: 'text-[var(--alert-secondary-icon)]',
    defaultIcon: Info,
  },
  success: {
    container:
      'bg-[var(--alert-success-bg)] border-[var(--alert-success-border)] text-[var(--alert-success-text)]',
    icon: 'text-[var(--alert-success-icon)]',
    defaultIcon: CheckCircle,
  },
  warning: {
    container:
      'bg-[var(--alert-warning-bg)] border-[var(--alert-warning-border)] text-[var(--alert-warning-text)]',
    icon: 'text-[var(--alert-warning-icon)]',
    defaultIcon: AlertTriangle,
  },
  error: {
    container:
      'bg-[var(--alert-error-bg)] border-[var(--alert-error-border)] text-[var(--alert-error-text)]',
    icon: 'text-[var(--alert-error-icon)]',
    defaultIcon: XCircle,
  },
  info: {
    container:
      'bg-[var(--alert-info-bg)] border-[var(--alert-info-border)] text-[var(--alert-info-text)]',
    icon: 'text-[var(--alert-info-icon)]',
    defaultIcon: Info,
  },
} as const;

export function Alert({
  variant = 'info',
  title,
  children,
  icon,
  className = '',
}: AlertProps) {
  const styles = variantStyles[variant];
  const Icon = styles.defaultIcon;

  return (
    <div
      className={`rounded-[var(--modal-radius)] border-2 p-4 flex gap-3 ${styles.container} ${className}`}
      role="alert"
    >
      <div className={`flex-shrink-0 ${styles.icon}`}>
        {icon || <Icon size={20} strokeWidth={2} />}
      </div>
      <div className="flex-1 min-w-0">
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
