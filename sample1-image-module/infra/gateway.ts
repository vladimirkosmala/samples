import axios, { AxiosError } from 'axios'
import { logWarn } from '../../../infra/firebase/logger'
import { measureHttpErrorsTotal } from './monitoring'

export async function fetchImage(sourceUrl: string): Promise<Buffer | undefined> {
  try {
    const response = await axios.get(sourceUrl, { responseType: 'arraybuffer' })
    return response.data
  } catch (error: any | AxiosError) {
    // C.f.: https://github.com/axios/axios#handling-errors
    //       https://github.com/axios/axios/issues/3612#issuecomment-770224236
    if (!axios.isAxiosError(error)) throw error

    if (error.response) {
      measureHttpErrorsTotal({ status_code: error.response.status.toString() })
      switch (error.response.status) {
        case 404:
          logWarn('The image was not found on Amazon', { sourceUrl })
          return
        default:
          // Server error (4xx, 5xx)
          throw new Error(
            `Unable to fetch image: ${String(error.response.status)}, ${String(error.message)}`,
          )
      }
    }

    if (error.request) {
      // Somehow, 503 are not always handle like other statuses.
      if (error.message === 'GaxiosError: Service Unavailable')
        measureHttpErrorsTotal({ status_code: '503' })
    }

    throw error
  }
}
