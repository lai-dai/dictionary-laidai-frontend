'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm, Validator } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form-2'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, ChevronDown, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { apiWithToken } from '@/lib/api'
import { API_INPUTS } from '@/lib/constants/api-input'
import { ResFindOne } from '@/lib/types/common'
import { CreatePartOfSpeechAttr, PartOfSpeechAttr } from '../_lib/type'
import { NumericInput } from '@/components/ui/numeric-input'
import { TinyEditor } from '@/components/tiny-editor'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { onSubmitInvalid } from '@/lib/utils/on-submit-invalid'
import { createPartOfSpeechSchema } from '../_lib/schema'
import { cn } from '@/lib/utils'

export function PartOfSpeechesForm({
  isCreated,
  total,
  id,
  defaultValues,
  onSubmitSuccess,
  inModal,
  onClose,
}: {
  isCreated?: boolean
  total?: number
  id?: string
  defaultValues?: PartOfSpeechAttr
  onSubmitSuccess?: () => void
  inModal?: boolean
  onClose?: () => void
}) {
  const createData = useMutation({
    mutationFn: (data: any) =>
      apiWithToken.post<ResFindOne<PartOfSpeechAttr>>(
        API_INPUTS.partOfSpeeches,
        data
      ),
  })

  const updateData = useMutation({
    mutationFn: (data: any) =>
      apiWithToken.patch<ResFindOne<PartOfSpeechAttr>>(
        API_INPUTS.partOfSpeeches + `/${id}`,
        data
      ),
  })
  const form = useForm<
    CreatePartOfSpeechAttr,
    Validator<CreatePartOfSpeechAttr>
  >({
    defaultValues: defaultValues || {
      name: '',
      order: total ? total + 1 : 1,
      abbreviation: '',
      translate: '',
      description: '',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: createPartOfSpeechSchema,
    },
    onSubmitInvalid: ({ value, formApi }) => {
      const parse = createPartOfSpeechSchema.safeParse(value)
      onSubmitInvalid(parse, formApi)
    },
    onSubmit: async ({ value }) => {
      if (isCreated) {
        const res = await createData.mutateAsync(value)
        toast.success(res?.message)
      } else {
        const res = await updateData.mutateAsync(value)
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
                  Name:{' '}
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

          <form.Field name="abbreviation">
            {(field) => (
              <FormItem field={field}>
                <FormLabel>
                  Abbreviation:{' '}
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

          <form.Field name="translate">
            {(field) => (
              <FormItem field={field}>
                <FormLabel>
                  Translate:{' '}
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

          <form.Field name="order">
            {(field) => (
              <FormItem field={field}>
                <FormLabel>
                  Order:{' '}
                  {field.state.meta.isValidating && <Spinner size={'xs'} />}
                </FormLabel>
                <FormControl>
                  <NumericInput
                    min={1}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onValueChange={({ floatValue }) => {
                      field.handleChange(floatValue || 1)
                    }}
                    thousandSeparator={'.'}
                    decimalSeparator={','}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <Collapsible asChild>
                <FormItem field={field} className="md:col-span-2">
                  <CollapsibleTrigger asChild>
                    <FormLabel className="flex items-center gap-3 leading-6">
                      Description:{' '}
                      {field.state.meta.isValidating ? (
                        <Spinner size={'xs'} />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </FormLabel>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <FormControl>
                      <TinyEditor
                        init={{ min_height: 300 }}
                        textareaName={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onEditorChange={(value) => field.handleChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </CollapsibleContent>
                </FormItem>
              </Collapsible>
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
