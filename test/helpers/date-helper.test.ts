import { describe, expect, it } from 'vitest'
import { ensureDate, formatPlainDate } from "../../src/helpers/date-helper"
import { formatISO } from "date-fns"

describe('ensureDate', () => {
  it('returns a Date as-is', () => {
    const date = new Date()
    expect(ensureDate(date)).toBe(date)
  })

  it('parses an ISO date', () => {
    const date = new Date()
    const dateISO = formatISO(date)
    const ensured = ensureDate(dateISO)
    expect(ensured).toBeInstanceOf(Date)
    expect(formatISO(ensured)).toEqual(dateISO)
  })

  it('returns Date { NaN } for invalid date strings', () => {
    const ensured = ensureDate('')
    expect(ensured).toBeInstanceOf(Date)
    expect(ensured.valueOf()).toBeNaN()
  })
})

describe('formatPlainDate', () => {
  it('returns an ISO date', () => {
    const date = new Date(1983, 0, 23, 1, 2, 3)
    const dateStr = formatPlainDate(date)
    expect(dateStr).toEqual('1983-01-23') // JS months are zero-indexed
  })

  it('parses an ISO datetime and returns an ISO date', () => {
    const datetimeStr = '1983-01-23T01:02:03'
    const dateStr = formatPlainDate(datetimeStr)
    expect(dateStr).toEqual('1983-01-23')
  })

  it('returns undefined for invalid date strings', () => {
    const nondate = 'I am not a date'
    const dateStr = formatPlainDate(nondate)
    expect(dateStr).toBeUndefined()
  })

  it('returns undefined for null', () => {
    // @ts-ignore
    const dateStr = formatPlainDate(null)
    expect(dateStr).toBeUndefined()
  })

  it('returns undefined for undefined', () => {
    // @ts-ignore
    const dateStr = formatPlainDate(undefined)
    expect(dateStr).toBeUndefined()
  })
})
