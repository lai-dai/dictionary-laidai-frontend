import React, { ReactNode } from 'react'
import { SiteHeader } from './_layouts/site-header'
import { SiteFooter } from './_layouts/site-footer'
import { SelectionTextPopover } from '@/components/selection-text-popover'

export default function MarketingLayout({
  children,
}: {
  children?: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      {children}
      <SiteFooter />
      <SelectionTextPopover />
    </div>
  )
}
