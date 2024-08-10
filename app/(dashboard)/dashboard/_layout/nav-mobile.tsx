import Link from 'next/link'
import { MenuIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Menu } from './menu'
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { siteConfig } from '@/config/site'
import { Logo } from '@/components/logo'

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden shrink-0" variant="outline" size="icon">
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <path
              d="M3 5H11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 12H16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 19H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button variant="link" asChild>
            <Link href="/">
              <Logo className="size-5 mr-3" />
              <h1 className="font-bold text-lg">{siteConfig.name}</h1>
            </Link>
          </Button>
        </SheetHeader>
        <Menu />
      </SheetContent>
    </Sheet>
  )
}
