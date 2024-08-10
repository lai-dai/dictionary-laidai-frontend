'use client'

import React, { useState } from 'react'

import { Button, ButtonProps } from './ui/button'
import { signOut } from 'next-auth/react'
import { chain } from '@/lib/utils/chain'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { API_INPUTS } from '@/lib/constants/api-input'

export const LogoutButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function LogoutButton({ onClick, className, ...props }, ref) {
    const [open, setOpen] = useState(false)
    const logout = useMutation({
      mutationFn: () => api.get(API_INPUTS.logout),
    })
    return (
      <Button
        ref={ref}
        onClick={chain(onClick, async () => {
          setOpen(true)
          await logout.mutateAsync()
          await signOut({ callbackUrl: '/' })
          setOpen(false)
        })}
        className={cn('group', className)}
        data-pending={open}
        {...props}
      />
    )
  }
)
