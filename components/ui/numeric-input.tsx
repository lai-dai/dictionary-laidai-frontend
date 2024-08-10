import React, { forwardRef } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { Input } from './input'

export const NumericInput = forwardRef<HTMLInputElement, NumericFormatProps>(
  function NumericInput(props, ref) {
    return <NumericFormat getInputRef={ref} customInput={Input} {...props} />
  }
)
