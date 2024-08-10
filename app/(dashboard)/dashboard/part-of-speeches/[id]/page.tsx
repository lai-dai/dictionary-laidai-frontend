import React from 'react'
import { DashboardPageContainer } from '@/components/page-container'
import { PageForm } from '../_components/form'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/utils/get-query-client'
import { QUERY_KEYS } from '@/lib/constants/query-key'
import { serverApiWithToken } from '@/lib/api-server'
import { ResFindOne } from '@/lib/types/common'
import { PartOfSpeechType } from '@/lib/types/part-of-speeches'
import { API_INPUTS } from '@/lib/constants/api-input'

export default async function Page({ params }: { params: { id: string } }) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.partOfSpeeches, params.id],
    queryFn: () =>
      serverApiWithToken.get<ResFindOne<PartOfSpeechType>>(
        API_INPUTS.partOfSpeeches + `/${params.id}`
      ),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardPageContainer>
        <PageForm id={params.id} />
      </DashboardPageContainer>
    </HydrationBoundary>
  )
}
