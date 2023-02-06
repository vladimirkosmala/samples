/**
 * Function which is called for every item in `items`. Expected to return a `Promise` or value.
 * @param element - Iterated element.
 * @param index - Index of the element in the source array.
 */

export type Mapper<Element = any, NewElement = unknown> = (
  element: Element,
  index: number,
) => NewElement | Promise<NewElement>

/**
 * Map sequentially by waiting each promise one by one
 * @param items - Iterable that is iterated calling the `mapper` function for each element.
 * @param mapper - Function which is called for every item in `items`. Expected to return a `Promise` or value.
 * @returns A `Promise` that is fulfilled when all promises in `items` and ones returned from `mapper` are fulfilled, or rejects if any of the promises reject. The fulfilled value is an `Array` of the fulfilled values returned from `mapper` in `items` order.
 */
export async function pMap<Element, NewElement>(
  items: Element[],
  mapper: Mapper<Element, NewElement>,
): Promise<NewElement[]> {
  const results: NewElement[] = []
  for (const [i, item] of items.entries()) {
    const result = await mapper(item, i)
    results.push(result)
  }
  return results
}

/** Sort from lower to higher */
export function ascSorter(a: number, b: number): number {
  return a - b
}
