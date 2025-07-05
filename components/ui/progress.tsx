'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const progressVariants = cva('h-full w-full flex-1 transition-all', {
  variants: {
    variant: {
      default: 'bg-primary',
      empty: 'bg-red-600',
      low: 'bg-orange-400',
      moderate: 'bg-yellow-400',
      high: 'bg-green-500',
      full: 'bg-green-600',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// Fungsi untuk menentukan warna berdasarkan nilai
function getVariantFromValue(
  value: number | null | undefined,
): VariantProps<typeof progressVariants>['variant'] {
  const safeValue = value ?? 0;
  if (safeValue < 20) return 'empty';
  if (safeValue < 40) return 'low';
  if (safeValue < 70) return 'moderate';
  if (safeValue < 100) return 'high';
  return 'full';
}

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressVariants> & {
    fullColor?: boolean;
  };

function Progress({
  className,
  value,
  variant,
  fullColor = false,
  ...props
}: ProgressProps) {
  const computedVariant = fullColor
    ? getVariantFromValue(value)
    : variant || 'default';

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          progressVariants({ variant: computedVariant }),
          className,
        )}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
