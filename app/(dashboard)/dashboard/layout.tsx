import { auth } from '@/lib/auth'
import React, { ReactNode } from 'react'
import { SiteHeader } from './_layout/site-header'
import { NotFound } from '@/components/not-found'
import { getTranslations } from 'next-intl/server'
import { isAdmin } from '@/lib/utils/is-admin'
import { SiteAside } from './_layout/site-aside'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()
  const t = await getTranslations()
  if (!isAdmin(session?.user)) {
    return (
      <main className="min-h-screen grid place-content-center">
        <NotFound
          statusCode={401}
          message={t('You are not authorized to access this page')}
        />
      </main>
    )
  }
  return (
    <>
      <SiteAside />
      <div className="min-h-screen flex flex-col md:pl-64">
        <SiteHeader />
        {children}
      </div>
    </>
  )
}
