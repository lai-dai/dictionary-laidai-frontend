import { DashboardPageContainer } from '@/components/page-container'
import React from 'react'

export default function Page() {
  return (
    <DashboardPageContainer asChild>
      <main className="flex-1 container">my dictionary</main>
    </DashboardPageContainer>
  )
}
