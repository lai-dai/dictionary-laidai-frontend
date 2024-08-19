import { FormApi, Validator } from '@tanstack/react-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const onSubmitInvalid = <TData extends Record<string, any>>(
  parse: z.SafeParseReturnType<TData, TData>,
  formApi: FormApi<TData, Validator<TData>>
) => {
  if (!parse.success) {
    parse.error.issues.forEach((item) => {
      const fieldPath = item.path.map((e, i) => {
        const r = typeof e === 'number' ? `[${e}]` : i === 0 ? e : '.' + e
        return r
      })

      formApi.setFieldMeta(fieldPath.join('') as any, {
        errors: [item.message],
        errorMap: {
          onSubmit: item.message,
        },
        isDirty: false,
        isPristine: false,
        isTouched: false,
        isValidating: false,
      })
    })

    const message = parse.error.issues.map((e) => e.message).join(', ')

    toast.error(message)
  }
}
