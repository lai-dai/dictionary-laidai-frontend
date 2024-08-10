import React from 'react'
import { DashboardPageContainer } from '@/components/page-container'
import { PageForm } from '../_components/form'

export default function Page({
  searchParams,
}: {
  searchParams: { total: string }
}) {
  return (
    <DashboardPageContainer>
      <PageForm isCreateData total={Number(searchParams.total)} />
    </DashboardPageContainer>
  )
}
