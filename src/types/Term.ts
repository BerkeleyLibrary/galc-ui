import { Facet } from "./Facet"

type Term = {
  id: string,
  value: string,
  ord?: number,
  facet: Facet
  parent?: Term
  children?: Array<Term>
}

export type { Term }
