import { commonGetAllSchema } from '@/lib/schemas/common'
import { z } from 'zod'
import { userSchema } from '../../users/_lib/schema'

export const attrSchema = z.object({
  id: z.number(),
  content: z.string().min(1, 'require').max(1000, 'Over the limit'),
  totalLike: z.number().optional(),
  commentId: z.number().min(1, 'greater than 0').optional(),
  wordId: z.number().min(1, 'greater than 0').optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: userSchema,
})

export const createAttrSchema = attrSchema.pick({
  content: true,
  totalLike: true,
  commentId: true,
  wordId: true,
})

export const getAllAttrSchema = commonGetAllSchema.merge(
  attrSchema
    .pick({
      content: true,
      totalLike: true,
      commentId: true,
      wordId: true,
    })
    .partial()
)
