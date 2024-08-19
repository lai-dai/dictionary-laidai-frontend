import React from 'react'

import { DashboardPageContainer } from '@/components/page-container'
import { FavoritesDataTable } from './_components/table'

export default function Page() {
  return (
    <DashboardPageContainer asChild>
      <main>
        <FavoritesDataTable />
      </main>
    </DashboardPageContainer>
  )
}
