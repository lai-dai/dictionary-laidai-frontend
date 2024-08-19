import React from 'react'
import { MarketingPageContainer } from '@/components/page-container'
import { getQueryClient } from '@/lib/utils/get-query-client'
import { QUERY_KEYS } from '@/lib/constants/query-key'
import { api } from '@/lib/api'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { WordView } from './_components/view'

export const revalidate = 0

export default async function Page({ params }: { params: { word: string } }) {
  const queryClient = getQueryClient(revalidate)

  if (params.word) {
    await queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.word, params.word],
      queryFn: () => api.get('/dictionary/' + params.word),
    })
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MarketingPageContainer>
        <WordView word={params.word} />
      </MarketingPageContainer>
    </HydrationBoundary>
  )
}
