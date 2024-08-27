'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/responsive-dialog'
import { SearchDictionary } from './view'
import { Search } from 'lucide-react'

export function SearchDictionaryPopover() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'secondary'}>
          <Search className="mr-3 size-4" /> Search
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-96 p-3 md:p-5">
        <DialogHeader>
          <DialogTitle>Search dictionary</DialogTitle>
          <DialogDescription>Quick search</DialogDescription>
        </DialogHeader>

        <SearchDictionary
          inDialog
          onClickItem={() => {
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
