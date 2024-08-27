import { MarketingPageContainer } from '@/components/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { SearchDictionary } from './_components/view'

export const metadata = {
  title: 'Tra từ',
}

export default function Page() {
  return (
    <MarketingPageContainer asChild>
      <main>
        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 md:px-6">
            <CardTitle>Tra từ</CardTitle>
          </CardHeader>
          <CardContent className="px-0 md:px-6">
            <SearchDictionary />
          </CardContent>
        </Card>
      </main>
    </MarketingPageContainer>
  )
}
