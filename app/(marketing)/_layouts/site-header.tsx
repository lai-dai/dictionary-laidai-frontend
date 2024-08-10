import React from 'react'
import { MainNav } from './nav-main'
import { MobileNav } from './nav-mobile'
import { LocaleToggle } from '@/components/locale-toggle'
import { UserNav } from './nav-user'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { MarketingPageContainer } from '@/components/page-container'
import { ModeToggle } from '@/components/mode-toggle'

export async function SiteHeader() {
  const session = await auth()
  const t = await getTranslations()
  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 w-full border-b border-muted bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <MarketingPageContainer className="flex h-14 items-center gap-3">
        <div className="flex-1">
          <MainNav />
          <MobileNav />
        </div>

        <LocaleToggle />
        <ModeToggle />
        {session?.user ? (
          <UserNav />
        ) : (
          <Button asChild>
            <Link href={'/login'}>{t('Login')}</Link>
          </Button>
        )}
      </MarketingPageContainer>
    </header>
  )
}
