'use client'

import * as React from 'react'
import Link from 'next/link'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import { Logo } from '@/components/logo'

export function MainNav() {
  return (
    <div className="hidden w-full justify-between gap-3 md:flex">
      <Link href="/" className="flex items-center lg:mr-6">
        <Logo className="h-6 w-6 mr-3" />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>

      <NavigationMenuDemo />
    </div>
  )
}

export const menu_list: { title: string; href: string; description: string }[] =
  [
    {
      title: 'Contact',
      href: '/contact',
      description: 'Có câu hỏi nào, hãy liên hệ với tôi nhé',
    },
    {
      title: 'Idioms',
      href: '/idioms',
      description:
        'Thành ngữ là những từ không nhằm mục đích để hiểu theo nghĩa thông thường',
    },
    // {
    //   title: 'Examples',
    //   href: '/examples',
    //   description: 'Tra câu tiếng anh',
    // },
    {
      title: 'Part-of-Speeches',
      href: '/part-of-speeches',
      description:
        'Từ loại là một hạng mục từ có các thuộc tính ngữ pháp giống nhau',
    },
    {
      title: 'Top word',
      href: '/top-word',
      description: 'Từ được xem nhiều nhất',
    },
  ]

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/dictionary" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Tra từ
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/examples" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Tra câu
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>About</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-96">
              {menu_list.map((item) => (
                <Link key={item.title} href={item.href} legacyBehavior passHref>
                  <ListItem title={item.title} href={item.href}>
                    {item.description}
                  </ListItem>
                </Link>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
