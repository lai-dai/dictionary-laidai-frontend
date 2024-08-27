'use client'

import { Button } from '@/components/ui/button'
import { apiWithToken } from '@/lib/api'
import { API_INPUTS } from '@/lib/constants/api-input'
import { ResFindOne } from '@/lib/types/common'
import { getErrorMessage } from '@/lib/utils/error-message'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AttrType } from '@/app/(dashboard)/dashboard/words/_lib/type'

export function AddButton({ word }: { word: string }) {
  const router = useRouter()

  const createData = useMutation({
    mutationFn: (data: any) =>
      apiWithToken.post<ResFindOne<AttrType>>(API_INPUTS.words, data),
  })

  return (
    <Button
      onClick={() => {
        createData.mutate(
          { word },
          {
            onError(error, variables, context) {
              toast.error(getErrorMessage(error, 'Error'))
            },
            onSuccess(data, variables, context) {
              router.push(`/dashboard/words/${data.data.id}`)
              toast.success('Create successfully')
            },
          }
        )
      }}
    >
      Add {word}
    </Button>
  )
}
