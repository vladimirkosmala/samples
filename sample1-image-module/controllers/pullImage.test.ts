import { readFileSync } from 'fs'
import { join } from 'path'
import { makeReference } from '../../../builders/reference.builder'
import ReferenceRepository from '../../reference/infra/reference.repository'
import { createEnqueuePullMessage } from '../domain/enqueuePullMessage.dto'
import { fetchImage } from '../infra/gateway'
import { enqueueResizeBatch } from '../infra/publishers'
import { insertImage } from '../infra/referenceImages.repository'
import { putImage } from '../infra/storage'
import { pullImageFromMessage } from './pullImage'

// Mock infra
jest.mock('../infra/monitoring')
jest.mock('../infra/gateway')
jest.mock('../../../modules/reference/infra/reference.repository.ts')
jest.mock('../infra/publishers')
jest.mock('../infra/storage')
jest.mock('../infra/referenceImages.repository')

// Spies
const enqueueResizeMocked = jest.mocked(enqueueResizeBatch)
const insertImageMocked = jest.mocked(insertImage)
const putImageMocked = jest.mocked(putImage)
const fetchByIsbnMocked = jest.mocked(ReferenceRepository.fetchById)
const fetchImageMocked = jest.mocked(fetchImage)

// Fixtures
const image = readFileSync(join(__dirname, '../../../../test/resources/fixtures/image.png'))

beforeEach(() => {
  jest.resetAllMocks()
})

describe(pullImageFromMessage, () => {
  it('should fetch and save image', async () => {
    fetchImageMocked.mockResolvedValue(image)
    fetchByIsbnMocked.mockResolvedValue(
      makeReference({
        image_url: 'http://ecx.images-amazon.com/images/I/416hroIXUJL._SL75_.jpg',
      }),
    )
    const message = createEnqueuePullMessage({
      ean: '9780802134806',
    })

    await pullImageFromMessage(message)

    expect(enqueueResizeMocked).toBeCalledTimes(1)
    expect(enqueueResizeMocked).toMatchSnapshot()
    expect(insertImageMocked).toMatchSnapshot()
    expect(putImageMocked).toMatchSnapshot()
  })

  it('should do nothing when image is a placeholder', async () => {
    fetchByIsbnMocked.mockResolvedValue(
      makeReference({
        image_url: 'http://ecx.images-amazon.com/images/I/416hroIXUJL._SL75_.gif', // gif = placeholder
      }),
    )
    const message = createEnqueuePullMessage({
      ean: '9780802134806',
    })

    await pullImageFromMessage(message)

    expect(enqueueResizeMocked).toBeCalledTimes(0)
    expect(insertImageMocked).toBeCalledTimes(0)
    expect(putImageMocked).toBeCalledTimes(0)
  })
})
