import React from 'react'

import { DashboardPageContainer } from '@/components/page-container'
import { CommentsDataTable } from './_components/table'

export default function Page() {
  return (
    <DashboardPageContainer asChild>
      <main>
        <CommentsDataTable />
      </main>
    </DashboardPageContainer>
  )
}
