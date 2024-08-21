import React from 'react'
import { SiteHeader } from './_layouts/site-header'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      {children}
    </div>
  )
}
