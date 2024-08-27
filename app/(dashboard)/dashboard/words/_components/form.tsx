'use client'
import React from 'react'
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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiWithToken } from '@/lib/api'
import { API_INPUTS } from '@/lib/constants/api-input'
import { ResFindOne } from '@/lib/types/common'
import { TinyEditor } from '@/components/tiny-editor'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { CreateAttrType, AttrType } from '../_lib/type'
import { createAttrSchema } from '../_lib/schema'
import { toast } from 'sonner'
import { onSubmitInvalid } from '@/lib/utils/on-submit-invalid'
import { cn } from '@/lib/utils'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/lib/constants/common'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhoneticsDataTable } from '../../phonetics/_components/table'
import { IdiomsDataTable } from '../../idioms/_components/table'
import { MeaningsDataTable } from '../../meanings/_components/table'
import { NameWordsInput } from '@/components/name-word-input'
import { WordsWordsLinksDataTable } from '../../word-word-links/table'
import { QUERY_KEYS } from '@/lib/constants/query-key'
import { getErrorMessage } from '@/lib/utils/error-message'

export function WordForm({
  isCreated,
  id,
  defaultValues,
  onSubmitUpdateSuccess,
  onSubmitCreateSuccess,
  inModal,
  onClose,
}: {
  isCreated?: boolean
  id?: string
  defaultValues?: AttrType
  onSubmitUpdateSuccess?: (res: AttrType) => void
  onSubmitCreateSuccess?: (res: AttrType) => void
  inModal?: boolean
  onClose?: () => void
}) {
  const queryClient = useQueryClient()
  const createData = useMutation({
    mutationFn: (data: any) =>
      apiWithToken.post<ResFindOne<AttrType>>(API_INPUTS.words, data),
  })

  const updateData = useMutation({
    mutationFn: (data: any) =>
      apiWithToken.patch<ResFindOne<AttrType>>(
        API_INPUTS.words + `/${id}`,
        data
      ),
  })
  const form = useForm<CreateAttrType, Validator<CreateAttrType>>({
    defaultValues: defaultValues || {
      description: '',
      word: '',
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
      try {
        const data = createAttrSchema.parse(value)
        if (isCreated) {
          const res = await createData.mutateAsync(data)

          toast.success('Create successfully')
          onSubmitCreateSuccess?.(res.data)
        } else {
          const res = await updateData.mutateAsync(data)
          toast.success('Update successfully')
          onSubmitUpdateSuccess?.(res.data)
        }
      } catch (error) {
        toast.error(getErrorMessage(error, 'Error'))
      }
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
        <div className="w-full grid md:grid-cols-2 gap-6">
          <form.Field name="word">
            {(field) => (
              <FormItem field={field}>
                <FormLabel>
                  Word:{' '}
                  {field.state.meta.isValidating && <Spinner size={'xs'} />}
                </FormLabel>
                <FormControl>
                  {/* <Input
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  /> */}
                  <NameWordsInput
                    inForm
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onValueChange={(value) => field.handleChange(value)}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </form.Field>

          {!isCreated && (
            <Card className="bg-muted/10">
              <CardHeader className="p-2">
                <CardTitle className="text-sm">relationship</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <WordsWordsLinksDataTable
                  createUpdateInModal
                  navigateMode="none"
                  initFilters={{
                    key: '',
                    page: DEFAULT_PAGE,
                    pageSize: DEFAULT_PAGE_SIZE,
                    wordId: Number(id),
                  }}
                  onSubmitSuccessfully={() => {
                    queryClient.refetchQueries({
                      queryKey: [QUERY_KEYS.words, id],
                    })
                  }}
                  data={defaultValues?.relationship}
                />
              </CardContent>
            </Card>
          )}

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

          {!isCreated && (
            <div className="md:col-span-2 space-y-6 flex flex-col w-full">
              <Card className="bg-muted/10">
                <CardHeader className="p-2">
                  <CardTitle className="text-sm">Phonetics</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <PhoneticsDataTable
                    createUpdateInModal
                    navigateMode="none"
                    initFilters={{
                      key: '',
                      page: DEFAULT_PAGE,
                      pageSize: DEFAULT_PAGE_SIZE,
                      wordId: Number(id),
                    }}
                    initColumnVisibility={{
                      updatedAt: false,
                      description: false,
                    }}
                    word={defaultValues?.word}
                  />
                </CardContent>
              </Card>

              <Card className="bg-muted/10">
                <CardHeader className="p-2">
                  <CardTitle className="text-sm">Meanings</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <MeaningsDataTable
                    createUpdateInModal
                    navigateMode="none"
                    initFilters={{
                      key: '',
                      page: DEFAULT_PAGE,
                      pageSize: DEFAULT_PAGE_SIZE,
                      wordId: Number(id),
                    }}
                    initColumnVisibility={{
                      updatedAt: false,
                      description: false,
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="bg-muted/10">
                <CardHeader className="p-2">
                  <CardTitle className="text-sm">Idioms</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <IdiomsDataTable
                    createUpdateInModal
                    navigateMode="none"
                    initFilters={{
                      key: '',
                      page: DEFAULT_PAGE,
                      pageSize: DEFAULT_PAGE_SIZE,
                      wordId: Number(id),
                    }}
                    initColumnVisibility={{
                      updatedAt: false,
                      description: false,
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div
          className={cn(
            'bg-background flex flex-col gap-6 pt-6',
            !inModal && 'sticky bottom-0 z-10'
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
