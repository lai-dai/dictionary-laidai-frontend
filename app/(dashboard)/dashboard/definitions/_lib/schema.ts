import { commonGetAllSchema } from '@/lib/schemas/common'
import { z } from 'zod'
import { userSchema } from '../../users/_lib/schema'

export const attrSchema = z.object({
  id: z.number(),
  translate: z.string().min(1, 'require'),
  definition: z.string().optional(),
  description: z.string().nullable().optional(),
  image: z.string().optional(),
  meaningId: z.number().min(1, 'greater than 0').optional(),
  wordId: z.number().min(1, 'greater than 0').optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: userSchema,
})

export const createAttrSchema = attrSchema.pick({
  definition: true,
  translate: true,
  image: true,
  meaningId: true,
  wordId: true,
  description: true,
})

export const getAllAttrSchema = commonGetAllSchema.merge(
  attrSchema
    .pick({
      definition: true,
      translate: true,
      meaningId: true,
      wordId: true,
    })
    .partial()
)
