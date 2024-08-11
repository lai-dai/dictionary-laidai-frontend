import React from 'react'
import { DashboardPageContainer } from '@/components/page-container'
import { Spinner } from '@/components/ui/spinner'

export default function Loading() {
  return (
    <DashboardPageContainer className="grid place-content-center flex-1">
      <Spinner size={'lg'} />
    </DashboardPageContainer>
  )
}
