'use client'

import React from 'react'
import { DashboardPageContainer } from '@/components/page-container'
import { FavoritesForm } from '../_components/form'
import { CreateAndUpdateCard } from '../_components/layout'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  return (
    <DashboardPageContainer>
      <CreateAndUpdateCard isCreated>
        <FavoritesForm isCreated onSubmitSuccess={() => router.back()} />
      </CreateAndUpdateCard>
    </DashboardPageContainer>
  )
}
