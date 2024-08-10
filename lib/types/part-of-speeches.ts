import { User } from 'next-auth'

export type PartOfSpeechType = {
  id: number
  name: string
  description: string
  order: number
  createdById: number
  updatedAt: string
  createdAt: string
  createdBy: User
}
