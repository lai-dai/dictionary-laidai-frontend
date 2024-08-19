import { MarketingPageContainer } from '@/components/page-container'
import { siteConfig } from '@/config/site'
import React from 'react'

export function SiteFooter() {
  return (
    <footer id="footer">
      <MarketingPageContainer className="grid place-content-center py-3">
        <div className="border rounded-xl px-6 py-2">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            Made by{' '}
            <a
              href={siteConfig.links.website}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              {siteConfig.author}
            </a>
          </p>
        </div>
      </MarketingPageContainer>
    </footer>
  )
}
