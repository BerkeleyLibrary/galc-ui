import { format as formatDate } from 'date-fns-tz'
import { parseISO } from 'date-fns'

const rawDateFmtISO = 'yyyy-MM-dd'

export function ensureDate(isoDate: Date | string | undefined): Date {
  if (isoDate instanceof Date) {
    return isoDate
  } else {
    return parseISO(isoDate ?? '')
  }
}

export function formatPlainDate(date: Date | string | undefined): string | undefined {
  try {
    const d = ensureDate(date)
    return formatDate(d, rawDateFmtISO)
  } catch (e) {
    console.log('Invalid date: %o', date)
    console.log(e)
    return undefined
  }
}

export function isValidDate(date: Date | string | undefined) {
  if (date) {
    const dateActual = ensureDate(date)
    return !isNaN(dateActual.getTime())
  }
  return false
}

// TODO: Take a DateRange as an argument
export function validateDateRange(startDate: Date | string | undefined, endDate: Date | string | undefined) {
  if (!startDate) {
    return { startDate: 'You must specify a start date.' }
  }

  if (!isValidDate(startDate)) {
    return { startDate: `Invalid start date: ${startDate}` }
  }

  if (endDate) {
    if (!isValidDate(endDate)) {
      return { endDate: `Invalid end date: ${endDate}` }
    }

    if (ensureDate(startDate) >= ensureDate(endDate)) {
      return {
        startDate: 'The start date must be at least one day after the end date.',
        endDate: 'The end date must be at least one day after the start date.'
      }
    }
  }

  return {}
}
