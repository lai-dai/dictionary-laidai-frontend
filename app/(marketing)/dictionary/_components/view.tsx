'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { api } from '@/lib/api'
import { useUrlState } from '@/lib/hooks/use-url-state'
import { ResFind } from '@/lib/types/common'
import { useInfiniteQuery } from '@tanstack/react-query'
import React from 'react'
import { DictionaryAttr } from '../_lib/type'
import { useDebounce } from 'use-debounce'
import { Message } from '@/components/message'
import { Spinner } from '@/components/ui/spinner'
import { getErrorMessage } from '@/lib/utils/error-message'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { firstLetterBuilder } from '@/lib/utils/first-letter-builder'
import { useRouter } from 'next/navigation'
import { Center } from '@/components/ui/center'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { API_INPUTS } from '@/lib/constants/api-input'
import { AVATARS } from '@/lib/data/avatars'
import { useSession } from 'next-auth/react'
import { AddButton } from '../../word/[word]/_components/button'

export function SearchDictionary({
  onClickItem,
  inDialog,
}: {
  onClickItem?: () => void
  inDialog?: boolean
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const [filters, setFilters] = useUrlState({
    key: '',
  })
  const [key] = useDebounce(filters.key, 600)

  const searchData = useInfiniteQuery({
    queryKey: [API_INPUTS.dictionary, key],
    queryFn: (ctx) =>
      api.get<ResFind<DictionaryAttr[]>>(API_INPUTS.dictionary, {
        params: {
          key: key,
          page: ctx.pageParam,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam: number) => {
      if (
        !lastPage.data?.list?.length ||
        lastPage.data?.pagination.pageCount === lastPage.data?.pagination.page
      )
        return undefined
      return Number(lastPage.data?.pagination.page) + 1
    },
    enabled: Boolean(key),
  })

  return (
    <Command shouldFilter={false} className="rounded-lg border">
      <div className="relative">
        <CommandInput
          value={filters.key}
          onValueChange={(key) => setFilters({ key })}
          placeholder="Nhập yêu cầu của bạn"
          className="h-16 pr-12"
          onFocus={(e) => {
            e.target.select()
          }}
          autoFocus
        />
        {!!filters.key && (
          <Button
            onClick={() => setFilters({ key: undefined })}
            size={'icon'}
            variant={'ghost'}
            className="rounded-full size-8 absolute top-1/2 -translate-y-1/2 right-3"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
      <CommandList className="max-h-none overflow-hidden">
        {!filters.key ? (
          <Center className="py-6 px-3">
            <Message className="text-center">Let&apos;s search word</Message>
          </Center>
        ) : searchData.status === 'pending' ? (
          <Center className="py-6 px-3">
            <Spinner size={'xs'} />
          </Center>
        ) : searchData.status === 'error' ? (
          <Center className="py-6 px-3 text-center space-y-3">
            <Message.Error className="py-6 px-3">
              {getErrorMessage(searchData.error)}
            </Message.Error>
          </Center>
        ) : (
          <CommandGroup>
            <CommandEmpty>
              <p>No results found.</p>
              {session?.user.role === 'admin' && <AddButton word={key} />}
            </CommandEmpty>
            {searchData.data?.pages
              .flatMap((page) => page.data?.list || [])
              .map((item) => {
                const currentAvatar = AVATARS.find(
                  (itm) => itm.name === item.createdBy.image
                )
                return (
                  <CommandItem
                    key={item.id}
                    onSelect={(value) => {
                      if (inDialog) {
                        router.replace('/word/' + value)
                      } else {
                        router.push('/word/' + value)
                      }
                      onClickItem?.()
                    }}
                    value={String(item.word)}
                    role="link"
                    className="rounded-2xl p-1.5 cursor-pointer"
                  >
                    <Card className="w-full shadow-none">
                      <CardHeader className="p-2 flex-row justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {item.word}
                          </CardTitle>
                          <CardDescription>
                            {item.meanings.length > 0 &&
                              item.meanings[0].partOfSpeech.name}
                          </CardDescription>
                        </div>
                      </CardHeader>

                      <CardContent className="p-2">
                        {item.relationship.length > 0 && (
                          <div className="space-x-3 text-sm">
                            <span>View:</span>
                            {item.relationship.map((itm) => (
                              <Button
                                key={itm.id}
                                size={'sm'}
                                variant={'secondary'}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (inDialog) {
                                    router.replace('/word/' + itm.word)
                                  } else {
                                    router.push('/word/' + itm.word)
                                  }
                                }}
                              >
                                {itm.word}
                              </Button>
                            ))}
                          </div>
                        )}
                        {item.meanings.length > 0 &&
                          item.meanings[0].definitions.length > 0 && (
                            <p className="line-clamp-3 prose prose-slate dark:prose-invert prose-sm">
                              {item.meanings[0].definitions[0].definition
                                ? item.meanings[0].definitions[0].definition +
                                  ' = '
                                : ''}
                              {item.meanings[0].definitions[0].translate}
                            </p>
                          )}
                      </CardContent>

                      <CardFooter className="p-2 justify-between">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          Created By:{' '}
                          {item.createdBy.role === 'admin' ? (
                            <p>admin</p>
                          ) : (
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={currentAvatar?.image}
                                  alt={item.createdBy.name}
                                />
                                <AvatarFallback>
                                  {firstLetterBuilder(item.createdBy.name)}
                                </AvatarFallback>
                              </Avatar>
                              <p>{item.createdBy.name}</p>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(item.createdAt, 'dd/MM/yyyy')}
                        </p>
                      </CardFooter>
                    </Card>
                  </CommandItem>
                )
              })}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  )
}
