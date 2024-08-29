'use client'

import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { ReactNode } from 'react'

export function CreateAndUpdateCard({
  children,
  isCreated,
  word,
}: {
  children: ReactNode
  isCreated?: boolean
  word?: string
}) {
  const router = useRouter()
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-3">
          <Button onClick={() => router.back()} variant={'outline'}>
            <ArrowLeft size={18} className="mr-3" /> Back
          </Button>
          <div className="flex gap-3">
            <CardTitle>
              {isCreated ? 'Create' : 'Update'} Word {word ? ': ' + word : ''}
            </CardTitle>
            <CopyButton value={word} />
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
