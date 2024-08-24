import React from 'react'

import { DashboardPageContainer } from '@/components/page-container'
import { UsersDataTable } from './_components/table'

export const metadata = {
  title: 'Users',
}

export default function Page() {
  return (
    <DashboardPageContainer asChild>
      <main>
        <UsersDataTable />
      </main>
    </DashboardPageContainer>
  )
}
