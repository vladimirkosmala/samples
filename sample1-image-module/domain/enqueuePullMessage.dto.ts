import * as Ean from '../../reference/domain/ean'

export interface EnqueuePullMessage {
  ean: Ean.Ean
}

export function createEnqueuePullMessage(message: EnqueuePullMessage): EnqueuePullMessage {
  if (!Ean.isValid(message.ean)) {
    throw new Error(`Invalid EAN ${message.ean}`)
  }

  return { ...message, ean: Ean.toOnlyDigitsFormat(message.ean) }
}
