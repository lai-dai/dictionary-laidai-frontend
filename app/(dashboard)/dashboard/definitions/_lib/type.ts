import { z } from 'zod'
import { createAttrSchema, getAllAttrSchema, attrSchema } from './schema'

export type AttrType = z.infer<typeof attrSchema>
export type CreateAttrType = z.infer<typeof createAttrSchema>
export type GetAllAttrType = z.infer<typeof getAllAttrSchema>
