import sharp from 'sharp'
import { ImageDimension, ImageDimensions } from './imageSize.vo'

export type ImageBuffer = Buffer

export async function getImageDimensions(image: ImageBuffer): Promise<ImageDimensions> {
  const { width, height } = await sharp(image).metadata()
  if (!width || !height) {
    throw new Error('Invalid dimensions')
  }

  return { width, height }
}

export async function resize(
  image: ImageBuffer,
  targetHeight: ImageDimension,
): Promise<ImageBuffer> {
  return await sharp(image).resize({ height: targetHeight }).toBuffer()
}
