'use client'

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogoutButton } from '@/components/logout-button'
import Link from 'next/link'
import { firstLetterBuilder } from '@/lib/utils/first-letter-builder'
import { Spinner } from '@/components/ui/spinner'
import { isAdmin } from '@/lib/utils/is-admin'
import { BookA, LayoutGrid, LogOut, User } from 'lucide-react'
import { AVATARS } from '@/lib/data/avatars'
import { useSession } from 'next-auth/react'

export function UserNav() {
  const { data: session } = useSession()
  const currentAvatar = AVATARS.find(
    (item) => item.name === session?.user.image
  )
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={'icon'}
          className="rounded-full shrink-0"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={currentAvatar?.image}
              alt={session?.user?.name || ''}
            />
            <AvatarFallback>
              {firstLetterBuilder(session?.user?.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isAdmin(session?.user) && (
            <DropdownMenuItem asChild>
              <Link href={'/dashboard'} className="cursor-pointer">
                <LayoutGrid className="size-4 mr-3" />
                Dashboard
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link href={'/account/my-favorites'} className="cursor-pointer">
              <BookA className="size-4 mr-3" />
              My favorites
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={'/account/profile'} className="cursor-pointer">
              <User className="size-4 mr-3" />
              Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutButton
            variant={'ghost'}
            className="w-full justify-start cursor-pointer"
          >
            <Spinner
              size={'xs'}
              className="mr-3 group-data-[pending=false]:hidden"
            />
            <LogOut className="size-4 mr-3 group-data-[pending=true]:hidden" />
            Log out
          </LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
