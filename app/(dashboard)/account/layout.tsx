import { SiteFooter } from '@/app/(marketing)/_layouts/site-footer'
import { SiteHeader } from '@/app/(marketing)/_layouts/site-header'
import React, { ReactNode } from 'react'

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  )
}
