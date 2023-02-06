import { ErrorWithContext } from '../../../common/errorWithContext'

export type ImageSize = string // 'HxW', the image size that is stored

export type ImageDimension = number // height of width
export interface ImageDimensions {
  height: ImageDimension
  width: ImageDimension
}

export type SupportedHeight = 75 | 150 | 300 | 500 | 800 // heights supported for listings
export const supportedHeights: SupportedHeight[] = [75, 150, 300, 500, 800]

export function isValid(size: string): boolean {
  return size.match(sizeRegex) !== null
}

export function createSupportedDimension(size: number): SupportedHeight {
  if (!supportedHeights.includes(size as SupportedHeight)) {
    throw new Error(`Invalid image size ${size}`)
  }

  return size as SupportedHeight
}

export function createImageSize(size: string): ImageSize {
  if (!isValid(size)) {
    throw new Error(`Invalid image size ${size}`)
  }

  return size
}

export function getDimensions(size: ImageSize): ImageDimensions {
  const match = size.match(sizeRegex)
  if (!match) {
    throw new ErrorWithContext('Cannot extract dimensions for image size: invalid size format', {
      size,
    })
  }
  const [, height, width] = match
  return { height: parseInt(height), width: parseInt(width) }
}

const sizeRegex = /(\d+)x(\d+)/
