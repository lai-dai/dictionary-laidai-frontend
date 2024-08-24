import { MarketingPageContainer } from '@/components/page-container'
import React from 'react'
import {
  UpdateMeForm,
  AvatarChoose,
  ChangePassword,
  DeleteMe,
} from './_components/view'

export const metadata = {
  title: 'Profile',
}

export default async function Page() {
  return (
    <MarketingPageContainer asChild>
      <main className="flex flex-col">
        <div className="flex-1 flex flex-col items-center gap-3">
          <AvatarChoose />
          <UpdateMeForm />
          <ChangePassword />
        </div>

        <div className="flex flex-col items-center gap-3">
          <DeleteMe />
        </div>
      </main>
    </MarketingPageContainer>
  )
}
