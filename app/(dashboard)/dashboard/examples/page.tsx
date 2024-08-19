import React from 'react'

import { DashboardPageContainer } from '@/components/page-container'
import { ExamplesDataTable } from './_components/table'

export default function Page() {
  return (
    <DashboardPageContainer asChild>
      <main>
        <ExamplesDataTable />
      </main>
    </DashboardPageContainer>
  )
}
