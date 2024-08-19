'use client'

import React, { ReactNode, useMemo, useState } from 'react'
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
} from '@/components/ui/data-table'

import {
  ColumnDef,
  ColumnOrderState,
  RowSelectionState,
  VisibilityState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Edit2, Plus, RotateCcw, Trash } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { apiWithToken } from '@/lib/api'
import { ResFind, ResFindOne } from '@/lib/types/common'
import { Spinner } from '@/components/ui/spinner'
import { Message } from '@/components/message'
import { getErrorMessage } from '@/lib/utils/error-message'
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
import { Checkbox } from '@/components/ui/checkbox'
import qs from 'qs'
import { TableColumnVisible } from '@/components/table-column-visible'
import { TablePagination } from '@/components/table-pagination'
import { URL_STATE_RESET, useUrlState } from '@/lib/hooks/use-url-state'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/lib/constants/common'
import { isObjectEquals } from '@/lib/utils/is-object-equals'
import { SearchInput } from '@/components/ui/search-input'
import { AttrType, GetAllAttrType } from '../_lib/type'
import { WordForm } from './form'

export function WordsDataTable({
  navigateMode = 'push',
  createUpdateInModal,
  initFilters = {
    key: '',
    page: DEFAULT_PAGE,
    limit: DEFAULT_PAGE_SIZE,
  },
}: {
  navigateMode?: 'push' | 'replace' | 'none'
  createUpdateInModal?: boolean
  initFilters?: GetAllAttrType
}) {
  const pathname = usePathname()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    updatedAt: false,
    description: false,
  })
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [filters, setFilters] = useUrlState(initFilters, {
    navigateMode,
  })
  const searchData = useQuery({
    queryKey: [QUERY_KEYS.words, filters],
    queryFn: () =>
      apiWithToken.get<ResFind<AttrType[]>>(API_INPUTS.words, {
        params: filters,
      }),
  })

  const columns = useMemo<ColumnDef<AttrType>[]>(() => {
    return [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-0.5"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-0.5"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 30,
      },
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60,
      },
      {
        accessorKey: 'word',
        header: 'Word',
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: (info) => (
          <div
            className="line-clamp-2 prose prose-slate dark:prose-invert prose-sm"
            dangerouslySetInnerHTML={{ __html: info.getValue<string>() }}
          ></div>
        ),
      },
      {
        accessorKey: 'createdBy.name',
        header: 'Created By',
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
        header: () => <p className="text-center">Actions</p>,
        size: 50,
        enableHiding: false,
        cell: (info) => {
          return (
            <div className="flex gap-3 justify-center">
              {createUpdateInModal ? (
                <CreateUpdateDataDialog
                  defaultValues={info.row.original}
                  onSubmitSuccess={() => {
                    searchData.refetch()
                  }}
                >
                  <Button
                    variant={'secondary'}
                    size={'icon'}
                    className="size-6"
                  >
                    <Edit2 className="size-3" />
                  </Button>
                </CreateUpdateDataDialog>
              ) : (
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
              )}

              <DeleteDataDialog
                data={info.row.original}
                onSubmitSuccess={() => {
                  searchData.refetch()
                }}
              >
                <Button
                  variant={'destructive'}
                  size={'icon'}
                  className="size-6"
                >
                  <Trash className="size-3" />
                </Button>
              </DeleteDataDialog>
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
          rowSelection,
        },
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
        onRowSelectionChange: setRowSelection,
      }}
    >
      {(table) => (
        <div className="space-y-6">
          <div className="flex w-full items-center justify-between gap-2 overflow-auto">
            <div className="flex flex-1 items-center gap-2">
              <SearchInput
                placeholder={'Search'}
                defaultValue={filters.key}
                onSearchChange={(key) => {
                  setFilters({ key })
                }}
                className="h-8 w-40 lg:w-64"
              />

              {!isObjectEquals(filters, initFilters) && (
                <Button
                  onClick={() => setFilters(URL_STATE_RESET)}
                  variant={'outline'}
                  size={'sm'}
                >
                  <RotateCcw className="mr-2 size-4" /> Reset
                </Button>
              )}
            </div>

            <div className="flex justify-end gap-2">
              {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <DeleteDataDialog
                  data={table
                    .getFilteredSelectedRowModel()
                    .rows.map((row) => row.original)}
                  onSubmitSuccess={() => {
                    searchData.refetch()
                    table.toggleAllRowsSelected(false)
                  }}
                >
                  <Button variant={'destructive'} size={'sm'}>
                    <Trash className="size-3 mr-2" aria-hidden="true" />
                    Delete ({table.getFilteredSelectedRowModel().rows.length})
                  </Button>
                </DeleteDataDialog>
              ) : null}

              {createUpdateInModal ? (
                <CreateUpdateDataDialog
                  isCreated
                  onSubmitSuccess={() => {
                    searchData.refetch()
                  }}
                >
                  <Button variant="outline" size={'sm'}>
                    <Plus className="size-4 mr-2" />
                    New Word
                  </Button>
                </CreateUpdateDataDialog>
              ) : (
                <Button variant="outline" size={'sm'} asChild>
                  <Link
                    href={`${pathname}/create?total=${searchData.data?.data.pagination.total}`}
                  >
                    <Plus className="size-4 mr-2" />
                    New Word
                  </Link>
                </Button>
              )}

              <TableColumnVisible />
            </div>
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

          <TablePagination
            onPageChange={(page) => {
              setFilters({ page })
            }}
            onPageSizeChange={(limit) => {
              setFilters({ limit })
            }}
            page={filters.page}
            pageSize={filters.limit}
            total={searchData.data?.data.pagination.total}
          />
        </div>
      )}
    </DataTable>
  )
}

function DeleteDataDialog({
  data,
  onSubmitSuccess,
  children,
}: {
  data: AttrType | AttrType[]
  onSubmitSuccess?: () => void
  children?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const deleteData = useMutation({
    mutationFn: (id: any) =>
      apiWithToken.delete<ResFindOne<AttrType>>(API_INPUTS.words + '/' + id),
  })

  const onDelete = async () => {
    try {
      let id
      if (Array.isArray(data)) {
        const ids = data.map((e) => e.id)
        id = qs.stringify({ ids })
      } else {
        id = data.id
      }
      const res = await deleteData.mutateAsync(id)

      setOpen(false)
      toast.success(res.message)
      onSubmitSuccess?.()
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

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

function CreateUpdateDataDialog({
  children,
  defaultValues,
  isCreated,
  onSubmitSuccess,
}: {
  children?: ReactNode
  defaultValues?: AttrType
  isCreated?: boolean
  onSubmitSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-screen max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create part of speeches</DialogTitle>
          <DialogDescription>
            Part of Speeches a category to which a word is assigned in
            accordance with its syntactic functions.
          </DialogDescription>
        </DialogHeader>
        <WordForm
          inModal
          isCreated={isCreated}
          id={String(defaultValues?.id)}
          defaultValues={defaultValues}
          onClose={() => setOpen(false)}
          onSubmitSuccess={() => {
            onSubmitSuccess?.()
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
