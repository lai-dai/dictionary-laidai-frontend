'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { QUERY_KEYS } from '@/lib/constants/query-key'
import { ResFindOne } from '@/lib/types/common'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { WordAttr } from '../_lib/type'
import { Center } from '@/components/ui/center'
import { Spinner } from '@/components/ui/spinner'
import { Message } from '@/components/message'
import { getErrorMessage } from '@/lib/utils/error-message'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { firstLetterBuilder } from '@/lib/utils/first-letter-builder'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { AudioLines, Notebook } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function WordView({ word }: { word: string }) {
  const searchData = useQuery<ResFindOne<WordAttr>>({
    queryKey: [QUERY_KEYS.word, word],
    enabled: false,
  })

  if (searchData.status === 'pending') {
    return (
      <Center>
        <Spinner size={'lg'} />
      </Center>
    )
  } else if (searchData.status === 'error') {
    return (
      <Center>
        <Message.Error>{getErrorMessage(searchData.error)}</Message.Error>
      </Center>
    )
  }
  const data = searchData.data?.data

  return (
    <Card className="shadow-none border-none">
      <CardHeader className="p-2 md:p-4">
        <CardTitle className="capitalize">{data.word}</CardTitle>
        <CardDescription className="flex flex-col gap-3">
          {data.phonetics.length > 0 &&
            data.phonetics.map((item) => {
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <p>[{item.phonetic}]</p>
                  {item.audio && (
                    <Button
                      onClick={() => {
                        toast.info('Tính năng đang phát triển')
                      }}
                      size={'icon'}
                      variant={'ghost'}
                    >
                      <AudioLines className="size-4" />
                    </Button>
                  )}
                </div>
              )
            })}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-2 md:p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle title="meanings" className="font-semibold">
              Dịch nghĩ:{' '}
            </CardTitle>
          </CardHeader>

          {data.meanings.length > 0 &&
            data.meanings.map((item) => {
              return (
                <CardContent key={item.id} className="space-y-3">
                  <h4 className="font-semibold">
                    {item.partOfSpeech.translate || '-'} (
                    {item.partOfSpeech.abbreviation})
                  </h4>

                  <ol className="list-decimal pl-4">
                    {item.definitions.length > 0 &&
                      item.definitions.map((itm, idx) => {
                        return (
                          <li key={itm.id} className="space-y-1">
                            <div
                              className="prose prose-slate dark:prose-invert"
                              dangerouslySetInnerHTML={{
                                __html: itm.definition,
                              }}
                            ></div>

                            <ul className="list-disc list-inside pl-2 space-y-1">
                              {itm.examples.length > 0 &&
                                itm.examples.map((it) => {
                                  return (
                                    <li key={it.id}>
                                      {it.sentence}: {it.translate}
                                    </li>
                                  )
                                })}
                            </ul>
                          </li>
                        )
                      })}
                  </ol>
                </CardContent>
              )
            })}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle title="Idioms" className="font-semibold">
              Thành ngữ:{' '}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="list-decimal pl-4 space-y-1">
              {data.idioms.length > 0 &&
                data.idioms.map((item) => {
                  return (
                    <li key={item.id} className="space-y-1">
                      <p>
                        {item.idiom}: {item.definition}
                      </p>
                      {item.description && (
                        <div
                          className="prose prose-slate dark:prose-invert prose-sm"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        ></div>
                      )}

                      <ul className="list-disc list-inside pl-2 space-y-1">
                        {item.examples.length > 0 &&
                          item.examples.map((itm) => {
                            return (
                              <li key={itm.id}>
                                {itm.sentence}: {itm.translate}
                              </li>
                            )
                          })}
                      </ul>
                    </li>
                  )
                })}
            </ul>
          </CardContent>
        </Card>

        {data.description && (
          <Alert>
            <Notebook className="size-5" />
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>
              <div
                className="prose prose-slate dark:prose-invert prose-sm"
                dangerouslySetInnerHTML={{ __html: data.description }}
              ></div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="p-2 md:p-4 justify-between">
        <div className="flex items-center gap-3 text-muted-foreground">
          Created By:{' '}
          {data.createdBy.role === 'admin' ? (
            <p>admin</p>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {firstLetterBuilder(data.createdBy.name)}
                </AvatarFallback>
              </Avatar>
              <p>{data.createdBy.name}</p>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {format(data.createdAt, 'dd/MM/yyyy')}
        </p>
      </CardFooter>
    </Card>
  )
}
