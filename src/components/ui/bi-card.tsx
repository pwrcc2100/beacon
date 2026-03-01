'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Card primitive for Beacon Index app theme (.beacon-app).
 * Uses design tokens: surface, border, radius, shadow.
 */
export interface BiCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const BiCard = React.forwardRef<HTMLDivElement, BiCardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-bi-lg border border-bi-border bg-bi-surface text-bi-text shadow-bi-sm',
        className
      )}
      {...props}
    />
  )
);
BiCard.displayName = 'BiCard';

const BiCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-4', className)}
    {...props}
  />
));
BiCardHeader.displayName = 'BiCardHeader';

const BiCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-base font-semibold leading-none tracking-tight text-bi-text', className)}
    {...props}
  />
));
BiCardTitle.displayName = 'BiCardTitle';

const BiCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-bi-textMuted', className)} {...props} />
));
BiCardDescription.displayName = 'BiCardDescription';

const BiCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4 pt-0', className)} {...props} />
));
BiCardContent.displayName = 'BiCardContent';

const BiCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-4 pt-0', className)} {...props} />
));
BiCardFooter.displayName = 'BiCardFooter';

export { BiCard, BiCardHeader, BiCardTitle, BiCardDescription, BiCardContent, BiCardFooter };
