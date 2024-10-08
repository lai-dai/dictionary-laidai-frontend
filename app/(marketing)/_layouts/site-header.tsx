import React from 'react'
import { MainNav } from './nav-main'
import { MobileNav } from './nav-mobile'
import { LocaleToggle } from '@/components/locale-toggle'
import { UserNav } from './nav-user'
import { auth } from '@/lib/auth'
import { ModeToggle } from '@/components/mode-toggle'
import { LoginButton } from './login-button'

export async function SiteHeader() {
  const session = await auth()

  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 w-full border-b border-muted bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container max-w-5xl flex h-14 items-center gap-3">
        <div className="flex-1">
          <MainNav />
          <MobileNav />
        </div>

        <LocaleToggle />
        <ModeToggle />
        {session?.user ? <UserNav /> : <LoginButton />}
      </div>
    </header>
  )
}
