import { ascSorter, pMap } from './array'

describe('pMap', () => {
  it('should iterate array with a promise mapper', async () => {
    const items = [1, 2, 3]
    const mapper = (item: number) => item + 1
    const result = await pMap(items, mapper)
    expect(result).toEqual([2, 3, 4])
  })
})

describe(ascSorter, () => {
  it('sorts from low to high', () => {
    const array = [1, 3, 2]
    array.sort(ascSorter)
    expect(array).toMatchObject([1, 2, 3])
  })
})
