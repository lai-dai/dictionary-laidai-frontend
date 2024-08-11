import { User } from 'next-auth'

export type PartOfSpeechType = {
  id: number
  name: string
  order: number
  abbreviation?: string | null
  translate?: string | null
  description?: string | null
  createdById: number
  updatedAt: string
  createdAt: string
  createdBy: User
}
