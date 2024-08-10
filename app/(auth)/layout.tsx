import { auth } from '@/lib/auth'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { SiteHeader } from './_layouts/site-header'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        {children}
      </div>
    </SessionProvider>
  )
}
