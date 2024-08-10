import { Slot } from '@radix-ui/react-slot'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Validator, FieldApi, FormApi } from '@tanstack/react-form'
import {
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
  ReactNode,
  createContext,
  forwardRef,
  useContext,
  useId,
} from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const FormContext = createContext<FormApi<any, any> | null>(null)

export function useFormContext<
  TFormData = any,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>() {
  const context = useContext(FormContext)
  if (!context) throw new Error('useFormContext should be used within <Form>')

  return context as FormApi<TFormData, TFormValidator>
}

export function Form({
  form,
  children,
}: {
  form: FormApi<any, any>
  children: ReactNode
}) {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>
}

const FormItemContext = createContext<FieldApi<any, any, any, any> | null>(null)

export const FormItem = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    field: FieldApi<any, any, any, any>
  }
>(function FormItem({ className, field, style, ...props }, ref) {
  return (
    <FormItemContext.Provider value={field}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  )
})

export function useFormItem() {
  const context = useContext(FormItemContext)
  const id = useId()
  if (!context) throw new Error('useFormItem should be used within <FormItem>')
  return {
    id,
    formItemId: `${context.name}-form-item`,
    formDescriptionId: `${context.name}-form-item-description`,
    formMessageId: `${context.name}-form-item-message`,
    ...context,
  }
}

export const FormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(function FormLabel({ className, ...props }, ref) {
  const { state, formItemId } = useFormItem()
  return (
    <Label
      ref={ref}
      className={cn(state.meta.errors.length && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})

export const FormControl = forwardRef<
  ElementRef<typeof Slot>,
  ComponentPropsWithoutRef<typeof Slot>
>(function FormControl({ ...props }, ref) {
  const { state, formItemId, formDescriptionId, formMessageId } = useFormItem()
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !state.meta.errors.length
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!state.meta.errors.length}
      {...props}
    />
  )
})

export const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function FormDescription({ className, ...props }, ref) {
  const { formDescriptionId } = useFormItem()
  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
})

export const FormMessage = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function FormMessage({ className, children, ...props }, ref) {
  const { state, formMessageId } = useFormItem()
  const body = state.meta.errors.length
    ? String(state.meta.errors.join(','))
    : children
  if (!body) return null
  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  )
})
