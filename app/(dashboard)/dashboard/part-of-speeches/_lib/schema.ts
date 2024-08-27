import { commonGetAllSchema, orderSchema } from '@/lib/schemas/common'
import { z } from 'zod'

export const partOfSpeechSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'require'),
  order: z.number().min(1, 'greater than 1'),
  abbreviation: z.string().optional(),
  translate: z.string().optional(),
  description: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const createPartOfSpeechSchema = partOfSpeechSchema.pick({
  abbreviation: true,
  description: true,
  name: true,
  order: true,
  translate: true,
})

export const getAllPartOfSpeechSchema = commonGetAllSchema.merge(
  z
    .object({
      name: z.string(),
      order: z.string(),
    })
    .partial()
)
