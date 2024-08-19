'use client'

import React from 'react'
import { DashboardPageContainer } from '@/components/page-container'
import { WordForm } from '../_components/form'
import { CreateAndUpdateCard } from '../_components/layout'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  return (
    <DashboardPageContainer asChild>
      <main>
        <CreateAndUpdateCard isCreated>
          <WordForm isCreated onSubmitSuccess={() => router.back()} />
        </CreateAndUpdateCard>
      </main>
    </DashboardPageContainer>
  )
}
