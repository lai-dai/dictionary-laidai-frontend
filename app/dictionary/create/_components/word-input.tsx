'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ResFind } from '@/lib/types/common'
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

export function WordsInput(props: {
  value?: string
  onValueChange?: (value: string) => void
}) {
  const [value, setValue] = useUncontrolled({
    defaultValue: '',
    value: props.value,
    onValueChange: props.onValueChange,
  })
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value || 'Select words...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search words..."
            value={q}
            onValueChange={setQ}
          />
          <WordList
            q={q}
            value={value}
            onValueChange={(currentValue) => {
              setValue(currentValue === value ? '' : currentValue)
              setOpen(false)
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
    queryKey: ['/api/dictionary/words', props.q],
    queryFn: (ctx) =>
      api.get<ResFind<string[]>>('/api/dictionary/words', {
        params: {
          q: props.q,
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
    enabled: Boolean(props.q),
  })

  const flatData = useMemo(() => {
    return searchData.data?.pages.flatMap((page) => page.data?.list || []) || []
  }, [searchData.data])

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
      <CommandList>
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
          <>
            <CommandEmpty>No framework found.</CommandEmpty>
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
                          value={item}
                          onSelect={props.onValueChange}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              props.value === item ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {isLoaderRow
                            ? searchData.hasNextPage
                              ? 'Loading more...'
                              : 'Nothing more to load'
                            : item}
                        </CommandItem>
                      </VirtualizerItem>
                    )
                  }}
                </VirtualizerTrack>
              </CommandGroup>
            </VirtualizerContent>
          </>
        )}
      </CommandList>
    </Virtualizer>
  )
}
