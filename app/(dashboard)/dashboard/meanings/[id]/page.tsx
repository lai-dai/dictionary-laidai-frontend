'use client'

import React from 'react'
import { DashboardPageContainer } from '@/components/page-container'
import { MeaningsForm } from '../_components/form'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants/query-key'
import { ResFindOne } from '@/lib/types/common'
import { AttrType } from '../_lib/type'
import { API_INPUTS } from '@/lib/constants/api-input'
import { CreateAndUpdateCard } from '../_components/layout'
import { Spinner } from '@/components/ui/spinner'
import { Message } from '@/components/message'
import { getErrorMessage } from '@/lib/utils/error-message'
import { useRouter } from 'next/navigation'
import { apiWithToken } from '@/lib/api'
import { Center } from '@/components/ui/center'

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter()

  const searchData = useQuery<ResFindOne<AttrType>>({
    queryKey: [QUERY_KEYS.phonetics, params.id],
    queryFn: () =>
      apiWithToken.get<ResFindOne<AttrType>>(
        API_INPUTS.phonetics + `/${params.id}`
      ),
    enabled: !Number.isNaN(+params.id),
  })

  return (
    <DashboardPageContainer>
      <CreateAndUpdateCard>
        {searchData.status === 'pending' ? (
          <Center>
            <Spinner />
          </Center>
        ) : searchData.status === 'error' ? (
          <Center>
            <Message.Error>{getErrorMessage(searchData.error)}</Message.Error>
          </Center>
        ) : (
          <MeaningsForm
            id={params.id}
            defaultValues={searchData.data?.data}
            onSubmitSuccess={() => router.back()}
          />
        )}
      </CreateAndUpdateCard>
    </DashboardPageContainer>
  )
}
