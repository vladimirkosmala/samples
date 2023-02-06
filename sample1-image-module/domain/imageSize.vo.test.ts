import * as sut from './imageSize.vo'

describe('isValid', () => {
  it.each(['10x10', '20x200', '232x23121'])('returns true if the size format is right', (size) => {
    expect(sut.isValid(size)).toBeTruthy()
  })
  it.each(['10', '20y200', '232:23121'])('returns true if the size format is right', (size) => {
    expect(sut.isValid(size)).toBeFalsy()
  })
})

describe('getDimensions', () => {
  it('extracts the dimensions when the format is right', () => {
    expect(sut.getDimensions('70x8232')).toStrictEqual({ height: 70, width: 8232 })
  })
  it.each(['14', '10 10', '10:2'])('throws if the format is not right', (size) => {
    expect(() => sut.getDimensions(size)).toThrow()
  })
})
