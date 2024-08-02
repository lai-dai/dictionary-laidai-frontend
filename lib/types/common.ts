export type ResFind<TList> = {
  status: boolean
  data?: {
    list: TList
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
  message: string
  details?: { message: string }[]
}
