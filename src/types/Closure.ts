import { DateRange } from "./DateRange"

// TODO: separate ClosurePatch (w/ID optional) from Closure
type Closure = DateRange & {
  id?: string
  note?: string,
  createdAt?: string,
  updatdAt?: string,
  current?: boolean,
  past?: boolean,
  future?: boolean
}

export type { Closure }
