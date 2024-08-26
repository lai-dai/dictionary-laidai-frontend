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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Link from 'next/link'

export function Providers({ children }: { children?: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 5000,
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
          </SessionProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </NextThemesProvider>
  )
}

function AuthAlert() {
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
            <AlertDialogAction asChild>
              <Link
                href={
                  '/login?callbackUrl=' +
                  window.location.pathname +
                  window.location.search
                }
                onClick={() => {
                  signOut({
                    callbackUrl:
                      window.location.pathname + window.location.search,
                  })
                }}
              >
                Login
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  )
}
