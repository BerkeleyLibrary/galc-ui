import camelcaseKeys from "camelcase-keys"
import decamelize from "decamelize"
import mapObject from "map-obj"
import { DevourRequestPayload, DevourResponsePayload } from "../types/Devour"
import { JSONObject, JSONRecord, JSONValue } from "../types/JSON"

function camelizePayload(payload: DevourResponsePayload) {
  console.log('camelizing: %o', payload)
  const axiosResponse = payload.res.data
  if (typeof axiosResponse === 'object') {
    const dataInner = axiosResponse.data
    axiosResponse.data = camelcaseKeys(<JSONObject>dataInner, { deep: true })
    console.log('camelized: %o', payload)
  }
  return payload
}

function decamelizePayload(payload: DevourRequestPayload) {
  console.log('decamelizing: %o', payload)
  const axiosRequest = payload.req.data
  if (axiosRequest) {
    axiosRequest.data = decamelizeKeys(axiosRequest.data)
    console.log('decamelized: %o', payload)
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
