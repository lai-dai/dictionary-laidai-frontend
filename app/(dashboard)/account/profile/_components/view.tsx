'use client'

import React, { useState } from 'react'
import { AVATARS } from '@/lib/data/avatars'
import { Image } from '@/components/image'
import { PhotoItem, Photos } from '@/components/ui/photo'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/responsive-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AlertCircle, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form-2'
import { useForm, Validator } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { UpdateMeAttr, UpdatePasswordAttr } from '../_lib/type'
import { updateMeSchema, updatePasswordSchema } from '../_lib/schema'
import { onSubmitInvalid } from '@/lib/utils/on-submit-invalid'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { apiWithToken } from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import { API_INPUTS } from '@/lib/constants/api-input'
import { ResFindOne } from '@/lib/types/common'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { getErrorMessage } from '@/lib/utils/error-message'
import { useUncontrolled } from '@/lib/hooks/use-uncontrolled'
import { PasswordInput } from '@/components/ui/password-input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function AvatarChoose() {
  const [open, setOpen] = useState(false)
  const { data: session, update: setSession } = useSession()
  const currentAvatar = AVATARS.find(
    (item) => item.name === session?.user.image
  )
  const [value, setValue] = useState(session?.user.image)

  const updateData = useMutation({
    mutationFn: (data: any) =>
      apiWithToken.patch<ResFindOne<any>>(API_INPUTS.updateMe, data),
  })

  return (
    <div className="relative inline-block">
      <Photos>
        <Avatar className="size-32 cursor-pointer">
          <PhotoItem>
            <AvatarImage src={currentAvatar?.image} alt={currentAvatar?.name} />
          </PhotoItem>
          <AvatarFallback>{session?.user.name}</AvatarFallback>
        </Avatar>
      </Photos>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={'outline'}
            size={'icon'}
            className="absolute right-2 bottom-2 rounded-full"
          >
            <Camera className="size-4" />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose avatar</DialogTitle>
          </DialogHeader>

          <AvatarList onValueChange={setValue} />

          <DialogFooter className="pt-9">
            <Button
              onClick={() => {
                updateData.mutate(
                  { image: value },
                  {
                    onError(error, variables, context) {
                      toast.error(getErrorMessage(error))
                    },
                    onSuccess(data, variables, context) {
                      setSession({ image: value })
                      toast.error(data.message || 'Successfully')
                      setOpen(false)
                    },
                  }
                )
              }}
            >
              {updateData.isPending && <Spinner className="mr-3" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AvatarList({
  value,
  onValueChange,
}: {
  value?: string
  onValueChange?: (value: string) => void
}) {
  const { data: session } = useSession()

  const [_value, setValue] = useUncontrolled({
    defaultValue: session?.user.image as string,
    value,
    onValueChange,
  })

  return (
    <RadioGroup
      value={_value as any}
      onValueChange={setValue}
      className="grid grid-cols-3 gap-6 place-items-center"
    >
      {AVATARS.map((item) => {
        return (
          <Label
            key={item.name}
            className={cn(
              'cursor-pointer h-40 rounded-xl text-center text-sm text-muted-foreground',
              _value === item.name && 'bg-accent'
            )}
          >
            <RadioGroupItem value={item.name} className="sr-only" />
            <Image src={item.image} alt={item.name} className="size-40" />
            {item.name}
          </Label>
        )
      })}
    </RadioGroup>
  )
}

export function UpdateMeForm() {
  const { data: session, update: setSession } = useSession()

  const updateData = useMutation({
    mutationFn: (data: any) =>
      apiWithToken.patch<ResFindOne<any>>(API_INPUTS.updateMe, data),
  })

  const form = useForm<UpdateMeAttr, Validator<UpdateMeAttr>>({
    defaultValues: {
      email: session?.user.email || '',
      name: session?.user.name || '',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: updateMeSchema,
    },
    onSubmitInvalid: ({ value, formApi }) => {
      const parse = updateMeSchema.safeParse(value)
      onSubmitInvalid(parse, formApi)
    },
    onSubmit: async ({ value }) => {
      const data = updateMeSchema.parse(value)
      await updateData.mutateAsync(data)

      setSession(data)
      toast.success('Update successfully')
    },
  })
  return (
    <Form form={form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-3 min-w-72"
      >
        <form.Field name="name">
          {(field) => (
            <FormItem field={field}>
              <FormLabel>name</FormLabel>
              <FormControl>
                <Input
                  inputMode="text"
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
        <form.Field name="email">
          {(field) => (
            <FormItem field={field}>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input
                  inputMode="email"
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
                  <AlertCircle className="size-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription className="whitespace-pre">
                    {errors}
                  </AlertDescription>
                </Alert>
              )
            )
          }}
        </form.Subscribe>

        <div className="text-center">
          <form.Subscribe selector={(state) => [state.isSubmitting]}>
            {([isSubmitting]) => (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner size={'xs'} className="mr-3" />}
                Save
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </Form>
  )
}

export function ChangePassword() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant={'link'}>
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change passowrd</DialogTitle>
        </DialogHeader>
        <ChangePasswordForm onSubmitSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

function ChangePasswordForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess?: () => void
}) {
  const updateData = useMutation({
    mutationFn: (data: any) =>
      apiWithToken.patch<ResFindOne<any>>(API_INPUTS.updateMyPassword, data),
  })

  const form = useForm<UpdatePasswordAttr, Validator<UpdatePasswordAttr>>({
    defaultValues: {
      password: '',
      passwordConfirm: '',
      passwordCurrent: '',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: updatePasswordSchema,
    },
    onSubmitInvalid: ({ value, formApi }) => {
      const parse = updatePasswordSchema.safeParse(value)
      onSubmitInvalid(parse, formApi)
    },
    onSubmit: async ({ value }) => {
      const data = updatePasswordSchema.parse(value)
      await updateData.mutateAsync(data)
      onSubmitSuccess?.()
      toast.success('Update successfully')
    },
  })

  return (
    <Form form={form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-6 min-w-72"
      >
        <form.Field name="passwordCurrent">
          {(field) => (
            <FormItem field={field}>
              <FormLabel>Password Current</FormLabel>
              <FormControl>
                <PasswordInput
                  inputMode="text"
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
        <form.Field name="password">
          {(field) => (
            <FormItem field={field}>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  inputMode="text"
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
        <form.Field name="passwordConfirm">
          {(field) => (
            <FormItem field={field}>
              <FormLabel>Password Confirm</FormLabel>
              <FormControl>
                <PasswordInput
                  inputMode="text"
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
                  <AlertCircle className="size-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription className="whitespace-pre">
                    {errors}
                  </AlertDescription>
                </Alert>
              )
            )
          }}
        </form.Subscribe>

        <div className="text-center">
          <form.Subscribe selector={(state) => [state.isSubmitting]}>
            {([isSubmitting]) => (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner size={'xs'} className="mr-3" />}
                Change password
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </Form>
  )
}

export function DeleteMe() {
  const deleteData = useMutation({
    mutationFn: () => apiWithToken.delete<ResFindOne<any>>(API_INPUTS.deleteMe),
  })
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          {deleteData.isPending && <Spinner className="mr-3" />}
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            I'm sorry you closed your account. Please contact me if you want to
            reactive it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteData.mutate(undefined, {
                onSuccess(data, variables, context) {
                  toast.success(data.message || 'Successfully')
                  signOut()
                },
                onError(error, variables, context) {
                  toast.error(getErrorMessage(error, 'Error'))
                },
              })
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
