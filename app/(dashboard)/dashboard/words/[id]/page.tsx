'use client'

import React, { useEffect } from 'react'
import { DashboardPageContainer } from '@/components/page-container'
import { WordForm } from '../_components/form'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants/query-key'
import { ResFindOne } from '@/lib/types/common'
import { AttrType } from '../_lib/type'
import { API_INPUTS } from '@/lib/constants/api-input'
import { CreateAndUpdateCard } from '../_components/card'
import { Spinner } from '@/components/ui/spinner'
import { Message } from '@/components/message'
import { getErrorMessage } from '@/lib/utils/error-message'
import { apiWithToken } from '@/lib/api'
import { Center } from '@/components/ui/center'
import { siteConfig } from '@/config/site'

export default function Page({ params }: { params: { id: string } }) {
  const searchData = useQuery<ResFindOne<AttrType>>({
    queryKey: [QUERY_KEYS.words, params.id],
    queryFn: () =>
      apiWithToken.get<ResFindOne<AttrType>>(
        API_INPUTS.words + `/${params.id}`
      ),
    enabled: !Number.isNaN(+params.id),
  })

  useEffect(() => {
    if (searchData.status === 'success') {
      document.title = searchData.data.data.word + ' - ' + siteConfig.name
    }
  }, [searchData.status])

  return (
    <DashboardPageContainer asChild>
      <main>
        <CreateAndUpdateCard word={searchData.data?.data.word}>
          {searchData.status === 'pending' ? (
            <Center>
              <Spinner />
            </Center>
          ) : searchData.status === 'error' ? (
            <Center>
              <Message.Error>{getErrorMessage(searchData.error)}</Message.Error>
            </Center>
          ) : (
            <WordForm
              id={params.id}
              defaultValues={searchData.data?.data}
              onSubmitUpdateSuccess={() => {
                searchData.refetch()
              }}
            />
          )}
        </CreateAndUpdateCard>
      </main>
    </DashboardPageContainer>
  )
}
