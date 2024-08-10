import React from 'react'
import { LocaleToggle } from '@/components/locale-toggle'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { siteConfig } from '@/config/site'

export async function SiteHeader() {
  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 w-full border-b border-muted bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-14 items-center gap-3">
        <Link href="/" className="flex items-center space-x-2 lg:mr-6">
          <Logo className="h-6 w-6" />
          <span className="hidden font-bold lg:inline-block">
            {siteConfig.name}
          </span>
        </Link>

        <div className="ml-auto">
          <LocaleToggle />
        </div>
      </div>
    </header>
  )
}
