import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'

const spinnerVariants = cva('relative', {
  variants: {
    isSpinning: {
      true: 'block',
      false: 'hidden',
    },
  },
  defaultVariants: {
    isSpinning: true,
  },
})

const loaderVariants = cva('animate-spin', {
  variants: {
    size: {
      xs: 'size-4',
      sm: 'size-6',
      md: 'size-8',
      lg: 'size-12',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

export interface SpinnerProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string
  children?: React.ReactNode
  asChild?: boolean
}

export function Spinner({
  size,
  children,
  className,
  asChild,
  isSpinning,
}: SpinnerProps) {
  if (children) {
    if (isSpinning) {
      const Comp = asChild ? Slot : 'div'
      return (
        <Comp className={spinnerVariants({ isSpinning })}>
          {children}
          <Loader2
            className={cn(
              loaderVariants({ size }),
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              className
            )}
          />
        </Comp>
      )
    }
    return children
  }
  return <Loader2 className={cn(loaderVariants({ size }), className)} />
}
