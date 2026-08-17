import { roundLngLat } from '@/lib/geo'
import { BUILTIN_RENDERS } from '@/data/regions'
import type { LngLat, MapConfig, MapLocation, MapOverlay, ProjectMeta } from '@/types'

export const DEFAULT_MAP_CAMERA = { center: [55.161, 25.131] as LngLat, zoom: 12, bearing: 0, pitch: 0 }

export const emptyMapConfig = (): MapConfig => {
  const mainPinId = newId('loc')
  const subPinId = newId('loc')

  return {
    version: 1,
    camera: { ...DEFAULT_MAP_CAMERA },
    basemap: { kind: 'void' },
    locations: [
      {
        id: mainPinId,
        name: 'Coastal Resort',
        description: 'Main exterior view of the coastal property.',
        position: [55.186, 25.145],
        view: { center: [55.18707, 25.14528], zoom: 15.5, bearing: 0, pitch: 0 },
      },
      {
        id: subPinId,
        parentId: mainPinId,
        name: 'Resort Interior',
        description: 'Detailed view of the resort facilities.',
        position: [55.188, 25.145],
        view: { center: [55.18844, 25.14528], zoom: 16.8, bearing: 0, pitch: 0 },
      }
    ],
    overlays: [
      {
        id: newId('ovl'),
        hash: 'builtin/dubai/marsa-al-arab/l2',
        parentId: mainPinId,
        coordinates: [
          [55.18157959, 25.1502571],
          [55.19256592, 25.1502571],
          [55.19256592, 25.14031191],
          [55.18157959, 25.14031191],
        ],
      },
      {
        id: newId('ovl'),
        hash: 'builtin/dubai/marsa-al-arab/l3',
        parentId: subPinId,
        coordinates: [
          [55.18569946, 25.14777088],
          [55.19119263, 25.14777088],
          [55.19119263, 25.14279829],
          [55.18569946, 25.14279829],
        ],
      }
    ],
  }
}

/** Composites the bundled pyramid beneath the project's own renders. Applied on the way into
 *  the engine, never into the draft, so built-ins are not written back to project.json. */
export const withBuiltinRenders = (config: MapConfig): MapConfig =>
  config.builtinRenders === false
    ? config
    : { ...config, overlays: [...BUILTIN_RENDERS, ...(config.overlays ?? [])] }

/** The single predicate behind routing and the project-list badge, so they cannot disagree */
export const hasMap = (meta: ProjectMeta | null | undefined): boolean =>
  !!meta?.mapConfig && (meta.mapConfig.locations?.length ?? 0) > 0

export const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`

export const childrenOf = (locations: MapLocation[] | undefined, parentId: string | null) =>
  (locations ?? []).filter(l => (l.parentId ?? null) === parentId)

export const findLocation = (locations: MapLocation[] | undefined, id: string | null) =>
  id ? (locations ?? []).find(l => l.id === id) ?? null : null

export const isPin = (l: MapLocation) => (l.kind ?? 'pin') === 'pin'

export const hasChildren = (locations: MapLocation[] | undefined, id: string) =>
  (locations ?? []).some(l => l.parentId === id)

/** A node opens the 3D viewer only when it carries models and no deeper level */
export const opensViewer = (locations: MapLocation[] | undefined, l: MapLocation) =>
  isPin(l) && !!l.modelIds?.length && !hasChildren(locations, l.id)

/** Root-first chain of ids from the top level down to `id` */
export function pathTo(locations: MapLocation[] | undefined, id: string | null): string[] {
  const chain: string[] = []
  const seen = new Set<string>()
  let current = findLocation(locations, id)
  while (current && !seen.has(current.id)) {
    seen.add(current.id)
    chain.unshift(current.id)
    current = findLocation(locations, current.parentId ?? null)
  }
  return chain
}

/** Every descendant of `id`, plus `id` itself */
export function subtreeIds(locations: MapLocation[] | undefined, id: string): Set<string> {
  const out = new Set([id])
  let grew = true
  while (grew) {
    grew = false
    for (const l of locations ?? []) {
      if (l.parentId && out.has(l.parentId) && !out.has(l.id)) {
        out.add(l.id)
        grew = true
      }
    }
  }
  return out
}

/** Refuse a reparent that would put a node inside its own subtree */
export const wouldCycle = (locations: MapLocation[] | undefined, id: string, nextParentId?: string) =>
  !!nextParentId && subtreeIds(locations, id).has(nextParentId)

/** A level shows its own renders and every ancestor's, shallowest first, so region → site →
 *  building composite as one pyramid and the zoom fades alone decide what is visible */
export function overlaysForLevel(config: MapConfig, parentId: string | null): MapOverlay[] {
  // Only return overlays EXACTLY matching the current level to hide parent maps
  return (config.overlays ?? []).filter(o => !o.hidden && (o.parentId ?? null) === parentId)
}

export const roundLocation = (l: MapLocation): MapLocation => ({
  ...l,
  position: roundLngLat(l.position),
  polygon: l.polygon?.map(roundLngLat),
})

/** Narrow a config to what an export actually ships: model ids that were bundled, nodes that
 *  still lead somewhere, and no orphans whose parent level was dropped. */
export function pruneMapConfig(config: MapConfig, bundledModels: Set<string>): MapConfig {
  const locations = (config.locations ?? []).map(l =>
    l.modelIds ? { ...l, modelIds: l.modelIds.filter(id => bundledModels.has(id)) } : l
  )

  const byId = new Map(locations.map(l => [l.id, l]))
  const parents = new Set(locations.map(l => l.parentId).filter(Boolean) as string[])

  const alive = new Set(
    locations.filter(l => l.modelIds?.length || parents.has(l.id) || l.kind === 'place' || l.kind === 'road')
      .map(l => l.id)
  )
  // A node kept only because it has children dies once those children are gone
  for (let changed = true; changed;) {
    changed = false
    for (const id of [...alive]) {
      const parentId = byId.get(id)?.parentId
      if (parentId && !alive.has(parentId)) {
        alive.delete(id)
        changed = true
        continue
      }
      const node = byId.get(id)!
      const keepsChildren = locations.some(l => l.parentId === id && alive.has(l.id))
      if (!node.modelIds?.length && !keepsChildren && node.kind !== 'place' && node.kind !== 'road') {
        alive.delete(id)
        changed = true
      }
    }
  }

  const kept = locations.filter(l => alive.has(l.id))
  const dropped = locations.length - kept.length
  if (dropped) {
    console.warn(`[export] omitting ${dropped} map location(s) with no bundled model or surviving parent`)
  }

  const inLevel = (parentId?: string) => !parentId || alive.has(parentId)
  return {
    ...config,
    locations: kept,
    overlays: (config.overlays ?? []).filter(o => inLevel(o.parentId)),
  }
}

/** Drop model ids the project no longer has, so a stale project.json cannot open an empty scene */
export const liveModelIds = (meta: ProjectMeta, l: MapLocation) => {
  const known = new Set(meta.models.map(m => m.modelId))
  return (l.modelIds ?? []).filter(id => known.has(id))
}
