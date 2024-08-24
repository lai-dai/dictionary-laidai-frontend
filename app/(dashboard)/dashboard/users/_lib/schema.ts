import {
  commonGetAllSchema,
  providerSchema,
  roleSchema,
} from '@/lib/schemas/common'
import { z } from 'zod'

export const attrSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  image: z.string().optional(),
  role: roleSchema.optional(),
  active: z.boolean().optional(),
  provider: providerSchema.default('credentials').optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const userSchema = attrSchema

export const createAttrSchema = attrSchema.pick({
  name: true,
  email: true,
  role: true,
  active: true,
})

export const getAllAttrSchema = commonGetAllSchema.merge(
  attrSchema
    .pick({
      name: true,
      email: true,
      role: true,
    })
    .partial()
)
