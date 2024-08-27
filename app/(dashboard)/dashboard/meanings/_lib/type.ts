import { z } from 'zod'
import { createAttrSchema, getAllAttrSchema, attrSchema } from './schema'

export type AttrType = z.infer<typeof attrSchema> & {
  word: {
    id: number
    word: string
  }
  partOfSpeech: {
    id: number
    name: string
  }
}
export type CreateAttrType = z.infer<typeof createAttrSchema>
export type GetAllAttrType = z.infer<typeof getAllAttrSchema>
