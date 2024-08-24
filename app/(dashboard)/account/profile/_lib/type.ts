import { z } from 'zod'
import { updateMeSchema, updatePasswordSchema } from './schema'

export type UpdateMeAttr = z.infer<typeof updateMeSchema>
export type UpdatePasswordAttr = z.infer<typeof updatePasswordSchema>
