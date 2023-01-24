type DateRangeAttr = 'startDate' | 'endDate'

type DateRangeErrors = {
  [key in DateRangeAttr]?: string
}

type DateRange = {
  // TODO: figure out how to parse these on retrieval
  [key in DateRangeAttr]?: Date | string
}

export type { DateRange, DateRangeAttr, DateRangeErrors }
