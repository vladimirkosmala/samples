import * as sut from './dates'

describe('createHrTimer', () => {
  it.skip('measures real time of execution', async () => {
    jest.useRealTimers()
    const timer = sut.createHrTimer()
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(timer() >= 10).toBe(true) // test takes 12ms
    expect(timer() > 100).toBe(false)
  })
})

describe('toUTCDate', () => {
  it('converts a time to its date in yyyy-mm-dd format', () => {
    const testCase = new Date('2022-01-01T00:00:00.000Z')
    expect(sut.formatUTCDate(testCase)).toBe('2022-01-01')
  })
})
