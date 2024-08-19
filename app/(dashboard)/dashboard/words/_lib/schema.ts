import z from 'zod'
import { userSchema } from '../../users/_lib/schema'
import { commonGetAllSchema } from '@/lib/schemas/common'

export const attrSchema = z.object({
  id: z.number(),
  word: z.string().min(1, 'require'),
  description: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: userSchema,
})

export const createAttrSchema = attrSchema.pick({
  word: true,
  description: true,
})

export const getAllAttrSchema = commonGetAllSchema.merge(
  z
    .object({
      phonetic: z.string(),
    })
    .partial()
)
