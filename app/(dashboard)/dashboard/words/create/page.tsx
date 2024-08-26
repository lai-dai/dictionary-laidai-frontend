'use client'

import React from 'react'
import { DashboardPageContainer } from '@/components/page-container'
import { WordForm } from '../_components/form'
import { CreateAndUpdateCard } from '../_components/card'
import { usePathname, useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <DashboardPageContainer asChild>
      <main>
        <CreateAndUpdateCard isCreated>
          <WordForm
            isCreated
            onSubmitCreateSuccess={(data) => {
              router.replace(pathname.replace('create', String(data.id)))
            }}
            onSubmitUpdateSuccess={() => router.back()}
          />
        </CreateAndUpdateCard>
      </main>
    </DashboardPageContainer>
  )
}
