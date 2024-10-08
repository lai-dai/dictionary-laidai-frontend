'use client'
import React, { useEffect } from 'react'
import { Input } from '../ui/input'
import { signIn } from 'next-auth/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { siteConfig } from '@/config/site'
import { useTranslations } from 'next-intl'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form-2'
import { Spinner } from '../ui/spinner'
import { z } from 'zod'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { AlertCircle, BadgeCheck } from 'lucide-react'
import { PasswordInput } from '../ui/password-input'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_INPUTS } from '@/lib/constants/api-input'

export function RegisterForm() {
  const t = useTranslations()
  const register = useMutation({
    mutationFn: (data: any) => api.post(API_INPUTS.register, data),
  })
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      await register.mutateAsync(value)

      toast.success(`${t('Register')} ${t('Success')}`)
    },
    onSubmitInvalid: ({ value, formApi }) => {
      console.error('💥 value', value)
    },
  })
  return (
    <Card className="w-screen max-w-md">
      <CardHeader>
        <CardTitle>
          {t('Welcome to')} {siteConfig.name}
        </CardTitle>
        <CardDescription>
          {t('Join')} {siteConfig.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={form}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <form.Field
              name="name"
              validators={{
                onChange: z
                  .string()
                  .min(1, 'at least 1 character')
                  .max(50, 'no more than 50 characters')
                  .trim(),
              }}
            >
              {(field) => (
                <FormItem field={field} className="mb-4">
                  <FormLabel>
                    {t('Name')}:{' '}
                    {field.state.meta.isValidating && <Spinner size={'xs'} />}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tyler"
                      type="text"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{
                onChange: z.string().email(),
              }}
            >
              {(field) => (
                <FormItem field={field} className="mb-4">
                  <FormLabel>
                    Email:{' '}
                    {field.state.meta.isValidating && <Spinner size={'xs'} />}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="myEmail@gmail.com"
                      type="email"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: z
                  .string()
                  .min(6, 'must be at least 6 characters long'),
              }}
            >
              {(field) => (
                <FormItem field={field} className="mb-4">
                  <FormLabel>
                    {t('Password')}:{' '}
                    {field.state.meta.isValidating && <Spinner size={'xs'} />}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      // placeholder="••••••••"
                      type="password"
                      autoComplete="new-password"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('At least 6 characters long')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            </form.Field>

            <form.Field
              name="passwordConfirm"
              validators={{
                onChangeListenTo: ['password'],
                onChange: ({ value, fieldApi }) => {
                  if (value !== fieldApi.form.getFieldValue('password')) {
                    return 'Passwords do not match'
                  }
                  return undefined
                },
              }}
            >
              {(field) => (
                <FormItem field={field} className="mb-8">
                  <FormLabel>
                    {t('Confirm password')}:{' '}
                    {field.state.meta.isValidating && <Spinner size={'xs'} />}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      // placeholder="••••••••"
                      type="password"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.Field>

            <form.Subscribe selector={(state) => state.errors}>
              {(errors) => {
                return (
                  errors.length > 0 && (
                    <Alert variant={'destructive'}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription className="whitespace-pre">
                        {errors}
                      </AlertDescription>
                    </Alert>
                  )
                )
              }}
            </form.Subscribe>

            {register.isSuccess && <RegisterSuccess />}

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  type="submit"
                >
                  {isSubmitting && <Spinner size={'xs'} className="mr-2" />}
                  {t('Register')} &rarr;
                  <BottomGradient />
                </Button>
              )}
            </form.Subscribe>

            <div className="mt-3">
              <p className="text-muted-foreground text-sm">
                {t('Do have an account')}{' '}
                <Link href={'/login'} className="underline">
                  {t('Login')}
                </Link>
              </p>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 bg-transparent" />

            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => {
                  signIn('google')
                }}
                className="relative group/btn flex space-x-2 items-center px-4 w-full text-black rounded-md font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                type="button"
              >
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Google
                </span>
                <BottomGradient />
              </Button>
              <Button
                onClick={() => {
                  signIn('github')
                }}
                className="relative group/btn flex space-x-2 items-center px-4 w-full text-black rounded-md font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                type="button"
              >
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  GitHub
                </span>
                <BottomGradient />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  )
}

const RegisterSuccess = () => {
  const t = useTranslations()
  const router = useRouter()

  useEffect(() => {
    const sto = setTimeout(() => {
      router.push('/login')
    }, 1000)
    return () => {
      clearTimeout(sto)
    }
  }, [])

  return (
    <Alert variant={'default'}>
      <BadgeCheck className="size-4 text-green-500" />
      <AlertTitle>{t('Success')}</AlertTitle>
      <AlertDescription className="whitespace-pre">
        {`${t('Register')} ${t('Success')}`}
      </AlertDescription>
    </Alert>
  )
}
