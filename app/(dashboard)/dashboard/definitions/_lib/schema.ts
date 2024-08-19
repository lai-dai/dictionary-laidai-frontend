import { commonGetAllSchema } from '@/lib/schemas/common'
import { z } from 'zod'
import { userSchema } from '../../users/_lib/schema'

export const attrSchema = z.object({
  id: z.number(),
  definition: z.string(),
  image: z.string().optional(),
  meaningId: z.number().min(1, 'greater than 0').optional(),
  wordId: z.number().min(1, 'greater than 0').optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: userSchema,
})

export const createAttrSchema = attrSchema.pick({
  definition: true,
  image: true,
  meaningId: true,
  wordId: true,
})

export const getAllAttrSchema = commonGetAllSchema.merge(
  attrSchema
    .pick({
      definition: true,
      meaningId: true,
      wordId: true,
    })
    .partial()
)
