import { format as formatDate } from 'date-fns-tz'
import { formatISO, parseISO } from 'date-fns'

const rawDateFmtISO = 'yyyy-MM-dd'
const dateTimeFmt = 'yyyy-MM-dd h:mm aa'

// TODO: remove unused functions

export function ensureDate (isoDate) {
  return (isoDate instanceof Date) ? isoDate : parseISO(isoDate)
}

export function browserTZ () {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function nextMidnight () {
  const date = new Date()
  date.setHours(24, 0, 0, 0)
  return date
}

export function dateToDateInput (date) {
  try {
    const d = ensureDate(date)
    const result = formatDate(d, rawDateFmtISO)
    console.log('date: %o => d: %o => result: %o', date, d, result)
    return result
  } catch (e) {
    console.log(e)
    return null
  }
}

export function dateToISO8601 (dateVal) {
  try {
    const d = ensureDate(dateVal)
    return formatISO(d)
  } catch (e) {
    console.log(e)
    return null
  }
}

export function formatDateTime (date) {
  try {
    const d = ensureDate(date)
    return formatDate(d, dateTimeFmt)
  } catch (e) {
    console.log(e)
    return null
  }
}
