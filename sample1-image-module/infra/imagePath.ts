import { Storage } from '@google-cloud/storage'
import { Ean } from '../../reference/domain/ean'
import { BucketPath } from '../../../infra/cloudStorage/buckets'
import { imagesBucket } from '../../../init/gcloudBuckets'
import { ImageDimension } from '../domain/imageSize.vo'

/** For images, BucketPath act as an ID, just like an EAN is an ID for a reference. */

export function createImagePath(
  provider: string,
  ean: Ean,
  height: ImageDimension,
  extension: string,
): BucketPath {
  return `resources/${provider}/${ean}/${ean}-${height}.${extension}`
}

export function getPublicUrlFromPath(path: string): string {
  return new Storage().bucket(imagesBucket).file(path).publicUrl()
}
