import * as Ean from '../../reference/domain/ean'
import { EnqueueResizeMessage } from '../domain/enqueueResizeMessage.dto'
import { ImageDimension } from '../domain/imageSize.vo'
import { BucketPath } from '../../../infra/cloudStorage/buckets'
import { getImage } from '../infra/storage'
import { getPublicUrlFromPath } from '../infra/imagePath'
import { saveImage } from '../domain/saveImage'
import { resize } from '../domain/image.service'
import { logError, logInfo } from '../../../infra/firebase/logger'
import { measureImageResizeErrorTotal, measureImageResizeTotal } from '../infra/monitoring'

export async function resizeImageFromMessage(message: EnqueueResizeMessage) {
  const { ean, targetHeight, sourcePath } = message
  try {
    await resizeImage(ean, targetHeight, sourcePath)
    measureImageResizeTotal()
  } catch (error) {
    measureImageResizeErrorTotal()
    logError(`Unable to resize image ${ean} with size ${targetHeight}`, {
      error,
      payload: message,
    })
    throw error
  }
}

/**
 * Fetch original image from bucket, resize it and save it in bucket and DB.
 * @param client
 * @param ean
 * @param targetHeight
 * @param source Original image, bucket path
 */
export async function resizeImage(ean: Ean.Ean, targetHeight: ImageDimension, source: BucketPath) {
  const imageBuffer = await getImage(source)
  const imageResized = await resize(imageBuffer, targetHeight)
  const originalUrl = getPublicUrlFromPath(source)
  const imagePath = await saveImage(imageResized, ean, originalUrl, false)
  logInfo(`Successful resized image`, {
    imagePath,
    url: getPublicUrlFromPath(imagePath),
  })
}
