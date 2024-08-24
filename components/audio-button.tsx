import React from 'react'
import { useSound } from 'use-sound'
import { Button, ButtonProps } from './ui/button'
import { chain } from '@/lib/utils/chain'

export function AudioButton({
  src,
  onClick,
  ...props
}: ButtonProps & { src: string }) {
  const [play] = useSound(src)
  return (
    <Button
      onClick={chain(onClick, () => {
        play()
      })}
      {...props}
    />
  )
}
