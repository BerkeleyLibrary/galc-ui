import {
  FetchServerConfigFunction,
  LoadServerConfigFunction,
  ProcessServerConfigFunction, RemoveServerConfigFunction,
  RestoreServerConfigFunction,
  RevertServerConfigFunction,
  ServerUrl
} from "filepond"

type ImageApi = {
  url?: string
  timeout?: number
  headers?: { [key: string]: string | boolean | number }
  process?: string | ServerUrl | ProcessServerConfigFunction | null
  revert?: string | ServerUrl | RevertServerConfigFunction | null
  restore?: string | ServerUrl | RestoreServerConfigFunction | null
  load?: string | ServerUrl | LoadServerConfigFunction | null
  fetch?: string | ServerUrl | FetchServerConfigFunction | null
  remove?: RemoveServerConfigFunction | null
  withCredentials?: boolean
}

export type { ImageApi }
