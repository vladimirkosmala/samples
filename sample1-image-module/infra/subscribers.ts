import { runWith } from 'firebase-functions/v1'
import { Message } from 'firebase-functions/v1/pubsub'
import { execWrap } from '../../../infra/pubsub/execWrap'
import { defaultOpts } from '../../../init/databaseEnvironment'
import { pullImageFromMessage } from '../controllers/pullImage'
import { resizeImageFromMessage } from '../controllers/resizeImage'
import { createEnqueuePullMessage } from '../domain/enqueuePullMessage.dto'
import { createEnqueueResizeMessage } from '../domain/enqueueResizeMessage.dto'
import { supportedHeights } from '../domain/imageSize.vo'

async function fetchImage(message: Message) {
  await pullImageFromMessage(createEnqueuePullMessage(message.json))
}

async function resizeImage(message: Message) {
  await resizeImageFromMessage(createEnqueueResizeMessage(message.json))
}

const nPullerWorkers = 5

exports.fetchImage = runWith({
  ...defaultOpts.light,
  maxInstances: nPullerWorkers,
  failurePolicy: false,
})
  .region('europe-west1')
  .pubsub.topic('fetch-image-queue')
  .onPublish(execWrap('fetchImage', fetchImage))

exports.resizeImage = runWith({
  ...defaultOpts.light,
  maxInstances: supportedHeights.length * nPullerWorkers,
  failurePolicy: false,
})
  .region('europe-west1')
  .pubsub.topic('resize-image-queue')
  .onPublish(execWrap('resizeImage', resizeImage))
