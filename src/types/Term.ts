import { Facet } from "./Facet"

type Term = {
  id: string,
  value: string,
  facet: Facet
  parent?: Term
}

export type { Term }
