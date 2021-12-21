import { debounce } from '../'

// https://github.com/facebook/jest/issues/5620
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any
beforeAll(() => process.actual().removeAllListeners('uncaughtException'))

describe('debounce', () => {
  it('simple', done => {
    let x = 0
    const fn = debounce(() => x++)
    fn()
    fn()
    expect(x).toEqual(0)
    // ensure we are ahead of all pending microtasks
    setTimeout(() => {
      expect(x).toEqual(1)
      done()
    }, 10)
  })

  it('with args', done => {
    let x = 0
    const fn = debounce((y: number) => (x += y))
    fn(1)
    fn(2)
    expect(x).toEqual(0)
    queueMicrotask(() => {
      expect(x).toEqual(2)
      done()
    })
  })

  it('when exception is thrown it resumes correctly', async () => {
    let x = 0

    const fn = debounce((y: number) => {
      if (!y) {
        throw new Error('some error')
      } else {
        x += y
      }
    })

    fn(1)
    fn()

    const error: Error = await new Promise(resolve =>
      process.actual().once('uncaughtException', resolve)
    )

    expect(error.message).toContain('some error')
    expect(x).toEqual(0)

    fn(2)
    fn(4)
    expect(x).toEqual(0)

    await new Promise<void>(resolve => queueMicrotask(resolve))

    expect(x).toEqual(4)
  })
})
