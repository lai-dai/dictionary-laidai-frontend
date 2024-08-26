import { commonGetAllSchema } from '@/lib/schemas/common'
import { z } from 'zod'

export const attrSchema = z.object({
  id: z.number(),
  wordId: z.number().min(1, 'greater than 0'),
  relationshipId: z.number().min(1, 'greater than 0'),
})

export const createAttrSchema = attrSchema.pick({
  wordId: true,
  relationshipId: true,
})

export const getAllAttrSchema = commonGetAllSchema.merge(
  attrSchema
    .pick({
      wordId: true,
    })
    .partial()
)
