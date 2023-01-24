import { format as formatDate } from 'date-fns-tz'
import { parseISO } from 'date-fns'

const rawDateFmtISO = 'yyyy-MM-dd'

export function ensureDate (isoDate: Date | string): Date {
  return (isoDate instanceof Date) ? isoDate : parseISO(isoDate)
}

export function formatPlainDate (date: Date | string): string | undefined {
  try {
    const d = ensureDate(date)
    return formatDate(d, rawDateFmtISO)
  } catch (e) {
    console.log('Invalid date: %o', date)
    console.log(e)
    return undefined
  }
}
