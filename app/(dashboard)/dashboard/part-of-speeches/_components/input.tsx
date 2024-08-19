'use client'

import * as React from 'react'
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
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants/query-key'
import { ResFind } from '@/lib/types/common'
import { PartOfSpeechAttr } from '../_lib/type'
import { apiWithToken } from '@/lib/api'
import {
  Virtualizer,
  VirtualizerContent,
  VirtualizerItem,
  VirtualizerTrack,
} from '@/components/ui/virtualizer'
import { useUncontrolled } from '@/lib/hooks/use-uncontrolled'
import { FormControl } from '@/components/ui/form-2'
import { API_INPUTS } from '@/lib/constants/api-input'

export function PartOfSpeechInput({
  onValueChange,
  value,
  name,
  onBlur,
}: {
  value?: string
  onValueChange?: (value: string) => void
  name?: string
  onBlur?: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [_value, setValue] = useUncontrolled({
    defaultValue: '',
    value,
    onValueChange,
  })
  const [key, setKey] = React.useState('')

  const queryClient = useQueryClient()
  const currList = queryClient.getQueryData<
    InfiniteData<ResFind<PartOfSpeechAttr[]>>
  >([QUERY_KEYS.partOfSpeeches, key])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            name={name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full capitalize"
          >
            {!Number(_value)
              ? 'Select Part of Speeches'
              : currList?.pages
                  .flatMap((d) => d.data.list)
                  .find((e) => e.id === Number(_value))?.name}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <PartOfSpeechList
          keyValue={key}
          onKeyValueChange={setKey}
          value={_value}
          onValueChange={(value) => {
            setValue(value)
            setOpen(false)
            onBlur?.()
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

function PartOfSpeechList({
  keyValue: key,
  onValueChange,
  value,
  onKeyValueChange,
}: {
  keyValue: string
  value?: string
  onValueChange?: (value: string) => void
  onKeyValueChange?: (value: string) => void
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const searchData = useInfiniteQuery({
    queryKey: [QUERY_KEYS.partOfSpeeches, key],
    queryFn: (ctx) =>
      apiWithToken.get<ResFind<PartOfSpeechAttr[]>>(API_INPUTS.partOfSpeeches, {
        params: { key, page: ctx.pageParam },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (
        !lastPage.data.list?.length ||
        lastPage.data.pagination.page === lastPage.data.pagination.pageCount
      )
        return undefined

      return allPages.length
    },
  })

  const flatData = React.useMemo(
    () =>
      searchData.data ? searchData.data.pages.flatMap((d) => d.data.list) : [],
    [searchData.data]
  )

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !searchData.isFetching &&
          flatData.length < Infinity
        ) {
          searchData.fetchNextPage()
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchData.isFetching, flatData.length]
  )

  React.useEffect(() => {
    fetchMoreOnBottomReached(containerRef.current)
  }, [fetchMoreOnBottomReached])

  return (
    <Command shouldFilter={false}>
      <CommandInput
        value={key}
        onValueChange={onKeyValueChange}
        placeholder="Search Part of Speeches..."
      />

      <Virtualizer
        ref={containerRef}
        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        options={{
          count: searchData.hasNextPage ? flatData.length + 1 : flatData.length,
          estimateSize: () => 35,
          overscan: 5,
          measureElement:
            typeof window !== 'undefined' &&
            navigator.userAgent.indexOf('Firefox') === -1
              ? (element) => element?.getBoundingClientRect().height
              : undefined,
        }}
        asChild
      >
        <CommandList className="h-80 p-1">
          {searchData.status !== 'pending' && (
            <CommandEmpty>No framework found.</CommandEmpty>
          )}
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
                        value={String(item.id)}
                        onSelect={onValueChange}
                        disabled={isLoaderRow}
                        className="capitalize"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === String(item.id)
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {isLoaderRow
                          ? searchData.hasNextPage
                            ? 'Loading more...'
                            : 'Nothing more to load'
                          : item.name}
                      </CommandItem>
                    </VirtualizerItem>
                  )
                }}
              </VirtualizerTrack>
            </CommandGroup>
          </VirtualizerContent>

          <div>
            {searchData.isFetching && !searchData.isFetchingNextPage
              ? 'Background Updating...'
              : null}
          </div>
        </CommandList>
      </Virtualizer>
    </Command>
  )
}
