import React from 'react'

import { DashboardPageContainer } from '@/components/page-container'
import { PartOfSpeechesDataTable } from './_components/table'

export default function Page() {
  return (
    <DashboardPageContainer asChild>
      <main>
        <PartOfSpeechesDataTable />
      </main>
    </DashboardPageContainer>
  )
}
