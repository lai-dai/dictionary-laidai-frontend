'use client'

import React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SessionProvider, signOut, useSession } from 'next-auth/react'
import { differenceInSeconds } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { SelectionTextPopover } from '@/components/selection-text-popover'
import { useRouter } from 'next/navigation'

export function Providers({ children }: { children?: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={200} skipDelayDuration={100}>
          <SessionProvider>
            {children}
            <AuthAlert />
            <SelectionTextPopover />
          </SessionProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </NextThemesProvider>
  )
}

function AuthAlert() {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    session?.expires &&
    differenceInSeconds(new Date(session?.user.tokenExpires), new Date()) <
      1 && (
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Phiên đăng nhập của bạn đã hết hạn?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn hãy đăng nhập lại để sửa dụng các tính năng liên quan
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={async () => {
                await signOut({
                  callbackUrl:
                    window.location.pathname + window.location.search,
                })
                router.push(
                  '/login?callbackUrl=' +
                    window.location.pathname +
                    window.location.search
                )
              }}
            >
              Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  )
}
