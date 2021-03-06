/**
 * Wraps a function in a debounce microtask.
 *
 * @param inner The function to wrap in the debounce
 * @returns A debounced function
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = (inner: (...args: any[]) => any) => {
  let queued = false
  let params: any[] = []
  let resolve: () => void
  let reject: (error: unknown) => void
  function outer(this: any) {
    try {
      inner.apply(this, params)
      resolve()
    } catch (error) {
      reject(error)
    } finally {
      queued = false
    }
  }
  return async function (...args: any[]) {
    params = args
    if (queued) return
    queued = true
    await new Promise<void>((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject
      queueMicrotask(outer)
    })
  }
}

export default debounce
