import { insertImage } from '../infra/referenceImages.repository'
import { createReferenceImageRecord } from './referenceImageRecord.entity'
import { putImage } from '../infra/storage'
import { createImagePath, getPublicUrlFromPath } from '../infra/imagePath'
import { getImageDimensions } from './image.service'
import { BucketPath } from '../../../infra/cloudStorage/buckets'

/**
 * Save image buffer related to an EAN in bucket and DB.
 * It's related to Amazon as we only fetch Amazon images.
 * @param client
 * @param imageBuffer
 * @param ean
 * @param originalImageUrl
 * @returns
 */
export async function saveImage(
  imageBuffer: Buffer,
  ean: string,
  originalImageUrl: string,
  isOriginal: boolean,
): Promise<BucketPath> {
  const { width, height } = await getImageDimensions(imageBuffer)
  const imagePath = createImagePath('amazon', ean, height, 'jpg') // always jpg for Amazon
  const publicUrl = getPublicUrlFromPath(imagePath)

  const record = createReferenceImageRecord({
    reference_id: ean,
    size: `${height}x${width}`,
    provider: 'AMAZON',
    source_url: originalImageUrl,
    public_url: publicUrl,
    is_original: isOriginal,
  })
  await putImage(imageBuffer, imagePath)
  await insertImage(record)
  return imagePath
}
