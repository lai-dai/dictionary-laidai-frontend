import React from 'react'
import { MarketingPageContainer } from '@/components/page-container'
import { getQueryClient } from '@/lib/utils/get-query-client'
import { QUERY_KEYS } from '@/lib/constants/query-key'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { WordView, CommentsView } from './_components/view'
import { serverApiWithToken } from '@/lib/api-server'
import { BackButton } from '@/components/back-button'
import { API_INPUTS } from '@/lib/constants/api-input'

export const metadata = {
  title: 'Tra từ',
}

export const revalidate = 0

export default async function Page({ params }: { params: { word: string } }) {
  const queryClient = getQueryClient(revalidate)

  if (params.word) {
    await queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.dictionary, params.word],
      queryFn: () =>
        serverApiWithToken.get(`${API_INPUTS.dictionary}/${params.word}`),
    })
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MarketingPageContainer asChild>
        <main className="space-y-6">
          <BackButton />
          <WordView word={params.word} />
          <CommentsView word={params.word} />
        </main>
      </MarketingPageContainer>
    </HydrationBoundary>
  )
}
