import { JSONValue } from "./JSON"

type DevourData = {
  data: JSONValue
}

type DevourMessage = { data: DevourData }

type DevourResponsePayload = {
  res: DevourMessage
}

type DevourRequestPayload = {
  req: DevourMessage
}

export type { DevourRequestPayload, DevourResponsePayload }
