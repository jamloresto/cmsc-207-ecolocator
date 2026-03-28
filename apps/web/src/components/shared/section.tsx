import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Container } from '@/components/shared/container';

type SectionProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  withContainer?: boolean;
};

export function Section({
  children,
  className,
  containerClassName,
  withContainer = true,
}: SectionProps) {
  const content = withContainer ? (
    <Container className={containerClassName}>{children}</Container>
  ) : (
    children
  );

  return (
    <section className={cn('py-16 md:py-24', className)}>{content}</section>
  );
}
