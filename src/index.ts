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
  function outer(this: any) {
    try {
      inner.apply(this, params)
    } finally {
      queued = false
    }
  }
  return function (...args: any[]) {
    params = args
    if (queued) return
    queued = true
    queueMicrotask(outer)
  }
}

export default debounce
