import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
  'bg-primary text-primary-foreground border border-primary ' +
  'hover:bg-primary-hover hover:shadow-sm active:scale-[0.98]',

  secondary:
    'bg-secondary text-secondary-foreground border border-secondary ' +
    'hover:bg-secondary/90 active:scale-[0.98]',

  outline:
    'border border-border bg-transparent text-foreground ' +
    'hover:bg-muted active:scale-[0.98]',

  ghost:
    'border border-transparent bg-transparent text-foreground ' +
    'hover:bg-muted active:scale-[0.98]',

  danger:
    'border border-destructive bg-destructive text-white ' +
    'hover:bg-destructive/90 active:scale-[0.98]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'focus:ring-ring inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
