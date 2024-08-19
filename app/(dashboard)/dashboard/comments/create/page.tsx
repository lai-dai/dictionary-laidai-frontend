'use client'

import React from 'react'
import { DashboardPageContainer } from '@/components/page-container'
import { CommentsForm } from '../_components/form'
import { CreateAndUpdateCard } from '../_components/layout'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  return (
    <DashboardPageContainer>
      <CreateAndUpdateCard isCreated>
        <CommentsForm isCreated onSubmitSuccess={() => router.back()} />
      </CreateAndUpdateCard>
    </DashboardPageContainer>
  )
}
