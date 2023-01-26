import { Params } from "./Params"
import { ItemResults } from "./ItemResults"
import { FacetResults } from "./FacetResults"
import { ClosureResults } from "./ClosureResults"
import { Item } from "./Item"
import { Reservation } from "./Reservation"
import { User } from "./User"
import { Image } from "./Image"
import { Closure } from "./Closure"

type ApiObject = Item | User | Closure | Image | Reservation

type Result<T extends ApiObject | Array<ApiObject>> = {
  data: T
}

type One<T extends ApiObject> = {
  get(): Promise<Result<T>>,
  patch(v: T): Promise<Result<T>>
}

// TODO: check whether we're really returning Promise<T> or Promise<Result<T>>
type GalcApi = {
  one(endpoint: 'item', id: string): One<Item>
  one(endpoint: 'user', id: string): One<User>
  one(endpoint: 'closure', id: string): One<Closure>

  find(endpoint: 'item', id: string, params: Params): Promise<Result<Item>>
  find(endpoint: 'image', id: string): Promise<Result<Image>>

  create(endpoint: 'item', item: Item):  Promise<Result<Item>>
  create(endpoint: 'reservation', args: RsvnArgs): Promise<Result<Reservation>>
  create(endpoint: 'closure', closure: Closure): Promise<Result<Closure>>

  destroy(endpoint: 'image', id: string): Promise<void>
  destroy(endpoint: 'item', id: string): Promise<void>
  destroy(endpoint: 'closure', id: string): Promise<void>

  findAll(endpoint: 'items', params: Params): Promise<ItemResults>
  findAll(endpoint: 'closures', params: Params): Promise<ClosureResults>
  findAll(endpoint: 'facets', params: Params): Promise<FacetResults>
}

export type { GalcApi, ApiObject, Result }

type RsvnArgs = {
  item: { id: string }
}
