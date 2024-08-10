import React from 'react'
import { DashboardUserNav } from './nav-user'
import { auth } from '@/lib/auth'
import { ModeToggle } from '@/components/mode-toggle'
import { MobileMenu } from './nav-mobile'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Logo } from '@/components/logo'

export async function SiteHeader() {
  const session = await auth()

  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 w-full border-b border-muted bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-14 items-center gap-3 px-3 md:px-6">
        <div className="grow space-x-3">
          <MobileMenu />
          <Button variant="link" size={'icon'} asChild className="md:hidden">
            <Link href="/">
              <Logo className="size-5" />
            </Link>
          </Button>
        </div>

        <ModeToggle />
        {session?.user && <DashboardUserNav />}
      </div>
    </header>
  )
}
