import { describe, expect, it } from 'vitest'
import { ensureDate, formatPlainDate, isValidDate, validateDateRange } from "../../src/helpers/date-helper"
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
    const ensured = ensureDate('I am not a date')
    expect(ensured).toBeInstanceOf(Date)
    expect(ensured.getTime()).toBeNaN()
  })

  it('returns Date { NaN } for empty date strings', () => {
    const ensured = ensureDate('')
    expect(ensured).toBeInstanceOf(Date)
    expect(ensured.getTime()).toBeNaN()
  })

  it('returns Date { NaN } for undefined', () => {
    const ensured = ensureDate(undefined)
    expect(ensured).toBeInstanceOf(Date)
    expect(ensured.getTime()).toBeNaN()
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
    // @ts-ignore: invalid value for testing
    const dateStr = formatPlainDate(null)
    expect(dateStr).toBeUndefined()
  })

  it('returns undefined for undefined', () => {
    const dateStr = formatPlainDate(undefined)
    expect(dateStr).toBeUndefined()
  })
})

describe('isValidDate', () => {
  it('returns true for a non-NaN date', () => {
    const date = new Date()
    expect(isValidDate(date)).toEqual(true)
  })

  it('returns true for an ISO date', () => {
    const date = new Date()
    const dateISO = formatISO(date)
    expect(isValidDate(dateISO)).toEqual(true)
  })

  it('returns false for an invalid date string', () => {
    const nonDate = 'I am not a date'
    expect(isValidDate(nonDate)).toEqual(false)
  })

  it('returns false for an empty date string', () => {
    expect(isValidDate('')).toEqual(false)
  })

  it('returns false for a NaN date', () => {
    const nanDate = new Date(NaN)
    expect(isValidDate(nanDate)).toEqual(false)
  })
})

// TODO: make this table-driven
describe('validateDateRange', () => {
  it('requires a start date', () => {
    const startDate = undefined
    const endDate = undefined
    const errors = validateDateRange(startDate, endDate)
    const errorKeys = Object.keys(errors)
    expect(errorKeys).toHaveLength(1)
    expect(errorKeys).toContain('startDate')
  })

  describe('with Date objects', () => {
    it('requires a start date even if end date is defined', () => {
      const startDate = undefined
      const endDate = new Date()
      const errors = validateDateRange(startDate, endDate)
      const errorKeys = Object.keys(errors)
      expect(errorKeys).toHaveLength(1)
      expect(errorKeys).toContain('startDate')
    })

    it('does not require an end date', () => {
      const startDate = new Date()
      const endDate = undefined
      const errors = validateDateRange(startDate, endDate)
      const errorKeys = Object.keys(errors)
      expect(errorKeys).toHaveLength(0)
    })

    it('rejects equal start and end dates', () => {
      const startDate = new Date(1983, 0, 27, 1, 2, 3)
      const endDate = new Date(1983, 0, 27, 1, 2, 3)
      const errors = validateDateRange(startDate, endDate)
      const errorKeys = Object.keys(errors)
      expect(errorKeys).toEqual(['startDate', 'endDate'])
    })

    it('rejects start date > end date', () => {
      const startDate = new Date(2001, 0, 27, 1, 2, 3)
      const endDate = new Date(1983, 0, 27, 1, 2, 3)
      const errors = validateDateRange(startDate, endDate)
      const errorKeys = Object.keys(errors)
      expect(errorKeys).toEqual(['startDate', 'endDate'])
    })

    it('accepts start date < end date', () => {
      const startDate = new Date(1983, 0, 27, 1, 2, 3)
      const endDate = new Date(2001, 0, 27, 1, 2, 3)
      const errors = validateDateRange(startDate, endDate)
      const errorKeys = Object.keys(errors)
      expect(errorKeys).toHaveLength(0)
    })
  })

  describe('with strings', () => {
    it('requires a start date even if end date is defined', () => {
      const startDate = undefined
      const endDate = formatISO(new Date())
      const errors = validateDateRange(startDate, endDate)
      const errorKeys = Object.keys(errors)
      expect(errorKeys).toHaveLength(1)
      expect(errorKeys).toContain('startDate')
    })

    it('does not require an end date', () => {
      const startDate = formatISO(new Date())
      const endDate = undefined
      const errors = validateDateRange(startDate, endDate)
      const errorKeys = Object.keys(errors)
      expect(errorKeys).toHaveLength(0)
    })

    it('rejects an empty start date', () => {
      const startDate = ''
      const endDate = new Date(1983, 0, 27, 1, 2, 3)
      const errors = validateDateRange(startDate, endDate)
      const errorKeys = Object.keys(errors)
      expect(errorKeys).toEqual(['startDate'])
    })

    it('rejects a non-date start date string', () => {
      const startDate = 'I am not a date'
      const endDate = new Date(1983, 0, 27, 1, 2, 3)
      const errors = validateDateRange(startDate, endDate)
      const errorKeys = Object.keys(errors)
      expect(errorKeys).toEqual(['startDate'])
    })

    it('accepts an empty end date', () => {
      const startDate = new Date(1983, 0, 27, 1, 2, 3)
      const endDate = ''
      const errors = validateDateRange(startDate, endDate)
      const errorKeys = Object.keys(errors)
      expect(errorKeys).toEqual([])
    })

    it('rejects a non-date end date', () => {
      const startDate = new Date(1983, 0, 27, 1, 2, 3)
      const endDate = 'I am not a date'
      const errors = validateDateRange(startDate, endDate)
      const errorKeys = Object.keys(errors)
      expect(errorKeys).toEqual(['endDate'])
    })

    it('rejects equal start and end dates', () => {
      const startDate = formatISO(new Date(1983, 0, 27, 1, 2, 3))
      const endDate = formatISO(new Date(1983, 0, 27, 1, 2, 3))
      const errors = validateDateRange(startDate, endDate)
      const errorKeys = Object.keys(errors)
      expect(errorKeys).toEqual(['startDate', 'endDate'])
    })

    it('rejects start date > end date', () => {
      const startDate = formatISO(new Date(2001, 0, 27, 1, 2, 3))
      const endDate = formatISO(new Date(1983, 0, 27, 1, 2, 3))
      const errors = validateDateRange(startDate, endDate)
      const errorKeys = Object.keys(errors)
      expect(errorKeys).toEqual(['startDate', 'endDate'])
    })

    it('accepts start date < end date', () => {
      const startDate = formatISO(new Date(1983, 0, 27, 1, 2, 3))
      const endDate = formatISO(new Date(2001, 0, 27, 1, 2, 3))
      const errors = validateDateRange(startDate, endDate)
      const errorKeys = Object.keys(errors)
      expect(errorKeys).toHaveLength(0)
    })
  })
})
