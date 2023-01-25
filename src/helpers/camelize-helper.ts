import camelcaseKeys from "camelcase-keys"
import decamelize from "decamelize"
import mapObject from "map-obj"
import { DevourRequestPayload, DevourResponsePayload } from "../types/Devour"
import { JSONObject, JSONRecord, JSONValue } from "../types/JSON"

function camelizePayload(payload: DevourResponsePayload) {
  const data = payload.res.data
  if (typeof data === 'object') {
    data.data = camelcaseKeys(<JSONObject>data.data, { deep: true })
    if (data.included) {
      data.included = camelcaseKeys(data.included, { deep: true })
    }
  }
  return payload
}
function decamelizePayload(payload: DevourRequestPayload) {
  const message = payload.req.data
  if (message) {
    message.data = decamelizeKeys(message.data)
  }
  return payload
}

export { camelizePayload, decamelizePayload }

function decamelizeKeys(data: JSONValue): JSONValue {
  if (Array.isArray(data)) {
    return data.map(d => decamelizeKeys(d))
  }
  if (!isObject(data)) {
    return data
  }
  return mapObject(<JSONRecord>data, (k, v) => {
    const key = decamelize(<string>k)
    const value = decamelizeKeys(v)
    return [key, value]
  })
}

function isObject(value: JSONValue | RegExp | Error | Date): boolean {
  return typeof value === 'object' &&
    value !== null &&
    !(value instanceof RegExp) &&
    !(value instanceof Error) &&
    !(value instanceof Date)
}
