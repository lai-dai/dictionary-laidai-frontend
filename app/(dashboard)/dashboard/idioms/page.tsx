import React from 'react'

import { DashboardPageContainer } from '@/components/page-container'
import { IdiomsDataTable } from './_components/table'

export default function Page() {
  return (
    <DashboardPageContainer asChild>
      <main>
        <IdiomsDataTable />
      </main>
    </DashboardPageContainer>
  )
}
