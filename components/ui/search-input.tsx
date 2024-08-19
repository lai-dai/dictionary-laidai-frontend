'use client'

import { cn } from '@/lib/utils'
import { Input, InputProps } from './input-2'
import { chain } from '@/lib/utils/chain'
import { Button } from './button'
import { X } from 'lucide-react'
import { useUncontrolled } from '@/lib/hooks/use-uncontrolled'

export function SearchInput({
  classNames,
  onSearchChange,
  onValueChange,
  onKeyDown,
  className,
  value,
  defaultValue,
  ...props
}: Omit<InputProps, 'value' | 'defaultValue'> & {
  value?: string
  defaultValue?: string
  onSearchChange?: (value: string) => void
  onValueChange?: (value: string) => void
  classNames?: {
    root?: string
    input?: string
  }
}) {
  const [_value, setValue] = useUncontrolled({
    defaultValue,
    value,
    onValueChange,
  })
  return (
    <div className={cn('relative', classNames?.root)}>
      <Input
        value={_value}
        onChange={(e) => {
          setValue(e.target.value)
        }}
        onKeyDown={chain(onKeyDown, (e) => {
          if (e.code === 'Enter') {
            e.preventDefault()
            onSearchChange?.(_value || '')
          }
        })}
        className={cn('pr-9', classNames?.input, className)}
        {...props}
      />
      {_value && (
        <Button
          onClick={() => {
            onSearchChange?.('')
            setValue('')
          }}
          size={'icon'}
          className="size-4 absolute top-1/2 -translate-y-1/2 right-3"
        >
          <X className="size-3" />
        </Button>
      )}
    </div>
  )
}
