'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()
  return (
    <Button onClick={() => router.back()} variant={'ghost'}>
      <ArrowLeft className="size-4 mr-3" />
      Back
    </Button>
  )
}
