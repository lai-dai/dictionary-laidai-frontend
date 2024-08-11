'use client'

import React, { useState } from 'react'
import { useDataTableContext } from '@/components/ui/data-table'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check, Settings2 } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

export function TableColumnVisible() {
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
            <CommandEmpty>No results found</CommandEmpty>
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
