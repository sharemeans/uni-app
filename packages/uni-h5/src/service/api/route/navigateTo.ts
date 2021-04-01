import {
  API_NAVIGATE_TO,
  defineAsyncApi,
  NavigateToOptions,
  NavigateToProtocol,
} from '@dcloudio/uni-api'
import { navigate } from './utils'

export const navigateTo = defineAsyncApi<typeof uni.navigateTo>(
  API_NAVIGATE_TO,
  (options, callback?: Function) =>
    navigate(API_NAVIGATE_TO, options.url, callback!),
  NavigateToProtocol,
  NavigateToOptions
)
