'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm, Validator } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form-2'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { apiWithToken } from '@/lib/api'
import { API_INPUTS } from '@/lib/constants/api-input'
import { ResFindOne } from '@/lib/types/common'
import { CreateAttrType, AttrType } from '../_lib/type'
import { onSubmitInvalid } from '@/lib/utils/on-submit-invalid'
import { createAttrSchema } from '../_lib/schema'
import { cn } from '@/lib/utils'
import { TextareaAutoSize } from '@/components/ui/textarea-auto-size'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export function UsersForm({
  isCreated,
  id,
  defaultValues,
  onSubmitSuccess,
  inModal,
  onClose,
}: {
  isCreated?: boolean
  id?: string
  defaultValues?: CreateAttrType
  onSubmitSuccess?: () => void
  inModal?: boolean
  onClose?: () => void
}) {
  const createData = useMutation({
    mutationFn: (data: any) =>
      apiWithToken.post<ResFindOne<AttrType>>(API_INPUTS.users, data),
  })

  const updateData = useMutation({
    mutationFn: (data: any) =>
      apiWithToken.patch<ResFindOne<AttrType>>(
        API_INPUTS.users + `/${id}`,
        data
      ),
  })
  const form = useForm<CreateAttrType, Validator<CreateAttrType>>({
    defaultValues: defaultValues || {
      email: '',
      name: '',
      role: 'user',
      active: true,
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: createAttrSchema,
    },
    onSubmitInvalid: ({ value, formApi }) => {
      const parse = createAttrSchema.safeParse(value)
      onSubmitInvalid(parse, formApi)
    },
    onSubmit: async ({ value }) => {
      const data = createAttrSchema.parse(value)
      if (isCreated) {
        const res = await createData.mutateAsync(data)
        toast.success(res?.message)
      } else {
        const res = await updateData.mutateAsync(data)
        toast.success(res?.message)
      }
      onSubmitSuccess?.()
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
      >
        <div className="grid md:grid-cols-2 gap-6">
          <form.Field name="name">
            {(field) => (
              <FormItem field={field}>
                <FormLabel>
                  name:{' '}
                  {field.state.meta.isValidating && <Spinner size={'xs'} />}
                </FormLabel>
                <FormControl>
                  <Input
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

          <form.Field name="email">
            {(field) => (
              <FormItem field={field}>
                <FormLabel>
                  email:{' '}
                  {field.state.meta.isValidating && <Spinner size={'xs'} />}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
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

          <form.Field name="role">
            {(field) => (
              <FormItem field={field}>
                <FormLabel>
                  role:{' '}
                  {field.state.meta.isValidating && <Spinner size={'xs'} />}
                </FormLabel>
                <Select
                  onValueChange={(value) => field.handleChange(value as any)}
                  defaultValue={field.state.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          </form.Field>

          <form.Field name="active">
            {(field) => (
              <FormItem field={field} className="flex gap-3 justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">active</FormLabel>
                  <FormDescription>
                    If turned off, the account will be locked.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </form.Field>
        </div>

        <div
          className={cn(
            'bg-background flex flex-col gap-6 pt-6',
            !inModal && 'sticky bottom-0'
          )}
        >
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

          <div className="flex justify-end gap-3">
            {inModal && (
              <Button tabIndex={-1} onClick={onClose} variant="outline">
                Cancel
              </Button>
            )}

            <form.Subscribe selector={(state) => [state.isSubmitting]}>
              {([isSubmitting]) => (
                <Button type="submit">
                  {isSubmitting ? (
                    <Spinner size={'xs'} className="mr-3" />
                  ) : (
                    <Save className="size-4 mr-3" />
                  )}
                  {isCreated ? 'Create' : 'Save'}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </div>
      </form>
    </Form>
  )
}
