import { MarketingPageContainer } from '@/components/page-container'
import { Spinner } from '@/components/ui/spinner'

export default function Loading() {
  return (
    <MarketingPageContainer asChild>
      <main className="grid place-content-center">
        <Spinner />
      </main>
    </MarketingPageContainer>
  )
}
