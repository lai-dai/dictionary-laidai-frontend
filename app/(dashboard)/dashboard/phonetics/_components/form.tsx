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
import { useMutation, useQuery } from '@tanstack/react-query'
import { apiWithToken } from '@/lib/api'
import { API_INPUTS } from '@/lib/constants/api-input'
import { ResFindOne } from '@/lib/types/common'
import { CreateAttrType, AttrType } from '../_lib/type'
import { TinyEditor } from '@/components/tiny-editor'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { onSubmitInvalid } from '@/lib/utils/on-submit-invalid'
import { createAttrSchema } from '../_lib/schema'
import { cn } from '@/lib/utils'

export function PhoneticsForm({
  isCreated,
  id,
  defaultValues,
  onSubmitSuccess,
  inModal,
  onClose,
  word,
}: {
  isCreated?: boolean
  id?: string
  defaultValues?: CreateAttrType
  onSubmitSuccess?: () => void
  inModal?: boolean
  onClose?: () => void
  word?: string
}) {
  const createData = useMutation({
    mutationFn: (data: any) =>
      apiWithToken.post<ResFindOne<AttrType>>(API_INPUTS.phonetics, data),
  })

  const updateData = useMutation({
    mutationFn: (data: any) =>
      apiWithToken.patch<ResFindOne<AttrType>>(
        API_INPUTS.phonetics + `/${id}`,
        data
      ),
  })
  const form = useForm<CreateAttrType, Validator<CreateAttrType>>({
    defaultValues: defaultValues || {
      phonetic: '',
      audio: '',
      description: '',
      wordId: undefined,
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
  const searchData = useMutation({
    mutationFn: () =>
      apiWithToken.get<any>(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      ),
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
        <div className="grid gap-6">
          <div className="space-y-1">
            <Button
              onClick={() => {
                if (word) {
                  let phonetic: string
                  let audio: string

                  searchData.mutateAsync().then((res) => {
                    const [data] = res

                    data?.phonetics?.forEach((item: any) => {
                      if (!phonetic) phonetic = item.text
                      if (!audio) audio = item.audio
                    })

                    if (phonetic) {
                      form.reset()
                      form.setFieldValue('phonetic', phonetic)
                    }
                    if (audio) {
                      form.setFieldValue('audio', audio)
                    }
                  })
                } else {
                  toast.error('Not word found')
                }
              }}
            >
              {searchData.isPending && <Spinner className="size-4 mr-3" />}
              Auto generator
            </Button>
            <p className="text-sm text-muted-foreground">
              from: {`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`}
            </p>
          </div>

          <form.Field name="phonetic">
            {(field) => (
              <FormItem field={field}>
                <FormLabel>
                  phonetic:{' '}
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

          <form.Field name="audio">
            {(field) => (
              <FormItem field={field}>
                <FormLabel>
                  audio:{' '}
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

          <form.Field name="description">
            {(field) => (
              <Collapsible asChild>
                <FormItem field={field}>
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
              <Button onClick={onClose} variant="outline">
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
