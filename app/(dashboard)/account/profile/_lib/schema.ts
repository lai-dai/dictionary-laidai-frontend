import { z } from 'zod'

export const updateMeSchema = z
  .object({
    name: z.string().min(1, 'require').max(100, 'maximum 100 characters'),
    email: z
      .string()
      .email()
      .min(1, 'require')
      .max(100, 'maximum 100 characters'),
  })
  .partial()

export const updatePasswordSchema = z
  .object({
    passwordCurrent: z.string().min(1, 'require'),
    password: z.string().min(6, 'must be at least 6 characters long'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'not match password',
    path: ['passwordConfirm'],
  })
