'use client'

import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { apiWithToken, nextApi } from '@/lib/api'
import { ResFind, ResFindOne } from '@/lib/types/common'
import { Spinner } from '@/components/ui/spinner'
import { getErrorMessage } from '@/lib/utils/error-message'
import { Message } from '@/components/message'
import {
  Virtualizer,
  VirtualizerContent,
  VirtualizerItem,
  VirtualizerTrack,
} from '@/components/ui/virtualizer'
import { useUncontrolled } from '@/lib/hooks/use-uncontrolled'
import { FormControl } from '@/components/ui/form-2'
import { chain } from '@/lib/utils/chain'
import { API_INPUTS } from '@/lib/constants/api-input'
import { useDebounce } from 'use-debounce'
import { Badge } from '@/components/ui/badge'
import { QUERY_KEYS } from '@/lib/constants/query-key'

type WordAttr = {
  id: number
  word: string
}

export function WordsInput({
  onValueChange,
  onBlur,
  className,
  value,
  ...props
}: Omit<ButtonProps, 'value'> & {
  onValueChange?: (value: string) => void
  onBlur?: () => void
  value?: string
}) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [key] = useDebounce(q, 600)
  const [_value, setValue] = useUncontrolled({
    defaultValue: '',
    value,
    onValueChange,
  })

  const queryClient = useQueryClient()
  const currList = queryClient.getQueryData<InfiniteData<ResFind<WordAttr[]>>>([
    QUERY_KEYS.onlyWord,
    key,
  ])

  const searchData = useQuery({
    queryKey: [QUERY_KEYS.partOfSpeeches],
    queryFn: () =>
      apiWithToken.get<ResFindOne<WordAttr>>(
        API_INPUTS.onlyWord + '/' + _value
      ),
    enabled: Boolean(Number(_value)),
  })

  return (
    <Popover
      open={open}
      onOpenChange={chain(setOpen, (open) => {
        if (!open) {
          onBlur?.()
        }
      })}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('justify-between', className)}
          {...props}
        >
          {!Number(_value)
            ? 'Select words'
            : currList
              ? currList?.pages
                  .flatMap((d) => d.data.list)
                  .find((e) => e.id === Number(_value))?.word
              : searchData.data?.data.word}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search words"
            value={q}
            onValueChange={setQ}
            autoCapitalize="off"
            inputMode="search"
          />
          <WordList
            q={key}
            value={_value}
            onValueChange={(value) => {
              setValue(value)
              setOpen(false)
              onBlur?.()
            }}
          />
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function WordList(props: {
  q: string
  value?: string
  onValueChange?: (value: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  const searchData = useInfiniteQuery({
    queryKey: [API_INPUTS.onlyWord, props.q],
    queryFn: (ctx) =>
      apiWithToken.get<ResFind<{ id: number; word: string }[]>>(
        API_INPUTS.onlyWord,
        {
          params: {
            key: props.q,
            page: ctx.pageParam,
          },
        }
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam: number) => {
      if (
        !lastPage.data?.list?.length ||
        lastPage.data?.pagination.pageCount === lastPage.data?.pagination.page
      )
        return undefined
      return Number(lastPage.data?.pagination.page) + 1
    },
    enabled: Boolean(props.q),
  })

  const flatData =
    searchData.data?.pages.flatMap((page) => page.data?.list || []) || []

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !searchData.isFetching &&
          searchData.hasNextPage
        ) {
          searchData.fetchNextPage()
        }
      }
    },
    [searchData]
  )

  useEffect(() => {
    fetchMoreOnBottomReached(containerRef.current)
  }, [fetchMoreOnBottomReached])

  return (
    <Virtualizer
      ref={containerRef}
      asChild
      onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
      options={{
        count: searchData.hasNextPage ? flatData.length + 1 : flatData.length,
        estimateSize: () => 32,
        overscan: 5,
        measureElement:
          typeof window !== 'undefined' &&
          navigator.userAgent.indexOf('Firefox') === -1
            ? (element) => element?.getBoundingClientRect().height
            : undefined,
      }}
    >
      <CommandList className="h-svh p-1">
        {!props.q ? (
          <Message className="text-center py-6 px-3">
            Let&apos;s search word
          </Message>
        ) : searchData.status === 'pending' ? (
          <Spinner size={'xs'} />
        ) : searchData.status === 'error' ? (
          <Message.Error className="text-center py-6 px-3">
            {getErrorMessage(searchData.error)}
          </Message.Error>
        ) : (
          <Fragment>
            <CommandEmpty>No results found</CommandEmpty>
            <VirtualizerContent asChild>
              <CommandGroup>
                <VirtualizerTrack>
                  {(virtualRow, style) => {
                    const isLoaderRow = virtualRow.index > flatData.length - 1
                    const item = flatData[virtualRow.index]
                    return (
                      <VirtualizerItem asChild>
                        <CommandItem
                          style={style}
                          disabled={isLoaderRow}
                          value={String(item.id)}
                          onSelect={props.onValueChange}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              props.value === String(item.id)
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {isLoaderRow
                            ? searchData.hasNextPage
                              ? 'Loading more...'
                              : 'Nothing more to load'
                            : item.word}
                        </CommandItem>
                      </VirtualizerItem>
                    )
                  }}
                </VirtualizerTrack>
              </CommandGroup>
            </VirtualizerContent>
          </Fragment>
        )}
      </CommandList>
    </Virtualizer>
  )
}
