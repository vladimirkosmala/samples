import { serializableError } from './utils'

describe(serializableError, () => {
  it('should give message of an Error', () => {
    const error = new Error('BOOM')
    const result = serializableError(error)
    expect(result).toMatchObject({ message: 'BOOM' })
  })

  it('should give other attributes of an Error', () => {
    const error = { status: 404 }
    const result = serializableError(error)
    expect(result).toMatchObject({ status: 404 })
  })
})
