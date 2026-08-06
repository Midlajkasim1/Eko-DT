import { create } from 'zustand'

export type LoadPhase = 'pending' | 'reading' | 'parsing' | 'done' | 'error'

export interface ModelLoadProgress {
  modelId: string
  name: string
  sizeBytes: number
  bytesRead: number
  phase: LoadPhase
  readMs?: number
  parseMs?: number
  /** 0-1, reported by the engine while it parses; absent for .glb */
  parseProgress?: number
  error?: string
}

interface LoadingProgressState {
  sessionActive: boolean
  source: 'disk' | 'server' | null
  startedAt: number
  order: string[]
  entries: Record<string, ModelLoadProgress>
  beginSession: (
    models: { modelId: string; name: string; sizeBytes: number }[],
    source: 'disk' | 'server'
  ) => void
  updateEntry: (modelId: string, patch: Partial<ModelLoadProgress>) => void
  endSession: () => void
}

export const useLoadingProgressStore = create<LoadingProgressState>((set) => {
  const pending = new Map<string, Partial<ModelLoadProgress>>()
  let frame = 0

  const applyPending = () => {
    frame = 0
    if (pending.size === 0) return
    set(state => {
      const entries = { ...state.entries }
      for (const [modelId, patch] of pending) {
        const entry = entries[modelId]
        if (entry) entries[modelId] = { ...entry, ...patch }
      }
      pending.clear()
      return { entries }
    })
  }

  const drop = () => {
    if (frame) cancelAnimationFrame(frame)
    frame = 0
    pending.clear()
  }

  return {
    sessionActive: false,
    source: null,
    startedAt: 0,
    order: [],
    entries: {},
    beginSession: (models, source) => {
      drop()
      set({
        sessionActive: models.length > 0,
        source,
        startedAt: performance.now(),
        order: models.map(m => m.modelId),
        entries: Object.fromEntries(
          models.map(m => [
            m.modelId,
            { ...m, bytesRead: 0, phase: 'pending' as LoadPhase },
          ])
        ),
      })
    },
    updateEntry: (modelId, patch) => {
      // Byte counts arrive per chunk. Only the terminal phases decide when the
      // session is over, so those land immediately and never wait for a frame.
      if (patch.phase !== 'done' && patch.phase !== 'error') {
        const queued = pending.get(modelId)
        pending.set(modelId, queued ? { ...queued, ...patch } : patch)
        if (!frame) frame = requestAnimationFrame(applyPending)
        return
      }

      if (frame) cancelAnimationFrame(frame)
      applyPending()
      set(state => {
        const entry = state.entries[modelId]
        if (!entry) return state
        return { entries: { ...state.entries, [modelId]: { ...entry, ...patch } } }
      })
    },
    endSession: () => {
      drop()
      set({ sessionActive: false, order: [], entries: {} })
    },
  }
})

export function sessionProgress(state: Pick<LoadingProgressState, 'order' | 'entries'>): number {
  let weightSum = 0
  let progressSum = 0
  for (const id of state.order) {
    const e = state.entries[id]
    if (!e) continue
    const size = e.sizeBytes || e.bytesRead || 1
    const readFrac = Math.min(1, e.bytesRead / size)
    let frac = 0.5 * readFrac
    if (e.phase === 'parsing') frac = 0.5 + 0.5 * (e.parseProgress ?? 0.5)
    else if (e.phase === 'done' || e.phase === 'error') frac = 1
    weightSum += size
    progressSum += size * frac
  }
  return weightSum ? (progressSum / weightSum) * 100 : 0
}
