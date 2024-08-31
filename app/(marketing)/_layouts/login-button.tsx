'use client'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'

export function LoginButton() {
  const t = useTranslations()
  return (
    <Button asChild>
      <Link
        href={
          '/login?callbackUrl=' +
          window.location.pathname +
          window.location.search
        }
      >
        {t('Login')}
      </Link>
    </Button>
  )
}
