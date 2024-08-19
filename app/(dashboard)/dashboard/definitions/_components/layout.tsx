'use client'

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
}: {
  children: ReactNode
  isCreated?: boolean
}) {
  const router = useRouter()
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-3">
          <Button onClick={() => router.back()} variant={'outline'}>
            <ArrowLeft size={18} className="mr-3" /> Back
          </Button>
          <div>
            <CardTitle>{isCreated ? 'Create' : 'Update'} definitions</CardTitle>
            <CardDescription></CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
