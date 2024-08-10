import { format, isValid } from 'date-fns'

export function dateFormat(
  date?: string | number,
  formatStr = 'dd/MM/yyyy HH:mm:ss',
  defaultValue = ''
) {
  if (!date || isValid(date)) return defaultValue
  return format(new Date(date), formatStr)
}
