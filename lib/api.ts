import { createFetcher } from './utils/fetcher'

export const api = createFetcher({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
})
