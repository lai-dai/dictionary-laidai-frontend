import { providerSchema, roleSchema } from '@/lib/schemas/common'
import { z } from 'zod'

export const userSchema = z.object({
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
