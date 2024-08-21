'use client'

import React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useSession } from 'next-auth/react'
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
  const { data: session } = useSession()

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={200} skipDelayDuration={100}>
          {children}
          {session?.expires &&
            differenceInSeconds(new Date(session?.expires), new Date()) < 1 && (
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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Link href={'/login'}>Login</Link>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
        </TooltipProvider>
      </QueryClientProvider>
    </NextThemesProvider>
  )
}
