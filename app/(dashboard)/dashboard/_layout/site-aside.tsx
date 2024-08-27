import { Logo } from '@/components/logo'
import { siteConfig } from '@/config/site'
import Link from 'next/link'
import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Menu } from './menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function SiteAside() {
  return (
    <aside className="hidden fixed top-0 left-0 h-screen w-64 border-r border-muted md:flex flex-col">
      <div className="flex items-center h-14 px-2">
        <Button variant="link" asChild>
          <Link href="/" className="hover:no-underline">
            <Logo className="size-5 mr-3" />
            <h1
              className={cn(
                'font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300 translate-x-0 opacity-100'
              )}
            >
              {siteConfig.name}
            </h1>
          </Link>
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <Menu />
      </ScrollArea>
    </aside>
  )
}
