/**
 * This file contains utilitaries with no business logic inside like lodash.
 */

/**
 * Recreates error for logging to be stringified
 */
export function serializableError(err: any) {
  // Extract special fields from Error object
  const specialErrorFields = {
    message: err.message,
    stack: err.stack,
  }

  return { ...specialErrorFields, ...err }
}
