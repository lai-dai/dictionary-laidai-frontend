import {
  AlignLeft,
  AlignStartVertical,
  AudioLines,
  Bookmark,
  Folder,
  LayoutGrid,
  LucideIcon,
  MessageSquareText,
  Pilcrow,
  Settings,
  Ship,
  SquarePen,
  Tag,
  Users,
} from 'lucide-react'

type Submenu = {
  href: string
  label: string
  active: boolean
}

type Menu = {
  href: string
  label: string
  active: boolean
  icon: LucideIcon
  submenus: Submenu[]
}

type Group = {
  groupLabel: string
  menus: Menu[]
}

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          active: pathname === '/dashboard',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Dictionary',
      menus: [
        {
          href: '/dashboard/words',
          label: 'Words',
          active: false,
          icon: SquarePen,
          submenus: [
            {
              href: '/dashboard/words',
              label: 'All Words',
              active: pathname === '/dashboard/words',
            },
            {
              href: '/dashboard/words/create',
              label: 'New Word',
              active: pathname === '/dashboard/words/create',
            },
          ],
        },
        {
          href: '/dashboard/phonetics',
          label: 'Phonetics',
          active: false,
          icon: AudioLines,
          submenus: [
            {
              href: '/dashboard/phonetics',
              label: 'All phonetics',
              active: pathname === '/dashboard/phonetics',
            },
            {
              href: '/dashboard/phonetics/create',
              label: 'New phonetics',
              active: pathname === '/dashboard/phonetics/create',
            },
          ],
        },
        {
          href: '/dashboard/idioms',
          label: 'Idioms',
          active: false,
          icon: Ship,
          submenus: [
            {
              href: '/dashboard/idioms',
              label: 'All idioms',
              active: pathname === '/dashboard/idioms',
            },
            {
              href: '/dashboard/idioms/create',
              label: 'New idioms',
              active: pathname === '/dashboard/idioms/create',
            },
          ],
        },
        {
          href: '/dashboard/meanings',
          label: 'Meanings',
          active: pathname.startsWith('/dashboard/meanings'),
          icon: Folder,
          submenus: [],
        },
        {
          href: '/dashboard/definitions',
          label: 'Definitions',
          active: pathname.startsWith('/dashboard/definitions'),
          icon: AlignStartVertical,
          submenus: [],
        },
        {
          href: '/dashboard/examples',
          label: 'Examples',
          active: pathname.startsWith('/dashboard/examples'),
          icon: AlignLeft,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Features',
      menus: [
        {
          href: '/dashboard/comments',
          label: 'Comments',
          active: pathname.startsWith('/dashboard/comments'),
          icon: MessageSquareText,
          submenus: [],
        },
        {
          href: '/dashboard/favorites',
          label: 'Favorites',
          active: pathname.startsWith('/dashboard/favorites'),
          icon: Bookmark,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Data',
      menus: [
        {
          href: '/dashboard/part-of-speeches',
          label: 'Part of Speeches',
          active: false,
          icon: Pilcrow,
          submenus: [
            {
              href: '/dashboard/part-of-speeches',
              label: 'All Part of Speeches',
              active: pathname === '/dashboard/part-of-speeches',
            },
            {
              href: '/dashboard/part-of-speeches/create',
              label: 'New Part of Speech',
              active: pathname === '/dashboard/part-of-speeches/create',
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/dashboard/users',
          label: 'Users',
          active: pathname.startsWith('/dashboard/users'),
          icon: Users,
          submenus: [],
        },
        {
          href: '/dashboard/settings',
          label: 'Settings',
          active: pathname.startsWith('/dashboard/settings'),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ]
}
