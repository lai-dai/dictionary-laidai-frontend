'use client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { QUERY_KEYS } from '@/lib/constants/query-key'
import { ResFind, ResFindOne } from '@/lib/types/common'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { CommentAttr, WordAttr } from '../_lib/type'
import { Center } from '@/components/ui/center'
import { Spinner } from '@/components/ui/spinner'
import { Message } from '@/components/message'
import { getErrorMessage } from '@/lib/utils/error-message'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { firstLetterBuilder } from '@/lib/utils/first-letter-builder'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  AlertCircle,
  AudioLines,
  Edit2,
  EllipsisVertical,
  NotebookPen,
  TextQuote,
} from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { apiWithToken } from '@/lib/api'
import { useSession } from 'next-auth/react'
import { BookmarkFilledIcon, BookmarkIcon } from '@radix-ui/react-icons'
import { TextareaAutoSize } from '@/components/ui/textarea-auto-size'
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form-2'
import { useForm, Validator } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { onSubmitInvalid } from '@/lib/utils/on-submit-invalid'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
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
import { API_INPUTS } from '@/lib/constants/api-input'
import { Badge } from '@/components/ui/badge'
import { AudioButton } from '@/components/audio-button'
import Link from 'next/link'
import { PhotoItem, Photos } from '@/components/ui/photo'
import { Image } from '@/components/image'
import { AddButton } from './button'
import { AVATARS } from '@/lib/data/avatars'

