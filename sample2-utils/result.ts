// Type

export enum Result {
  ok = 'OK',
  error = 'ERROR',
}

// Helpers

export function isResultOk(result: Result) {
  return result === Result.ok
}

export function isResultError(result: Result) {
  return result === Result.error
}
