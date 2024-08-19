import React, { forwardRef } from 'react'
import TextareaAutosizeLib, {
  TextareaAutosizeProps,
} from 'react-textarea-autosize'
import { cn } from '@/lib/utils'

export const TextareaAutoSize = forwardRef<
  HTMLTextAreaElement,
  TextareaAutosizeProps
>(function TextareaAutoSize({ className, ...props }, ref) {
  return (
    <TextareaAutosizeLib
      className={cn(
        'flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
