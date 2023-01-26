import { Item } from "./Item"

type Reservation = {
  item: Item,
  id?: string,
  user?: { id: string },
  confirmed?: boolean
}

export type { Reservation }
