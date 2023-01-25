/* eslint-disable @typescript-eslint/no-empty-interface */

type JSONPrimitive = string | number | boolean | null
interface JSONArray extends Array<JSONValue> {}
interface JSONRecord extends Record<string, JSONValue> {}
type JSONObject = JSONArray | JSONRecord

type JSONValue = JSONPrimitive | JSONObject

export type { JSONValue, JSONObject, JSONRecord }
