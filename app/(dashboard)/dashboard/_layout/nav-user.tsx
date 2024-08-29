import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { auth } from '@/lib/auth'
import { LogoutButton } from '@/components/logout-button'
import { firstLetterBuilder } from '@/lib/utils/first-letter-builder'
import { Spinner } from '@/components/ui/spinner'
import { LogOut } from 'lucide-react'
import { AVATARS } from '@/lib/data/avatars'

export async function DashboardUserNav() {
  const session = await auth()
  const currentAvatar = AVATARS.find(
    (item) => item.name === session?.user.image
  )
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
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
