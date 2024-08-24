import '@/styles/globals.css'

import type { Metadata, Viewport } from 'next'
import { cn } from '@/lib/utils'
import { fontMono, fontSans } from '@/lib/fonts'
import { Providers } from './providers'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { getLocale, getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { siteConfig } from '@/config/site'
import { Toaster } from '@/components/ui/sonner'
import { DeviceDetectProvider } from '@/components/device-detect/server'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: ['Dictionary', 'My dictionary', 'Next.js', 'React', 'Tailwind CSS'],
  icons: {
    icon: '/favicon.ico',
  },
  authors: [
    {
      name: siteConfig.author,
      url: new URL(siteConfig.url),
    },
  ],
  creator: siteConfig.author,
  robots: siteConfig.robots,
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  userScalable: false,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()])

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <div vaul-drawer-wrapper="">
          <NextIntlClientProvider messages={messages}>
            <DeviceDetectProvider>
              <Providers>{children}</Providers>
            </DeviceDetectProvider>
          </NextIntlClientProvider>
        </div>
        <TailwindIndicator />
        <Toaster />
      </body>
    </html>
  )
}
