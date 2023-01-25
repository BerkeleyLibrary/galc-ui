import { JSONObject, JSONValue } from "./JSON"

type DevourData = {
  data: JSONValue // TODO: is this ever not a JSONObject?
  included?: JSONObject
}

type DevourMessage = { data: DevourData }

type DevourResponsePayload = {
  res: DevourMessage
}

type DevourRequestPayload = {
  req: DevourMessage
}

export type { DevourRequestPayload, DevourResponsePayload }
