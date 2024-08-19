import { commonGetAllSchema } from '@/lib/schemas/common'
import { z } from 'zod'
import { userSchema } from '../../users/_lib/schema'

export const attrSchema = z.object({
  id: z.number(),
  sentence: z.string().min(1, 'require'),
  translate: z.string().optional(),
  idiomId: z.number().min(1, 'greater than 0').optional(),
  definitionId: z.number().min(1, 'greater than 0').optional(),
  wordId: z.number().min(1, 'greater than 0').optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: userSchema,
})

export const createAttrSchema = attrSchema.pick({
  sentence: true,
  translate: true,
  idiomId: true,
  definitionId: true,
  wordId: true,
})

export const getAllAttrSchema = commonGetAllSchema.merge(
  attrSchema
    .pick({
      sentence: true,
      idiomId: true,
      definitionId: true,
      wordId: true,
    })
    .partial()
)
