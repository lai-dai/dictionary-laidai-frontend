'use client'

import 'react-photo-view/dist/react-photo-view.css'

import { PhotoProvider, PhotoView } from 'react-photo-view'
import { PhotoProviderProps } from 'react-photo-view/dist/PhotoProvider'
import { PhotoViewProps } from 'react-photo-view/dist/PhotoView'

import { delve } from '@/lib/utils/delve'

import { Spinner } from './spinner'
import { cn } from '@/lib/utils'
import { forwardRef, HTMLAttributes, isValidElement, ReactElement } from 'react'

export function Photos({ className, ...props }: PhotoProviderProps) {
  return (
    <PhotoProvider
      maskOpacity={0.9}
      loadingElement={<Spinner className="size-12" />}
      className={cn('pointer-events-auto', className)}
      {...props}
    />
  )
}

export const PhotoContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function PhotoContent(props, ref) {
  return <div ref={ref} {...props} />
})

export function PhotoItem({
  children,
  ...props
}: Omit<PhotoViewProps, 'children'> & {
  children: ReactElement
}) {
  const src =
    !props.render && isValidElement(children)
      ? delve(
          children?.props as object,
          'data-src',
          delve(children?.props as object, 'src')
        )
      : undefined

  return (
    <PhotoView src={src} {...props}>
      {children}
    </PhotoView>
  )
}
