import { incrementer, registerSumMeasure } from '../../../infra/monitoring/monitoring'

const imageHttpErrorsTotal = registerSumMeasure(
  'fetch_image/http_errors_total',
  'Number of HTTP errors that were yield by reaching out to Amazon.',
)

const imagePullTotal = registerSumMeasure(
  'pull_image/image_pull_total',
  'Number of images we pull.',
)
const imagePullErrorTotal = registerSumMeasure(
  'pull_image/image_pull_error_total',
  'Number of images we failed to pull.',
)

const imageResizeTotal = registerSumMeasure(
  'resize_image/image_resize_total',
  'Number of images we resize.',
)
const imageResizeErrorTotal = registerSumMeasure(
  'resize_images/image_resize_error_total',
  'Number of images we failed to resize.',
)

export const measureHttpErrorsTotal = incrementer(imageHttpErrorsTotal)
export const measureImagePullTotal = incrementer(imagePullTotal)
export const measureImagePullErrorTotal = incrementer(imagePullErrorTotal)
export const measureImageResizeTotal = incrementer(imageResizeTotal)
export const measureImageResizeErrorTotal = incrementer(imageResizeErrorTotal)
