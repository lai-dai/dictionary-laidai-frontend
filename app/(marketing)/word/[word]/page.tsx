import React from 'react'
import { MarketingPageContainer } from '@/components/page-container'
import { getQueryClient } from '@/lib/utils/get-query-client'
import { QUERY_KEYS } from '@/lib/constants/query-key'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { WordView, CommentsView } from './_components/view'
import { serverApiWithToken } from '@/lib/api-server'
import { BackButton } from '@/components/back-button'
import { API_INPUTS } from '@/lib/constants/api-input'
import { auth } from '@/lib/auth'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SearchDictionaryPopover } from '../../dictionary/_components/popover'
import { Metadata } from 'next'
import { ResFindOne } from '@/lib/types/common'
import { WordAttr } from './_lib/type'

export async function generateMetadata({
  params,
}: {
  params: { word: string }
}): Promise<Metadata> {
  try {
    const res = await serverApiWithToken.get<ResFindOne<WordAttr>>(
      `${API_INPUTS.dictionary}/${params.word}`
    )

    return {
      title: res.data.word,
      description:
        res.data.meanings.length > 0
          ? res.data.meanings[0].partOfSpeech.name
          : '',
    }
  } catch (error) {
    return {
      title: 'Tra từ',
    }
  }
}

export const revalidate = 0

export default async function Page({ params }: { params: { word: string } }) {
  const queryClient = getQueryClient(revalidate)
  const session = await auth()

  if (params.word) {
    await queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.dictionary, params.word],
      queryFn: () =>
        serverApiWithToken.get<ResFindOne<WordAttr>>(
          `${API_INPUTS.dictionary}/${params.word}`
        ),
    })
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MarketingPageContainer asChild>
        <main className="space-y-6">
          <BackButton endContent={<SearchDictionaryPopover />} />
          <WordView word={params.word} />
          {session?.user ? (
            <CommentsView word={params.word} />
          ) : (
            <Card>
              <CardHeader className="text-center space-y-3">
                <CardTitle className="text-base">
                  You are not logged in? Please log in to Discussion.
                </CardTitle>
                <div>
                  <Button asChild>
                    <Link href={`/login?callbackUrl=/word/${params.word}`}>
                      Login
                    </Link>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          )}
        </main>
      </MarketingPageContainer>
    </HydrationBoundary>
  )
}
