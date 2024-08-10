import { createFetcher } from './utils/fetcher'
import { auth } from './auth'

const apiHost = process.env.NEXT_PUBLIC_API_URL

export const serverApiWithToken = createFetcher({
  baseUrl: apiHost,
  onRequest: async (init) => {
    const session = await auth()

    if (session?.user) {
      (init as Record<string, any>).headers.Authorization =
        `Bearer ${session.user.token}`
    }

    return init
  },
})
