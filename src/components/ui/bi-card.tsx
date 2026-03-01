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
        'rounded-bi-lg bg-bi-surfaceCard text-bi-text shadow-bi-sm',
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
    className={cn('text-[15px] font-semibold leading-snug tracking-tight text-bi-text', className)}
    {...props}
  />
));
BiCardTitle.displayName = 'BiCardTitle';

const BiCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('bi-body-muted', className)} {...props} />
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
