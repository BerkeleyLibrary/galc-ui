import { Params } from "./Params"
import { ItemResults } from "./ItemResults"
import { FacetResults } from "./FacetResults"
import { ClosureResults } from "./ClosureResults"
import { Item } from "./Item"
import { Reservation } from "./Reservation"
import { User } from "../User"
import { Image } from "./Image"
import { Closure } from "./Closure"

type Result<T> = {
  data?: T
}

type One<T> = {
  get(): Promise<Result<T>>,
  patch(v: T): Promise<Result<T>>
}

// TODO: check whether we're really returning Promise<T> or Promise<Result<T>>
type GalcApi = {
  one(endpoint: 'item', id: string): One<Item>
  find(endpoint: 'item', id: string, params: Params): Promise<Result<Item>>
  create(endpoint: 'item', item: Item):  Promise<Result<Item>>
  findAll(endpoint: 'items', params: Params): Promise<ItemResults>

  create(endpoint: 'reservation', args: RsvnArgs): Promise<Result<Reservation>>

  one(endpoint: 'user', id: string): One<User>

  find(endpoint: 'image', id: string): Promise<Result<Image>>
  destroy(endpoint: 'image', id: string): Promise<void>

  create(endpoint: 'closure', closure: Closure): Promise<Result<Closure>>
  one(endpoint: 'closure', id: string): One<Closure>
  destroy(endpoint: 'closure', id: string): Promise<void>

  findAll(endpoint: 'closures', params: Params): Promise<ClosureResults>
  findAll(endpoint: 'facets', params: Params): Promise<FacetResults>
}

export type { GalcApi, Result }

type RsvnArgs = {
  item: { id: string }
}
