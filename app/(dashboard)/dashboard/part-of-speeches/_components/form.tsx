'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form-2'
import { Spinner } from '@/components/ui/spinner'
import { z } from 'zod'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { apiWithToken } from '@/lib/api'
import { API_INPUTS } from '@/lib/constants/api-input'
import { ResFindOne } from '@/lib/types/common'
import { PartOfSpeechType } from '@/lib/types/part-of-speeches'
import { QUERY_KEYS } from '@/lib/constants/query-key'
import { TextareaAutoSize } from '@/components/ui/textarea-auto-size'
import { NumericInput } from '@/components/ui/numeric-input'
import { TinyEditor } from '@/components/tiny-editor'

export function PageForm({
  isCreateData,
  total,
  id,
}: {
  isCreateData?: boolean
  total?: number
  id?: string
}) {
  const router = useRouter()
  const createData = useMutation({
    mutationFn: (data: any) =>
      apiWithToken.post<ResFindOne<PartOfSpeechType>>(
        API_INPUTS.partOfSpeeches,
        data
      ),
  })
  const searchData = useQuery<ResFindOne<PartOfSpeechType>>({
    enabled: false,
    queryKey: [QUERY_KEYS.partOfSpeeches, id],
  })
  const updateData = useMutation({
    mutationFn: (data: any) =>
      apiWithToken.patch<ResFindOne<PartOfSpeechType>>(
        API_INPUTS.partOfSpeeches + `/${id}`,
        data
      ),
  })
  const form = useForm({
    defaultValues: {
      name: searchData.data?.data.name || '',
      order: searchData.data?.data.order || (total ? total + 1 : 1),
      abbreviation: searchData.data?.data.abbreviation || '',
      translate: searchData.data?.data.translate || '',
      description: searchData.data?.data.description || '',
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      if (isCreateData) {
        const res = await createData.mutateAsync(value)
        toast.success(res?.message)
        router.back()
      } else {
        const res = await updateData.mutateAsync(value)
        toast.success(res?.message)
      }
    },
    onSubmitInvalid: ({ value }) => {
      console.error('💥 value', value)
    },
  })
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-3">
          <Button onClick={() => router.back()} variant={'outline'}>
            <ArrowLeft size={18} className="mr-3" /> Back
          </Button>
          <div>
            <CardTitle>
              {isCreateData ? 'Create' : 'Update'} Part of Speeches
            </CardTitle>
            <CardDescription>
              Part of Speeches a category to which a word is assigned in
              accordance with its syntactic functions.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <Form form={form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <CardContent className="grid md:grid-cols-2 gap-6">
            <form.Field
              name="name"
              validators={{
                onChange: z.string(),
              }}
            >
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

            <form.Field
              name="abbreviation"
              validators={{
                onChange: z.string(),
              }}
            >
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

            <form.Field
              name="translate"
              validators={{
                onChange: z.string(),
              }}
            >
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

            <form.Field
              name="order"
              validators={{
                onChange: z.number().min(1, 'greater than 1'),
              }}
            >
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

            <form.Field
              name="description"
              validators={{
                onChange: z.string().optional(),
              }}
            >
              {(field) => (
                <FormItem field={field} className="md:col-span-2">
                  <FormLabel>
                    Description:{' '}
                    {field.state.meta.isValidating && <Spinner size={'xs'} />}
                  </FormLabel>
                  <FormControl>
                    <TinyEditor
                      textareaName={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onEditorChange={(value) => field.handleChange(value)}
                    />
                    {/* <TextareaAutoSize
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.Field>
          </CardContent>

          <CardFooter className="sticky bottom-0 bg-background rounded-xl flex-col gap-3">
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

            <div className="flex justify-center">
              <form.Subscribe selector={(state) => [state.isSubmitting]}>
                {([isSubmitting]) => (
                  <Button type="submit">
                    {isSubmitting ? (
                      <Spinner size={'xs'} className="mr-3" />
                    ) : (
                      <Save className="size-4 mr-3" />
                    )}
                    {isCreateData ? 'Create' : 'Save'}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