export function WordView({
  word,
  enabled,
  staleTime,
  gcTime,
  queryKey = [QUERY_KEYS.dictionary, word],
  hidden,
  className,
}: {
  word: string
  enabled?: boolean
  staleTime?: number
  gcTime?: number
  queryKey?: string[]
  hidden?: boolean
  className?: string
}) {
  const { data: session } = useSession()

  const searchData = useQuery({
    queryKey,
    queryFn: () =>
      apiWithToken.get<ResFindOne<WordAttr>>(
        `${API_INPUTS.dictionary}/${word}`
      ),
    enabled: Boolean(enabled) && Boolean(word),
    staleTime,
    gcTime,
  })

  const [isFavorite, setIsFavorite] = useState(!!searchData.data?.data.favorite)

  const addFavorite = useMutation({
    mutationFn: (data: any) => apiWithToken.post('/favorites/toggle', data),
  })

  if (searchData.status === 'pending') {
    return (
      <Center>
        <Card className={cn('shadow-none', className)}>
          <CardHeader>
            <Spinner />
          </CardHeader>
        </Card>
      </Center>
    )
  } else if (searchData.status === 'error') {
    return (
      <Center>
        <Card className={cn('shadow-none', className)}>
          <CardHeader>
            <Message.Error>{getErrorMessage(searchData.error)}</Message.Error>
          </CardHeader>
          {session?.user.role === 'admin' && (
            <CardFooter>
              <AddButton word={word} />
            </CardFooter>
          )}
        </Card>
      </Center>
    )
  }
  const data = searchData.data?.data

  const currentAvatar = AVATARS.find(
    (item) => item.name === data.createdBy.image
  )

  if (hidden) return null

  return (
    <Card className={cn('shadow-none', className)}>
      <CardHeader className="p-2 md:p-4">
        <div className="flex items-center justify-between gap-6">
          <CardTitle>
            <Link href={`/word/${word}`}>{data.word}</Link>
            {session?.user.role === 'admin' && (
              <Button
                asChild
                variant={'secondary'}
                size={'icon'}
                className="size-8 ml-3"
              >
                <Link target="_blank" href={`/dashboard/words/${data.id}`}>
                  <Edit2 className="size-4" />
                </Link>
              </Button>
            )}
          </CardTitle>

          <Button
            onClick={() => {
              addFavorite.mutate(
                {
                  id: data?.favorite?.id || 0,
                  wordId: data.id,
                  currentFavorite: isFavorite,
                },
                {
                  onError(error, variables, context) {
                    toast.error(error.message || 'Lỗi')
                  },
                  onSuccess: () => {
                    searchData.refetch()
                  },
                }
              )
              setIsFavorite(!isFavorite)
            }}
            disabled={!session?.user || addFavorite.isPending}
            variant={'outline'}
          >
            {addFavorite.isPending ? (
              <Spinner className="size-3" />
            ) : isFavorite ? (
              <BookmarkFilledIcon className="size-5 mr-3" />
            ) : (
              <BookmarkIcon className="size-5 mr-3" />
            )}
            Save
          </Button>
        </div>
        {data.phonetics.length > 0 && (
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            {data.phonetics.map((item) => {
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <p>{item.phonetic}</p>
                  {item.audio && (
                    <AudioButton src={item.audio} variant={'ghost'}>
                      <AudioLines className="size-5 mr-3" />
                      Audio
                    </AudioButton>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardHeader>

      <CardContent className="px-2 pb-2 md:px-4 md:pb-4 space-y-6">
        {data.relationship.length > 0 && (
          <Card className="shadow-none">
            <CardHeader className="p-2 md:p-4">
              <p>
                View:
                {data.relationship.map((item) => (
                  <Link
                    key={item.id}
                    href={`/word/${item.word}`}
                    className="underline ml-2"
                  >
                    {item.word}
                  </Link>
                ))}
              </p>
            </CardHeader>
          </Card>
        )}

        {data.meanings.length > 0 && (
          <Photos
            overlayRender={({ images, index }) => {
              return (
                <div
                  className={
                    'absolute left-0 bottom-0 w-full min-h-24 text-slate-300 z-50 bg-black/50 grid place-content-center'
                  }
                >
                  <p className="text-center">
                    {(images[index].originRef?.current as HTMLImageElement).alt}
                  </p>
                </div>
              )
            }}
          >
            <Card className="shadow-none">
              <CardHeader className="p-2 md:p-4">
                <CardTitle title="meanings" className="font-semibold">
                  Meaning:{' '}
                </CardTitle>
              </CardHeader>
              {data.meanings.map((item) => {
                return (
                  <CardContent
                    key={item.id}
                    className="space-y-3 px-2 pb-2 md:px-4 md:pb-4"
                  >
                    <h4 className="space-x-1.5">
                      <Badge>{item.partOfSpeech.name || '-'}</Badge>
                      <Badge variant={'outline'}>
                        {item.partOfSpeech.abbreviation}
                      </Badge>{' '}
                      = {item.partOfSpeech.translate}
                    </h4>

                    {item.description && (
                      <Alert>
                        <NotebookPen className="size-4" />
                        <AlertTitle>Note</AlertTitle>
                        <AlertDescription>
                          <div
                            className="prose prose-slate dark:prose-invert prose-sm"
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          ></div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <ol className="list-decimal pl-4 space-y-2">
                      {item.definitions.length > 0 &&
                        item.definitions.map((itm, idx) => {
                          return (
                            <li key={itm.id} className="space-y-2">
                              <p>
                                {itm.definition ? itm.definition + ' = ' : ''}
                                {itm.translate || '-'}
                              </p>
                              {itm.description && (
                                <Alert>
                                  <NotebookPen className="size-4" />
                                  <AlertTitle>Note</AlertTitle>
                                  <AlertDescription>
                                    <div
                                      className="prose prose-slate dark:prose-invert prose-sm"
                                      dangerouslySetInnerHTML={{
                                        __html: itm.description,
                                      }}
                                    ></div>
                                  </AlertDescription>
                                </Alert>
                              )}

                              {itm.image && (
                                <div className="w-56 max-h-60 overflow-hidden rounded-xl">
                                  <PhotoItem>
                                    <Image
                                      src={itm.image}
                                      alt={
                                        (itm.definition
                                          ? itm.definition + ' = '
                                          : '') + itm.translate || '-'
                                      }
                                      title={itm.definition}
                                      className="object-cover"
                                    />
                                  </PhotoItem>
                                </div>
                              )}

                              <ul className="list-disc list-inside pl-2 space-y-1.5">
                                {itm.examples.length > 0 &&
                                  itm.examples.map((it) => {
                                    return (
                                      <li key={it.id}>
                                        {it.sentence ? it.sentence + ' = ' : ''}
                                        {it.translate || '-'}
                                      </li>
                                    )
                                  })}
                              </ul>
                            </li>
                          )
                        })}
                    </ol>
                  </CardContent>
                )
              })}
            </Card>
          </Photos>
        )}

        {data.idioms.length > 0 && (
          <Card className="shadow-none">
            <CardHeader className="p-2 md:p-4">
              <CardTitle title="Idioms" className="font-semibold">
                Idioms:{' '}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-2 pb-2 md:px-4 md:pb-4">
              <ul className="list-decimal pl-4 space-y-1">
                {data.idioms.map((item) => {
                  return (
                    <li key={item.id} className="space-y-1">
                      <p>
                        {item.idiom}: {item.definition}
                      </p>
                      {item.description && (
                        <div
                          className="prose prose-slate dark:prose-invert prose-sm"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        ></div>
                      )}

                      <ul className="list-disc list-inside pl-2 space-y-1">
                        {item.examples.length > 0 &&
                          item.examples.map((itm) => {
                            return (
                              <li key={itm.id}>
                                {itm.sentence}: {itm.translate}
                              </li>
                            )
                          })}
                      </ul>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        )}

        {data.description && (
          <Alert>
            <NotebookPen className="size-4" />
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>
              <div
                className="prose prose-slate dark:prose-invert prose-sm"
                dangerouslySetInnerHTML={{ __html: data.description }}
              ></div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="p-2 md:p-4 justify-between">
        <div className="text-xs flex items-center gap-1 text-muted-foreground">
          Created By:
          {data.createdBy.role === 'admin' ? (
            <p>admin</p>
          ) : (
            <div className="flex items-center gap-1">
              <Avatar>
                <AvatarImage
                  src={currentAvatar?.image}
                  alt={data.createdBy.name}
                />
                <AvatarFallback>
                  {firstLetterBuilder(data.createdBy.name)}
                </AvatarFallback>
              </Avatar>
              <p className="max-w-32 truncate">{data.createdBy.name}</p>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {format(data.createdAt, 'dd/MM/yyyy')}
        </p>
      </CardFooter>
    </Card>
  )
}

export function CommentsView({ word }: { word: string }) {
  const searchWord = useQuery<ResFindOne<WordAttr>>({
    queryKey: [QUERY_KEYS.dictionary, word],
    enabled: false,
  })

  const searchData = useInfiniteQuery({
    queryKey: [QUERY_KEYS.comments, searchWord.data?.data.id],
    queryFn: (ctx) =>
      apiWithToken.get<ResFind<CommentAttr[]>>(API_INPUTS.comments, {
        params: { wordId: searchWord.data?.data.id, page: ctx.pageParam },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (
        !lastPage.data.list?.length ||
        lastPage.data.pagination.pageCount === lastPage.data.pagination.page
      )
        return undefined
      return allPages.length
    },
    enabled: !!searchWord.data?.data.id,
  })

  return (
    <Card className="shadow-none">
      <CardHeader className="p-2 md:p-4">
        <CardTitle>Discussion</CardTitle>
      </CardHeader>

      <CardContent className="px-2 pb-2 md:px-4 md:pb-4">
        <section className="antialiased space-y-6">
          <CommentForm
            wordId={searchWord.data?.data.id}
            onSubmitCreatedSuccess={() => searchData.refetch()}
          />

          {searchData.status === 'pending' ? (
            <Center>
              <Spinner />
            </Center>
          ) : searchData.status === 'error' ? (
            <Center>
              <Message.Error>{getErrorMessage(searchData.error)}</Message.Error>
            </Center>
          ) : (
            <div className="space-y-3">
              {searchData.data.pages
                .flatMap((page) => page.data.list)
                .map((item) => {
                  return (
                    <CommentItem
                      key={item.id}
                      item={item}
                      wordId={searchWord.data?.data.id}
                    />
                  )
                })}
            </div>
          )}

          {searchData.hasNextPage && (
            <Button
              onClick={() => searchData.fetchNextPage()}
              variant={'outline'}
              className="w-full"
            >
              Xem thêm
            </Button>
          )}
        </section>
      </CardContent>
    </Card>
  )
}

const createAttrSchema = z.object({
  content: z.string().min(1, 'greater than 1').max(2000, 'too many characters'),
  wordId: z.number().optional(),
  commentId: z.number().optional(),
})

type CreateAttrType = z.infer<typeof createAttrSchema>

function CommentForm({
  onSubmitCreatedSuccess,
  onSubmitUpdatedSuccess,
  wordId,
  commentId,
  autoFocus,
  isUpdated,
  content,
  onClose,
  id,
}: {
  onSubmitCreatedSuccess?: (data: CommentAttr) => void
  onSubmitUpdatedSuccess?: (data: CommentAttr) => void
  wordId?: number
  commentId?: number
  content?: string
  autoFocus?: boolean
  isUpdated?: boolean
  onClose?: () => void
  id?: number
}) {
  const createData = useMutation({
    mutationFn: (data: CreateAttrType) =>
      apiWithToken.post<ResFindOne<CommentAttr>>(API_INPUTS.comments, data),
  })

  const updateData = useMutation({
    mutationFn: (data: CreateAttrType) =>
      apiWithToken.patch<ResFindOne<CommentAttr>>(
        API_INPUTS.comments + '/' + id,
        data
      ),
  })

  const form = useForm<CreateAttrType, Validator<CreateAttrType>>({
    defaultValues: {
      content: content || '',
      wordId,
      commentId,
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: createAttrSchema,
    },
    onSubmitInvalid: ({ value, formApi }) => {
      const parse = createAttrSchema.safeParse(value)
      onSubmitInvalid(parse, formApi)
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const data = createAttrSchema.parse(value)

        if (isUpdated) {
          const res = await updateData.mutateAsync(data)
          onSubmitUpdatedSuccess?.(res.data)
        } else {
          const res = await createData.mutateAsync(data)
          onSubmitCreatedSuccess?.(res.data)
        }

        formApi.reset()
        // toast.success('Create successfully')
      } catch (error) {
        toast.error(getErrorMessage(error, 'Create successfully'))
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
        className=" space-y-6"
      >
        <form.Field name="content">
          {(field) => (
            <FormItem field={field}>
              <FormLabel className="sr-only">Your comment</FormLabel>
              <FormControl>
                <TextareaAutoSize
                  autoFocus={autoFocus}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Write a comment..."
                  className="pt-2 min-h-32"
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

        <div className="flex gap-3">
          <form.Subscribe
            selector={(state) => [state.isSubmitting, state.isDirty]}
          >
            {([isSubmitting, isDirty]) => (
              <Button variant={isDirty ? 'default' : 'secondary'} type="submit">
                {isSubmitting && <Spinner size={'xs'} className="mr-3" />}
                {isUpdated ? 'Update comment' : 'Post comment'}
              </Button>
            )}
          </form.Subscribe>
          {isUpdated && (
            <Button onClick={onClose} variant={'ghost'}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}

function CommentItem({
  item,
  wordId,
  className,
  commentId,
}: {
  item: CommentAttr
  wordId?: number
  className?: string
  commentId?: number
}) {
  const { data: session } = useSession()
  const [data, setData] = useState<CommentAttr | undefined>(item)
  const [isMore, setIsMore] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isReply, setIsReply] = useState(false)

  const deleteData = useMutation({
    mutationFn: () => apiWithToken.delete(API_INPUTS.comments + '/' + data?.id),
  })

  if (!data) {
    return null
  }
  const createAt = format(new Date(data.createdAt), 'eeee, MM, yyyy')

  return (
    <>
      <Card className={cn('shadow-none', className)}>
        <CardHeader className="flex-row justify-between py-2 px-3">
          <div className="flex items-center gap-2">
            <Avatar className="size-9">
              <AvatarFallback className="text-sm">
                {firstLetterBuilder(data.createdBy.name)}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold text-sm">{data.createdBy.name}</p>
            <p>-</p>
            <p className="text-sm text-muted-foreground">
              <time
                dateTime={format(new Date(data.createdAt), 'dd/MM/yyyy')}
                title={createAt}
              >
                {createAt}
              </time>
            </p>
          </div>

          {Number(session?.user.id) === data.createdBy.id && (
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={'ghost'} size={'icon'}>
                    <EllipsisVertical className="size-4" />
                    <span className="sr-only">Comment settings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEdit(true)}>
                    Edit
                  </DropdownMenuItem>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem>Remove</DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your comment and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteData.mutate(undefined, {
                        onError(error, variables, context) {
                          toast.error(getErrorMessage(error, 'Lỗi'))
                        },
                        onSuccess: () => {
                          setData(undefined)
                        },
                      })
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardHeader>

        <CardContent className="py-2 p-2 md:px-4">
          {isEdit ? (
            <CommentForm
              isUpdated
              autoFocus
              commentId={commentId}
              wordId={wordId}
              content={data.content}
              onClose={() => setIsEdit(false)}
              onSubmitUpdatedSuccess={(newData) => {
                setData((prev) => {
                  if (!prev) return
                  return {
                    ...prev,
                    content: newData.content,
                  }
                })
                setIsEdit(false)
              }}
              id={data.id}
            />
          ) : (
            <p className="text-muted-foreground whitespace-pre-line">
              {data.content}
            </p>
          )}
        </CardContent>

        {!commentId && (
          <CardFooter className="p-2 block">
            <Collapsible open={isReply} onOpenChange={setIsReply}>
              <CollapsibleTrigger asChild>
                <Button type="button" variant={'ghost'}>
                  <TextQuote className="size-4 mr-3" />
                  Reply
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full">
                <CommentForm
                  wordId={wordId}
                  autoFocus
                  commentId={data.id}
                  onClose={() => setIsReply(false)}
                  onSubmitCreatedSuccess={(newData) => {
                    newData.createdBy = session?.user as any

                    if (session?.user) {
                      setData((prev) => {
                        if (!prev) return
                        return {
                          ...prev,
                          children: [newData, ...prev?.children],
                        }
                      })
                    }
                    setIsReply(false)
                  }}
                />
              </CollapsibleContent>
            </Collapsible>
          </CardFooter>
        )}
      </Card>

      {!isMore ? (
        data.children?.length > 0 && (
          <div className="space-y-3 ml-9">
            {data.children.map((itm) => {
              return (
                <CommentItem
                  key={itm.id}
                  item={itm}
                  wordId={wordId}
                  commentId={data.id}
                />
              )
            })}
            <Button
              onClick={() => setIsMore(true)}
              variant={'outline'}
              className="w-full"
            >
              Xem thêm
            </Button>
          </div>
        )
      ) : (
        <SubComment wordId={wordId} commentId={data.id} />
      )}
    </>
  )
}

function SubComment({
  wordId,
  commentId,
}: {
  wordId?: number
  commentId?: number
}) {
  const searchData = useInfiniteQuery({
    queryKey: [QUERY_KEYS.comments, wordId, commentId],
    queryFn: (ctx) =>
      apiWithToken.get<ResFind<CommentAttr[]>>(API_INPUTS.comments, {
        params: { page: ctx.pageParam, wordId, commentId },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (
        !lastPage.data.list?.length ||
        lastPage.data.pagination.pageCount === lastPage.data.pagination.page
      )
        return undefined
      return allPages.length
    },
  })

  if (searchData.status === 'pending') {
    return (
      <Center>
        <Spinner />
      </Center>
    )
  } else if (searchData.status === 'error') {
    return (
      <Center>
        <Message.Error>{getErrorMessage(searchData.error)}</Message.Error>
      </Center>
    )
  }

  return (
    <div className="space-y-3 ml-12">
      {searchData.data.pages
        .flatMap((page) => page.data.list)
        .map((itm) => {
          return (
            <CommentItem
              key={itm.id}
              item={itm}
              wordId={wordId}
              commentId={commentId}
            />
          )
        })}

      {searchData.hasNextPage && (
        <Button
          onClick={() => searchData.fetchNextPage()}
          variant={'outline'}
          className="w-full"
        >
          Xem thêm
        </Button>
      )}
    </div>
  )
}
