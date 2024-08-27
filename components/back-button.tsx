'use client'

import { useRouter } from 'next/navigation'
import React, { ReactNode } from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BackButton({
  endContent,
  className,
}: {
  endContent?: ReactNode
  className?: string
}) {
  const router = useRouter()
  return (
    <div className={cn('flex justify-between', className)}>
      <Button onClick={() => router.back()} variant={'ghost'}>
        <ArrowLeft className="size-4 mr-3" />
        Back
      </Button>
      {endContent}
    </div>
  )
}
