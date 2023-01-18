import { Item } from "./Item"
import { Availability } from "./Availability"
import { Pagination } from "./Pagination"

type ItemResults = {
  data: Item[],
  meta: {
    availability: Availability,
    pagination: Pagination
  }
}

export type { ItemResults }
