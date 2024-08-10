import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

export const getQueryClient = cache(
  (staleTime?: number) =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime,
        },
      },
    })
)
