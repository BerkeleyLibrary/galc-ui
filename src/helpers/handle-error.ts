type Reason = unknown

// TODO: display errors
export function handleError(msg: string): (error: Reason) => void {
  // TODO: transition to error state
  return (error: Reason) => {
    console.log(`${msg}: %o`, error)
  }
}
