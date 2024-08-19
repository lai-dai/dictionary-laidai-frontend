import { z } from 'zod'
import {
  createPartOfSpeechSchema,
  getAllPartOfSpeechSchema,
  partOfSpeechSchema,
} from './schema'

export type PartOfSpeechAttr = z.infer<typeof partOfSpeechSchema>
export type CreatePartOfSpeechAttr = z.infer<typeof createPartOfSpeechSchema>
export type GetAllPartOfSpeechAttr = z.infer<typeof getAllPartOfSpeechSchema>
