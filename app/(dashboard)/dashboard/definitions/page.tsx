import React from 'react'

import { DashboardPageContainer } from '@/components/page-container'
import { DefinitionsDataTable } from './_components/table'

export default function Page() {
  return (
    <DashboardPageContainer asChild>
      <main>
        <DefinitionsDataTable />
      </main>
    </DashboardPageContainer>
  )
}
