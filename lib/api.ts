import { getSession } from 'next-auth/react'
import { createFetcher } from './utils/fetcher'

const nextHost = process.env.NEXT_PUBLIC_BASE_URL
const apiHost = process.env.NEXT_PUBLIC_API_URL

export const nextApi = createFetcher({
  baseUrl: typeof window === 'undefined' ? nextHost : window.location.origin,
})

export const api = createFetcher({
  baseUrl: apiHost,
})

export const apiWithToken = createFetcher({
  baseUrl: apiHost,
  onRequest: async (init) => {
    const session = await getSession()

    if (session?.user) {
      (init as Record<string, any>).headers.Authorization =
        `Bearer ${session.user.token}`
    }

    return init
  },
})
