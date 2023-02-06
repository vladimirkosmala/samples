import * as ImageSize from './imageSize.vo'
import * as Ean from '../../reference/domain/ean'

/**
 * Record we write to the database (except for created_at, and updated_at timestamps).
 * Primary key: reference_id, size, provider.
 */

export interface ReferenceImageRecord {
  reference_id: Ean.Ean // ean13,
  size: ImageSize.ImageSize // E.g.: '500x600'
  provider: string // E.g.: 'AMAZON'
  source_url: string // E.g.: 'https://m.media-amazon.com/images/I/41Y39V7xQqL._SL75_.jpg'
  public_url: string // E.g.: 'https://storage.googleapis.com/xxxx/0000028005940/0000028005940-500.jpg',
  is_original: boolean // Indicates whether the picture is original (vs resized).
}

export function createReferenceImageRecord(data: ReferenceImageRecord): ReferenceImageRecord {
  if (!data.source_url.includes('http')) {
    throw new Error(`Invalid source URL: ${data.source_url}`)
  }
  if (!data.public_url.includes('http')) {
    throw new Error(`Invalid public URL: ${data.public_url}`)
  }

  return {
    ...data,
    size: ImageSize.createImageSize(data.size),
    reference_id: Ean.createEan(data.reference_id),
  }
}
