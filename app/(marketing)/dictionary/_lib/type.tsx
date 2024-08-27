import { User } from 'next-auth'

export type DictionaryAttr = {
  id: number
  word: string
  description: string
  createdAt: string
  updatedAt: string
  createdBy: User
  meanings: {
    id: number
    partOfSpeech: {
      id: number
      name: string
    }
    definitions: {
      id: number
      definition: string
      translate: string
    }[]
  }[]
  relationship: {
    id: number
    word: string
  }[]
}
