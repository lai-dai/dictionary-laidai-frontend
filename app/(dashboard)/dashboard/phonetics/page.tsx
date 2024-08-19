import React from 'react'

import { DashboardPageContainer } from '@/components/page-container'
import { PhoneticsDataTable } from './_components/table'

export default function Page() {
  return (
    <DashboardPageContainer asChild>
      <main>
        <PhoneticsDataTable />
      </main>
    </DashboardPageContainer>
  )
}
