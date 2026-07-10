import type { ModelClient } from '../ports/model-client.js'

export type ModelClientDiagnostics = {
  provider?: string
  providerBaseUrl?: string
  endpointFormat?: string
  configuredModel?: string
}

export function modelClientDiagnostics(
  model: ModelClient,
  providerId?: string
): ModelClientDiagnostics {
  const client = model as ModelClient & {
    config?: {
      baseUrl?: string
      endpointFormat?: string
      model?: string
    }
    configFor?: (providerId?: string) => {
      baseUrl?: string
      endpointFormat?: string
      model?: string
    } | undefined
  }
  const config = client.configFor?.(providerId) ?? client.config
  return {
    provider: client.provider,
    ...(config?.baseUrl ? { providerBaseUrl: sanitizeProviderBaseUrl(config.baseUrl) } : {}),
    ...(config?.endpointFormat ? { endpointFormat: config.endpointFormat } : {}),
    ...(config?.model ? { configuredModel: config.model } : {})
  }
}

export function sanitizeProviderBaseUrl(baseUrl: string): string {
  try {
    const url = new URL(baseUrl)
    url.username = ''
    url.password = ''
    url.search = ''
    url.hash = ''
    return url.toString().replace(/\/$/, '')
  } catch {
    return baseUrl
      .replace(/(^|\/\/)[^/?#@\s]*@/, '$1')
      .replace(/[?#].*$/, '')
      .replace(/\/+$/, '')
  }
}
