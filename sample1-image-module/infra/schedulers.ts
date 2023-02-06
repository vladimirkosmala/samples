import { createCron } from '../../../infra/pubsub/functions'
import { pullMissingImages } from '../controllers/findMissingImages'

// Find missing images and add them to a queue. Every 5 minutes. Takes 2 minutes to consume 450.
// Missing images are new references recently added.
exports.pullMissingImages = createCron('pullMissingImages', '*/5 * * * *', pullMissingImages)
