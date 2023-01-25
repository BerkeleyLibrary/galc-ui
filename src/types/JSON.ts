/* eslint-disable @typescript-eslint/no-empty-interface */

type JSONValue = JSONPrimitive | JSONObject
type JSONPrimitive = string | number | boolean | null
type JSONObject = JSONArray | JSONRecord
interface JSONArray extends Array<JSONValue> {}
interface JSONRecord extends Record<string, JSONValue> {}

export type { JSONValue, JSONObject, JSONRecord }
