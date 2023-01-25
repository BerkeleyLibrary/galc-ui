type Reason = unknown

// TODO: display errors
export function handleError<T = void>(msg: string): (error: Reason) => Promise<T> {
  // TODO: transition to error state
  return (error: Reason) => {
    console.log(`${msg}: %o`, error)
    return Promise.resolve(<T>{})
  }
}
