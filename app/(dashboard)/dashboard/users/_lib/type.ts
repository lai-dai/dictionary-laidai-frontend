import { z } from 'zod'
import { userSchema } from './schema'

export type UserAttr = z.infer<typeof userSchema>
