'use client'

import { DashboardPageContainer } from '@/components/page-container'
import { TinyEditor } from '@/components/tiny-editor'
import { Card, CardHeader } from '@/components/ui/card'
import React, { useState } from 'react'

export default function Page() {
  const [value, setValue] = useState<string>('')
  return (
    <DashboardPageContainer asChild>
      <main className="space-y-6">
        <TinyEditor
          value={value}
          onEditorChange={(value) => setValue(value)}
          init={{ height: 300, min_height: 300 }}
        />

        <Card>
          <CardHeader>
            <div
              className="prose prose-slate dark:prose-invert prose-sm"
              dangerouslySetInnerHTML={{ __html: value }}
            ></div>
          </CardHeader>
        </Card>
      </main>
    </DashboardPageContainer>
  )
}
