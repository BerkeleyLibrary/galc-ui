import { Item } from "./Item"
import { Availability } from "./Availability"
import { Pagination } from "./Pagination"

type ItemResults = {
  data: Array<Item>,
  meta: {
    availability: Availability,
    pagination: Pagination
  }
}

export type { ItemResults }
