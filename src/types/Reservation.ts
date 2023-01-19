type Reservation = {
  id?: string,
  // TODO: separate ItemPatch (w/ID optional) from Item
  item: { id?: string },
  user?: { id: string },
  confirmed?: boolean
}

export type { Reservation }
