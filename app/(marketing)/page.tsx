import { MarketingPageContainer } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { siteConfig } from '@/config/site'
import Link from 'next/link'

export default function Page() {
  return (
    <MarketingPageContainer asChild>
      <main className="flex-1 space-y-6">
        <Card className="py-14">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-semibold">
              Chào mừng bạn đến với {siteConfig.name}
            </h1>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href={'/dictionary'}>Tra từ điển</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Tài nguyên {siteConfig.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-6">
            <Button
              variant={'outline'}
              asChild
              className="h-auto flex-col justify-start items-start whitespace-normal"
            >
              <Link href={'/idioms'}>
                <h2 className="mb-3 text-xl font-semibold">Idioms</h2>
                <p className="m-0 text-sm opacity-50">
                  Thành ngữ là những từ không nhằm mục đích để hiểu theo nghĩa
                  thông thường
                </p>
              </Link>
            </Button>

            <Button
              variant={'outline'}
              asChild
              className="h-auto flex-col justify-start items-start whitespace-normal"
            >
              <Link href={'/examples'}>
                <h2 className="mb-3 text-xl font-semibold">Examples</h2>
                <p className="m-0 text-sm opacity-50">Tra câu tiếng anh</p>
              </Link>
            </Button>

            <Button
              variant={'outline'}
              asChild
              className="h-auto flex-col justify-start items-start whitespace-normal"
            >
              <Link href={'/part-of-speeches'}>
                <h2 className="mb-3 text-xl font-semibold">Part-of-Speeches</h2>
                <p className="m-0 text-sm opacity-50">
                  Từ loại là một hạng mục từ có các thuộc tính ngữ pháp giống
                  nhau
                </p>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Top {siteConfig.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <Button
              variant={'outline'}
              asChild
              className="h-auto flex-col justify-start items-start whitespace-normal"
            >
              <Link href={'/top-word'}>
                <h2 className="mb-3 text-xl font-semibold">Top word</h2>
                <p className="m-0 text-sm opacity-50">Từ được xem nhiều nhất</p>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </MarketingPageContainer>
  )
}
