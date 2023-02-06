import { logError, logInfo, logWarn } from '../../../infra/firebase/logger'
import * as Ean from '../../reference/domain/ean'
import { getOriginalImageUrl } from '../../reference/domain/reference.entity'
import ReferenceRepository from '../../reference/infra/reference.repository'
import { EnqueuePullMessage } from '../domain/enqueuePullMessage.dto'
import { createEnqueueResizeMessage } from '../domain/enqueueResizeMessage.dto'
import { supportedHeights } from '../domain/imageSize.vo'
import { saveImage } from '../domain/saveImage'
import { fetchImage } from '../infra/gateway'
import { measureImagePullErrorTotal, measureImagePullTotal } from '../infra/monitoring'
import { enqueueResizeBatch } from '../infra/publishers'

export async function pullImageFromMessage(message: EnqueuePullMessage) {
  const { ean } = message
  try {
    await pullImage(ean)
  } catch (error) {
    measureImagePullErrorTotal()
    logError(`Unable to pull image ${ean}`, {
      error,
      payload: message,
    })
    throw error
  }
}

/**
 * Fetches an image off of Amazon from EAN, and store it on GCS and DB as an original.
 * Triggers all transformations required based on this image (resizes).
 *
 * - case image is not found: do nothing
 * - case image is already in DB: do nothing
 *
 * @param client
 * @param ean Identifier of the reference to fetch.
 */
export async function pullImage(ean: Ean.Ean): Promise<void> {
  const reference = await ReferenceRepository.fetchById(ean)
  if (!reference) {
    logWarn(`Reference ${ean} not found in DB`)
    return
  }

  // Get original image
  const originalImageUrl = getOriginalImageUrl(reference)
  if (!originalImageUrl) {
    logWarn(`Reference ${ean} has no image, skipping processing`)
    return
  }

  const imageBuffer = await fetchImage(originalImageUrl)
  if (!imageBuffer) {
    logWarn(`Unable to fetch image for reference ${ean}`, {
      originalImageUrl,
      ean,
    })
    return
  }

  // Save original image
  const imagePath = await saveImage(imageBuffer, ean, originalImageUrl, true)

  // Trigger other sizes
  const messages = supportedHeights.map((supportedDimension) =>
    createEnqueueResizeMessage({
      ean: ean,
      targetHeight: supportedDimension,
      sourcePath: imagePath,
    }),
  )
  await enqueueResizeBatch(messages)
  logInfo(`Image saved for ${ean}, ${supportedHeights.length} resizings enqueued`)
  measureImagePullTotal()
}
