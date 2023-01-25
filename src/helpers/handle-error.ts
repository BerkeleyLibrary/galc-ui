type Reason = unknown

// TODO: display errors / transition to error state
export function handleError(msg: string): (error: Reason) => void {
  return (error: Reason) => console.log(`${msg}: %o`, error)
}
