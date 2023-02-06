import { bufferToBucket } from '../../../common/io'
import { downloadBucketFile } from '../../../infra/cloudStorage/buckets'
import { imagesBucket } from '../../../init/gcloudBuckets'
import { ImageBuffer } from '../domain/image.service'

export async function getImage(path: string): Promise<ImageBuffer> {
  return await downloadBucketFile(imagesBucket, path)
}

export async function putImage(imageBuffer: ImageBuffer, path: string) {
  await bufferToBucket(imageBuffer, imagesBucket, path, false)
}
