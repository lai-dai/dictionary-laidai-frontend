import React from 'react'
import { LoginForm } from './_components/form'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()

  if (session) redirect('/')

  return (
    <main className="container flex-1 grid place-content-center my-6">
      <LoginForm />
    </main>
  )
}
