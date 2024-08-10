'use client'

import React, { useMemo, useState } from 'react'
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
  TableRowsEmpty,
  TableRowsTrack,
  useDataTableContext,
} from '@/components/ui/data-table'

import {
  ColumnDef,
  ColumnOrderState,
  VisibilityState,
} from '@tanstack/react-table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check, Edit2, Plus, Settings2, Trash } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { apiWithToken } from '@/lib/api'
import { ResFind, ResFindOne } from '@/lib/types/common'
import { Spinner } from '@/components/ui/spinner'
import { Message } from '@/components/message'
import { getErrorMessage } from '@/lib/utils/error-message'
import { PartOfSpeechType } from '@/lib/types/part-of-speeches'
import { dateFormat } from '@/lib/utils/format'
import { QUERY_KEYS } from '@/lib/constants/query-key'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/responsive-dialog'
import { toast } from 'sonner'
import { API_INPUTS } from '@/lib/constants/api-input'

export function PageDataTable() {
  const pathname = usePathname()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])

  const searchData = useQuery({
    queryKey: [QUERY_KEYS.partOfSpeeches],
    queryFn: () =>
      apiWithToken.get<ResFind<PartOfSpeechType[]>>('/partOfSpeeches'),
  })

  const columns = useMemo<ColumnDef<PartOfSpeechType>[]>(() => {
    return [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: (info) => (
          <p className="line-clamp-2">{info.getValue<string>()}</p>
        ),
      },
      {
        accessorKey: 'order',
        header: 'Order',
        size: 50,
      },
      {
        accessorKey: 'createdBy.name',
        header: 'createdBy',
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: (info) => dateFormat(info.getValue<string>()),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Created At',
        cell: (info) => dateFormat(info.getValue<string>()),
      },
      {
        id: 'actions',
        header: () => <p className="text-center">T.T</p>,
        size: 50,
        enableHiding: false,
        cell: (info) => {
          return (
            <div className="flex gap-3 justify-center">
              <Button
                asChild
                variant={'secondary'}
                size={'icon'}
                className="size-6"
              >
                <Link href={`${pathname}/${info.row.original.id}`}>
                  <Edit2 className="size-3" />
                </Link>
              </Button>

              <DeleteDataDialog
                data={info.row.original}
                onSubmitSuccess={() => {
                  searchData.refetch()
                }}
              />
            </div>
          )
        },
      },
    ]
  }, [])
  return (
    <DataTable
      data={searchData.data?.data.list || []}
      columns={columns}
      options={{
        initialState: {
          columnPinning: {
            right: ['actions'],
          },
        },
        state: {
          columnVisibility,
          columnOrder,
        },
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
      }}
    >
      <div className="space-y-6">
        <div className="flex justify-end gap-3">
          <Button variant="outline" size={'sm'} asChild>
            <Link
              href={`${pathname}/create?total=${searchData.data?.data.pagination.total}`}
            >
              <Plus className="size-4 mr-3" />
              New PoS
            </Link>
          </Button>

          <ColumnVisible />
        </div>

        <ScrollArea className="size-full border rounded-md">
          <Table>
            <TableHeader>
              {(headerGroup) => (
                <TableHeaderRow headerGroup={headerGroup}>
                  {(header) => <TableHead header={header} />}
                </TableHeaderRow>
              )}
            </TableHeader>

            <TableBody>
              <TableRowsEmpty>
                {searchData.status === 'pending' ? (
                  <div className="flex justify-center">
                    <Spinner className="mx-auto" />
                  </div>
                ) : searchData.status === 'error' ? (
                  <Message.Error className="text-center">
                    {getErrorMessage(searchData.error)}
                  </Message.Error>
                ) : (
                  <Message className="text-center">Not result</Message>
                )}
              </TableRowsEmpty>

              <TableRowsTrack>
                {(row) => (
                  <TableRow row={row}>
                    {(cell) => <TableCell cell={cell} />}
                  </TableRow>
                )}
              </TableRowsTrack>
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" className="h-3.5 z-[1]" />
        </ScrollArea>
      </div>
    </DataTable>
  )
}

function ColumnVisible() {
  const [open, setOpen] = useState(false)
  const table = useDataTableContext()
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size={'sm'}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <Settings2 className="size-4 mr-2 shrink-0" />
          View
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-0">
        <Command shouldFilter={false}>
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  table.toggleAllColumnsVisible()
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    table.getIsAllColumnsVisible() ? 'opacity-100' : 'opacity-0'
                  )}
                />
                Toggle All
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              {table.getAllLeafColumns().map((column) => {
                return (
                  <CommandItem
                    key={column.id}
                    value={column.id}
                    onSelect={() => {
                      column.toggleVisibility()
                    }}
                    disabled={!column.getCanHide()}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        column.getIsVisible() ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {column.columnDef.meta?.columnName || column.id}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function DeleteDataDialog({
  data,
  onSubmitSuccess,
}: {
  data: PartOfSpeechType
  onSubmitSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const deleteData = useMutation({
    mutationFn: (id: any) =>
      apiWithToken.delete<ResFindOne<PartOfSpeechType>>(
        API_INPUTS.partOfSpeeches + '/' + id
      ),
  })

  const onDelete = async () => {
    try {
      const res = await deleteData.mutateAsync(data.id)

      setOpen(false)
      toast.success(res.message)
      onSubmitSuccess?.()
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'destructive'} size={'icon'} className="size-6">
          <Trash className="size-3" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{' '}
            <span className="font-medium">
              {Array.isArray(data) ? data.length : 1}
            </span>{' '}
            data from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={() => onDelete()}
            disabled={deleteData.isPending}
          >
            {deleteData.isPending && <Spinner className="mr-3" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
