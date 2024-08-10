export type ResFind<TList> = {
  status: boolean
  data: {
    list: TList
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
  message: string
}

export type ResFindOne<TData> = {
  status: boolean
  data: TData
  message: string
}
