'use client'

import { MarketingPageContainer } from '@/components/page-container'
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
import { DictionaryAttr } from './_lib/type'
import { useDebounce } from 'use-debounce'
import { Message } from '@/components/message'
import { Spinner } from '@/components/ui/spinner'
import { getErrorMessage } from '@/lib/utils/error-message'
import { format } from 'date-fns'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { firstLetterBuilder } from '@/lib/utils/first-letter-builder'
import { useRouter } from 'next/navigation'
import { Center } from '@/components/ui/center'

export default function Page() {
  const router = useRouter()
  const [filters, setFilters] = useUrlState({
    key: '',
  })
  const [key] = useDebounce(filters.key, 600)

  const searchData = useInfiniteQuery({
    queryKey: ['/api/dictionary', key],
    queryFn: (ctx) =>
      api.get<ResFind<DictionaryAttr[]>>('/dictionary', {
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
    <MarketingPageContainer asChild>
      <main>
        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 md:px-6">
            <CardTitle>Tra từ</CardTitle>
          </CardHeader>
          <CardContent className="px-0 md:px-6">
            <Command shouldFilter={false} className="rounded-lg border">
              <CommandInput
                value={filters.key}
                onValueChange={(key) => setFilters({ key })}
                placeholder="Nhập yêu cầu của bạn"
                className="h-16"
              />
              <CommandList className="max-h-none overflow-hidden">
                {!key ? (
                  <Center>
                    <Message className="text-center py-6 px-3">
                      Let&apos;s search word
                    </Message>
                  </Center>
                ) : searchData.status === 'pending' ? (
                  <Center>
                    <Spinner size={'xs'} />
                  </Center>
                ) : searchData.status === 'error' ? (
                  <Center>
                    <Message.Error className="text-center py-6 px-3">
                      {getErrorMessage(searchData.error)}
                    </Message.Error>
                  </Center>
                ) : (
                  <CommandGroup>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {searchData.data?.pages
                      .flatMap((page) => page.data?.list || [])
                      .map((item) => (
                        <CommandItem
                          onSelect={(value) => {
                            router.push('/word/' + value)
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
                              {/* <div>
                                <Button size={'icon'} variant={'ghost'}>
                                  <AudioLines className="size-4" />
                                </Button>
                              </div> */}
                            </CardHeader>

                            <CardContent className="p-2">
                              {item.meanings.length > 0 &&
                                item.meanings[0].definitions.length > 0 && (
                                  <div
                                    className="line-clamp-3 prose prose-slate dark:prose-invert prose-sm"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        item.meanings[0].definitions[0]
                                          .definition,
                                    }}
                                  ></div>
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
                                      {/* <AvatarImage
                                        src="https://github.com/shadcn.png"
                                        alt="@shadcn"
                                      /> */}
                                      <AvatarFallback>
                                        {firstLetterBuilder(
                                          item.createdBy.name
                                        )}
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
                      ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </CardContent>
        </Card>
      </main>
    </MarketingPageContainer>
  )
}
