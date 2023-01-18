import { Term } from "./Term"

type Facet = {
  id: string
  name: string
  ord?: number,
  allowMultiple: boolean
  terms: Term[]
}

export type { Facet }
