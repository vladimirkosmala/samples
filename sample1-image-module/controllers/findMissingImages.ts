import { enqueueFetchBatch } from '../infra/publishers'
import { fetchReferencesWithoutImages } from '../infra/referenceImages.repository'
import { createEnqueuePullMessage } from '../domain/enqueuePullMessage.dto'

export async function pullMissingImages() {
  const referencesLimit = 450 // average number of new references per day

  const toEnqueue = await fetchReferencesWithoutImages(referencesLimit)
  const messages = toEnqueue.map((id) => ({ ean: id })).map(createEnqueuePullMessage)
  await enqueueFetchBatch(messages)
}
