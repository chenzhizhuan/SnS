import type { KunRuntimeStatusPayload } from '@shared/sns-gui-api'

export function shouldSuppressRuntimeErrorBanner(
  status: KunRuntimeStatusPayload | null | undefined
): boolean {
  return status?.state === 'restarting' || status?.state === 'crashed'
}
