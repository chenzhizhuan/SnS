import { describe, expect, it } from 'vitest'
import type { RuntimeEvent } from '../src/contracts/events.js'
import type { EventBus } from '../src/ports/event-bus.js'
import type { SessionStore } from '../src/ports/session-store.js'
import { buildEventStreamResponse, parseEventCursor } from '../src/server/routes/events.js'

describe('event stream replay', () => {
  it('accepts only non-negative safe integer cursors', () => {
    expect(parseEventCursor(new Request('http://localhost/events?since_seq=0', { headers: { 'Last-Event-ID': '9' } }))).toBe(0)
    expect(parseEventCursor(new Request('http://localhost/events?since_seq=-1'))).toBeNull()
    expect(parseEventCursor(new Request('http://localhost/events?since_seq=Infinity'))).toBeNull()
    expect(parseEventCursor(new Request('http://localhost/events?since_seq=9007199254740992'))).toBeNull()
  })

  it('delivers an event published between subscription and persisted replay', async () => {
    let subscriber: ((event: RuntimeEvent) => void) | undefined
    const live: RuntimeEvent = {
      kind: 'heartbeat', seq: 2, timestamp: '2026-07-10T00:00:02.000Z', threadId: 'thr_events'
    }
    const eventBus: EventBus = {
      publish: () => undefined,
      subscribe: (_threadId, handler) => {
        subscriber = handler
        return () => {
          subscriber = undefined
        }
      },
      snapshotSince: () => [],
      highestSeq: () => 0,
      reset: () => undefined
    }
    const sessionStore = {
      highestSeq: async () => 1,
      loadEventsSince: async () => {
        subscriber?.(live)
        return [{ kind: 'heartbeat', seq: 1, timestamp: '2026-07-10T00:00:01.000Z', threadId: 'thr_events' }]
      }
    } as unknown as SessionStore
    const response = buildEventStreamResponse({
      request: new Request('http://localhost/v1/threads/thr_events/events?since_seq=0'),
      threadId: 'thr_events',
      eventBus,
      sessionStore
    })
    const reader = response.body!.getReader()
    try {
      const decoder = new TextDecoder()
      const first = await reader.read()
      const second = await reader.read()
      expect(`${decoder.decode(first.value)}${decoder.decode(second.value)}`).toContain('id: 1')
      expect(`${decoder.decode(first.value)}${decoder.decode(second.value)}`).toContain('id: 2')
    } finally {
      await reader.cancel()
    }
  })
})
