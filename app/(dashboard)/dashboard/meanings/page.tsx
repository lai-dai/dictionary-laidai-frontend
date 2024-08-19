import React from 'react'

import { DashboardPageContainer } from '@/components/page-container'
import { MeaningsDataTable } from './_components/table'

export default function Page() {
  return (
    <DashboardPageContainer asChild>
      <main>
        <MeaningsDataTable />
      </main>
    </DashboardPageContainer>
  )
}
