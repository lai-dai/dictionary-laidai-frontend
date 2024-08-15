import React from 'react'

import { DashboardPageContainer } from '@/components/page-container'
import { PageDataTable } from './_components/table'

export default function Page() {
  return (
    <DashboardPageContainer asChild>
      <main>
        <PageDataTable />
      </main>
    </DashboardPageContainer>
  )
}
