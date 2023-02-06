import { readFileSync } from 'fs'
import { join } from 'path'
import { createEnqueueResizeMessage } from '../domain/enqueueResizeMessage.dto'
import { insertImage } from '../infra/referenceImages.repository'
import { getImage, putImage } from '../infra/storage'
import { resizeImageFromMessage } from './resizeImage'

// Mock infra
jest.mock('../../../infra/cloudStorage/buckets')
jest.mock('../infra/storage')
jest.mock('../infra/referenceImages.repository')

// Spies
const insertImageMocked = jest.mocked(insertImage)
const getImageMocked = jest.mocked(getImage)
const putImageMocked = jest.mocked(putImage)

// Fixtures
const image = readFileSync(join(__dirname, '../../../../test/resources/fixtures/image.png'))

describe(resizeImageFromMessage, () => {
  it('resizes the image and save on bucket and DB', async () => {
    getImageMocked.mockResolvedValue(image)
    const message = createEnqueueResizeMessage({
      ean: '9780802134806',
      targetHeight: 75,
      sourcePath: '/amazon/123',
    })

    await resizeImageFromMessage(message)

    expect(insertImageMocked).toMatchSnapshot()
    expect(putImageMocked).toMatchSnapshot()
  })
})
