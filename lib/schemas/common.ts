import { z } from 'zod'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/common'

export const roleSchema = z.enum(['user', 'admin'])

export const providerSchema = z.enum(['github', 'google', 'credentials'])

export const commonGetAllSchema = z.object({
  page: z.number().default(DEFAULT_PAGE),
  limit: z.number().default(DEFAULT_PAGE_SIZE),
  key: z.string().optional(),
})

export const orderSchema = z.enum(['DESC', 'ASC']).optional()
