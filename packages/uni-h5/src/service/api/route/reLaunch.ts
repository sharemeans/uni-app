import {
  API_RE_LAUNCH,
  defineAsyncApi,
  ReLaunchOptions,
  ReLaunchProtocol,
} from '@dcloudio/uni-api'
import { navigate } from './utils'

export const reLaunch = defineAsyncApi<typeof uni.reLaunch>(
  API_RE_LAUNCH,
  (options, callback?: Function) =>
    navigate(API_RE_LAUNCH, options.url, callback!),
  ReLaunchProtocol,
  ReLaunchOptions
)
