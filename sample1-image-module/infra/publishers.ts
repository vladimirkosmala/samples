import { PubSub } from '@google-cloud/pubsub'
import { EnqueuePullMessage } from '../domain/enqueuePullMessage.dto'
import { EnqueueResizeMessage } from '../domain/enqueueResizeMessage.dto'

const topicNames = {
  fetchImage: 'fetch-image-queue',
  resizeImage: 'resize-image-queue',
}

type SupportedTopics = keyof typeof topicNames
type SupportedMessages = EnqueuePullMessage | EnqueueResizeMessage

export async function enqueueFetch(message: EnqueuePullMessage) {
  await publishMessage('fetchImage', message)
}

export async function enqueueFetchBatch(messages: EnqueuePullMessage[]) {
  await /* Publishing a message to the fetchImage topic. */
  publishMessages('fetchImage', messages)
}

export async function enqueueResize(message: EnqueueResizeMessage) {
  await publishMessage('resizeImage', message)
}

export async function enqueueResizeBatch(messages: EnqueueResizeMessage[]) {
  await publishMessages('resizeImage', messages)
}

const pubsub = new PubSub()

function getTopic(name: SupportedTopics, shouldBatch?: boolean) {
  const config = shouldBatch ? { maxMessages: 10_000, maxMilliseconds: 100 } : {}
  return pubsub.topic(topicNames[name], { batching: config })
}

async function publishMessage(topicName: SupportedTopics, message: SupportedMessages) {
  const topic = getTopic(topicName)
  await topic.publishMessage({ json: message })
}

async function publishMessages(topicName: SupportedTopics, messages: SupportedMessages[]) {
  const topic = getTopic(topicName, true)
  await Promise.all(messages.map(async (m) => await topic.publishMessage({ json: m })))
}
