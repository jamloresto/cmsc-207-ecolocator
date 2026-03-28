import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-6', className)}>
      {children}
    </div>
  );
}
