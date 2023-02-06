import * as Ean from '../../reference/domain/ean'
import { BucketPath } from '../../../infra/cloudStorage/buckets'
import * as ImageSize from './imageSize.vo'

export interface EnqueueResizeMessage {
  ean: Ean.Ean
  targetHeight: ImageSize.ImageDimension
  sourcePath: BucketPath
}

export function createEnqueueResizeMessage(message: EnqueueResizeMessage): EnqueueResizeMessage {
  return {
    ...message,
    ean: Ean.toOnlyDigitsFormat(message.ean),
    targetHeight: ImageSize.createSupportedDimension(message.targetHeight),
  }
}
