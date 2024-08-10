'use client'

import React, { useState } from 'react'
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableCellFull,
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
import { Check, Plus, Settings2 } from 'lucide-react'
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
import { DashboardPageContainer } from '@/components/page-container'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 60,
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
  },
  {
    accessorKey: 'firstName',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    size: 50,
  },
  {
    accessorKey: 'visits',
    header: () => <span>Visits</span>,
    size: 50,
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    size: 80,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: (info) => info.getValue<Date>().toLocaleString(),
  },
]

export default function Page() {
  return (
    <DashboardPageContainer asChild>
      <main className="container">
        <PageDataTable />
      </main>
    </DashboardPageContainer>
  )
}

export function PageDataTable() {
  const pathname = usePathname()
  const [data] = useState([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])

  return (
    <DataTable
      data={data}
      columns={columns}
      options={{
        initialState: {
          columnPinning: {
            right: ['createdAt'],
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
            <Link href={`${pathname}/create`}>
              <Plus className="size-4 mr-3" />
              New Words
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
              <TableRowsEmpty className="text-center">
                Not result
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
          <ScrollBar orientation="horizontal" className="h-4" />
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
