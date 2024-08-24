import { z } from 'zod'
import { loginSchema } from './schema'

export type LoginAttr = z.infer<typeof loginSchema>
