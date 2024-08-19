import { commonGetAllSchema } from '@/lib/schemas/common'
import { z } from 'zod'
import { userSchema } from '../../users/_lib/schema'

export const attrSchema = z.object({
  id: z.number(),
  description: z.string().optional(),
  partOfSpeechId: z.number().min(1, 'greater than 0').optional(),
  wordId: z.number().min(1, 'greater than 0').optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: userSchema,
})

export const createAttrSchema = attrSchema.pick({
  description: true,
  partOfSpeechId: true,
  wordId: true,
})

export const getAllAttrSchema = commonGetAllSchema.merge(
  attrSchema
    .pick({
      partOfSpeechId: true,
      wordId: true,
    })
    .partial()
)
