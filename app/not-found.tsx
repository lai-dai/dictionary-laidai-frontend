import '@/styles/globals.css'

import { NotFound } from '@/components/not-found'
import { fontMono, fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import React from 'react'

export default function NotFoundPage() {
  return (
    <html lang={'en'} suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <NotFound />
      </body>
    </html>
  )
}
