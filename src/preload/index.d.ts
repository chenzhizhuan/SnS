import type { KunGuiApi } from '../shared/sns-gui-api'

export type * from '../shared/sns-gui-api'

declare global {
  interface Window {
    kunGui: KunGuiApi
  }
}
