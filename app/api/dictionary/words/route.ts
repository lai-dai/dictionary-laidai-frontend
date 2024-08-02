import fs from 'fs'
import readline from 'readline'
import { NextResponse } from 'next/server'
import statusCodes from 'http-status-codes'
import qs from 'qs'
import { z, ZodError } from 'zod'
import path from 'path'

const DEFAULT_PAGE = 1,
  DEFAULT_PAGE_SIZE = 25

const schema = z.object({
  q: z.string().min(1, 'at least 1 letter'),
  page: z
    .number()
    .or(z.string().regex(/^\d+$/, { message: 'number' }).transform(Number))
    .default(DEFAULT_PAGE)
    .refine((n) => n > 0, { message: 'greater than 0' }),
  pageSize: z
    .number()
    .or(z.string().regex(/^\d+$/, { message: 'number' }).transform(Number))
    .default(DEFAULT_PAGE_SIZE)
    .refine((n) => n > 0, { message: 'greater than 0' }),
})

function getListPage(data: any[], page: number, pageSize: number) {
  if (!data.length) return []

  const start = (page - 1) * pageSize
  const end = page * pageSize

  return data.slice(start, end)
}

async function processLineByLine(params: z.infer<typeof schema>) {
  const { q, page, pageSize } = params

  return new Promise((resolve, reject) => {
    try {
      let list: string[] = []
      let wordsPath = path.join(process.cwd(), 'lib/data/words_alpha.txt')
      const lineReader = readline.createInterface({
        input: fs.createReadStream(wordsPath, {
          encoding: 'utf-8',
        }),
      })

      lineReader.on('line', (line) => {
        if (line.startsWith(q)) {
          list.push(line)
        }
      })

      lineReader.on('close', () => {
        const total = list.length

        resolve({
          list: getListPage(list, page, pageSize),
          pagination: {
            page,
            pageSize,
            pageCount: total ? Math.floor(total / pageSize) : 1,
            total,
          },
        })
      })
    } catch (error) {
      reject(error)
    }
  })
}

export async function GET(req: Request) {
  const params = qs.parse(req.url.split('?')[1])

  try {
    const validateFields = schema.parse(params)

    const result = await processLineByLine(validateFields)

    if (result) {
      return NextResponse.json(
        {
          data: result,
          message: 'Get successfully',
          status: true,
        },
        {
          status: statusCodes.OK,
        }
      )
    } else {
      return NextResponse.json(
        {
          data: result,
          message: 'Get successfully',
          status: true,
        },
        { status: statusCodes.NO_CONTENT }
      )
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((issue: any) => ({
        message: `${issue.path.join('.')} is ${issue.message}`,
      }))

      return NextResponse.json(
        {
          message: 'Invalid data',
          details: errorMessages,
          status: false,
        },
        {
          status: statusCodes.BAD_REQUEST,
        }
      )
    } else {
      return NextResponse.json(
        {
          message: 'Internal Server Error',
          status: false,
        },
        {
          status: statusCodes.INTERNAL_SERVER_ERROR,
        }
      )
    }
  }
}
