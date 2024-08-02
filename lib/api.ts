import { createFetcher } from './utils/fetcher'

const nextHost = process.env.NEXT_PUBLIC_BASE_URL
const apiHost = process.env.NEXT_PUBLIC_API_URL

export const nextApi = createFetcher({
  baseUrl: nextHost,
})

export const api = createFetcher({
  baseUrl: apiHost,
})
