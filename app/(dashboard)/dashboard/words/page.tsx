import React from 'react'

import { DashboardPageContainer } from '@/components/page-container'
import { WordsDataTable } from './_components/table'

export default function Page() {
  return (
    <DashboardPageContainer asChild>
      <main>
        <WordsDataTable />
      </main>
    </DashboardPageContainer>
  )
}
