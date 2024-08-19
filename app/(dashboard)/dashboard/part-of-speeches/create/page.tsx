'use client'

import React from 'react'
import { DashboardPageContainer } from '@/components/page-container'
import { PartOfSpeechesForm } from '../_components/form'
import { CreateAndUpdateCard } from '../_components/layout'
import { useRouter } from 'next/navigation'

export default function Page({
  searchParams,
}: {
  searchParams: { total: string }
}) {
  const router = useRouter()
  return (
    <DashboardPageContainer>
      <CreateAndUpdateCard isCreated>
        <PartOfSpeechesForm
          isCreated
          total={Number(searchParams.total)}
          onSubmitSuccess={() => router.back()}
        />
      </CreateAndUpdateCard>
    </DashboardPageContainer>
  )
}
