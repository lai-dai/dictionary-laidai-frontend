'use client'

import { getSelectionText } from '@/lib/utils/selection-text'
import React, { useEffect, useState } from 'react'
import {
  useFloating,
  autoUpdate,
  flip,
  shift,
  useDismiss,
  useInteractions,
  inline,
} from '@floating-ui/react'
import { isMobile } from './device-detect'
import { WordView } from '@/app/(marketing)/word/[word]/_components/view'
import { usePathname } from 'next/navigation'
import { Card } from './ui/card'

export function SelectionTextPopover() {
  const [open, setOpen] = useState(false)
  const [key, setKey] = useState('')
  // const [key] = useDebounce(_key, 1000)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const { refs, floatingStyles, context } = useFloating({
    open: open,
    onOpenChange: setOpen,
    middleware: [inline(), flip(), shift()],
    whileElementsMounted: autoUpdate,
  })

  const dismiss = useDismiss(context)

  const { getFloatingProps } = useInteractions([dismiss])

  useEffect(() => {
    function handleMouseUp(event: MouseEvent | ToggleEvent) {
      if (refs.floating.current?.contains(event.target as Element | null)) {
        return
      }

      setTimeout(() => {
        const selection = window.getSelection()
        const range =
          typeof selection?.rangeCount === 'number' && selection.rangeCount > 0
            ? selection.getRangeAt(0)
            : null

        if (selection?.isCollapsed) {
          setOpen(false)
          return
        }

        if (range) {
          refs.setReference({
            getBoundingClientRect: () => range.getBoundingClientRect(),
            getClientRects: () => range.getClientRects(),
          })
          const text = getSelectionText().trim()
          const isSentence = /\s/.test(text)

          if (!isSentence && text) {
            setKey(text)
            setOpen(true)
          }
        }
      })
    }

    function handleMouseDown(event: MouseEvent | ToggleEvent) {
      if (refs.floating.current?.contains(event.target as Element | null)) {
        return
      }

      if (window.getSelection()?.isCollapsed) {
        setOpen(false)
      }
    }

    if (isMobile) {
      window.addEventListener('touchend', handleMouseUp as any)
      window.addEventListener('touchstart', handleMouseDown as any)
    } else {
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('mousedown', handleMouseDown)
    }

    return () => {
      if (isMobile) {
        window.removeEventListener('touchend', handleMouseUp as any)
        window.removeEventListener('touchstart', handleMouseDown as any)
      } else {
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('mousedown', handleMouseDown)
      }
    }
  }, [refs])

  return (
    open && (
      <div
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          paddingTop: 20,
        }}
        {...getFloatingProps()}
      >
        <Card className="max-h-[50vh] overflow-y-auto w-96 shadow-none">
          <WordView
            key={key}
            word={key.toLowerCase()}
            enabled={true}
            staleTime={0}
            gcTime={0}
            queryKey={['floating', key]}
            className={'border-0'}
          />
        </Card>
      </div>
    )
  )
}
