import { commonGetAllSchema } from '@/lib/schemas/common'
import { z } from 'zod'
import { userSchema } from '../../users/_lib/schema'

export const attrSchema = z.object({
  id: z.number(),
  idiom: z.string().min(1, 'require'),
  definition: z.string().optional(),
  description: z.string().optional(),
  wordId: z.number().min(1, 'greater than 0').optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: userSchema,
})

export const createAttrSchema = attrSchema.pick({
  idiom: true,
  definition: true,
  description: true,
  wordId: true,
})

export const getAllAttrSchema = commonGetAllSchema.merge(
  attrSchema
    .pick({
      idiom: true,
      wordId: true,
    })
    .partial()
)
