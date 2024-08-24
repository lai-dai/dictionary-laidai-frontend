import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6, 'must be at least 6 characters long'),
})
