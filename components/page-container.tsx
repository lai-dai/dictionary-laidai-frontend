import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import React, { forwardRef, HTMLAttributes } from 'react'

export const MarketingPageContainer = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean
  }
>(function PageContainer({ className, asChild, ...props }, ref) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      ref={ref}
      className={cn('container max-w-5xl', className)}
      {...props}
    />
  )
})

export const DashboardPageContainer = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean
  }
>(function PageContainer({ className, asChild, ...props }, ref) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp ref={ref} className={cn('container py-4', className)} {...props} />
  )
})
