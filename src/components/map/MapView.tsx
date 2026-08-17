import { useCallback, useEffect, useMemo, useRef } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import '@/styles/map.css'
import { useMapEngine } from '@/hooks/useMapEngine'
import { useMapStore } from '@/store/useMapStore'
import { createAssetResolver } from '@/lib/mapAssets'
import { addLocation, updateLocation } from '@/lib/mapDraft'
import { childrenOf, emptyMapConfig, findLocation, hasChildren, liveModelIds, pathTo, withBuiltinRenders } from '@/lib/mapConfig'
import { MapBreadcrumb } from '@/components/map/MapBreadcrumb'
import { MapControls } from '@/components/map/MapControls'
import { MapLocationPanel } from '@/components/map/MapLocationPanel'
import { MapLoadProgress } from '@/components/map/MapLoadProgress'
import { MapEditorPanel } from '@/components/map/MapEditorPanel'
import type { MapLocation, ProjectMeta } from '@/types'

interface MapViewProps {
  meta: ProjectMeta
  folderHandle: FileSystemDirectoryHandle | null
  adminMode: boolean
  onOpenLocation: (location: MapLocation) => void
  onExit: () => void
}

export function MapView({ meta, folderHandle, adminMode, onOpenLocation, onExit }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const path = useMapStore(s => s.path)
  const selectedId = useMapStore(s => s.selectedId)
  const phase = useMapStore(s => s.phase)
  const editing = useMapStore(s => s.editing)
  const draft = useMapStore(s => s.draft)
  const editTool = useMapStore(s => s.editTool)
  const select = useMapStore(s => s.select)
  const enterLevel = useMapStore(s => s.enterLevel)
  const goToLevel = useMapStore(s => s.goToLevel)

  const updateDraft = useMapStore(s => s.updateDraft)
  const setEditTool = useMapStore(s => s.setEditTool)

  // A project being given its first map has nothing saved yet, so the blank config renders
  const config = useMemo(
    () => withBuiltinRenders((editing && draft) || meta.mapConfig || emptyMapConfig()),
    [editing, draft, meta.mapConfig]
  )
  const levelId = path.length ? path[path.length - 1] : null
  const resolveAsset = useMemo(
    () => createAssetResolver(meta, folderHandle),
    [meta, folderHandle]
  )

  const engineOptions = useMemo(
    () => (config ? { config, levelId, resolveAsset } : null),
    [config, levelId, resolveAsset]
  )

  const selectRef = useRef<(location: MapLocation) => void>(() => {})
  const handleSelect = useCallback((location: MapLocation) => selectRef.current(location), [])

  const handleMapClick = useCallback((lngLat: [number, number]) => {
    if (editTool === 'pin') {
      updateDraft(d => addLocation(d, lngLat, levelId))
      setEditTool('none')
      return
    }
    select(null)
  }, [editTool, levelId, select, updateDraft, setEditTool])

  const handleMoved = useCallback((id: string, lngLat: [number, number]) => {
    updateDraft(d => updateLocation(d, id, { position: lngLat }))
  }, [updateDraft])

  const doubleClickRef = useRef<(location: MapLocation) => void>(() => {})
  const handleDoubleClick = useCallback((location: MapLocation) => doubleClickRef.current(location), [])

  const { engine } = useMapEngine(containerRef, engineOptions, {
    onSelectLocation: handleSelect,
    onDoubleClickLocation: handleDoubleClick,
    onMapClick: handleMapClick,
    onLocationMoved: handleMoved,
  })

  selectRef.current = useCallback((location: MapLocation) => {
    // 1. If it's a map level, instantly drill down into it!
    // We do this BEFORE select() because enterLevel internally resets selectedId to null.
    const isLevel = hasChildren(config?.locations, location.id) || (config?.overlays ?? []).some(o => o.parentId === location.id)
    if (isLevel) {
      enterLevel(location.id)
      if (location.view) engine?.flyToCamera(location.view, 1200)
    }

    // 2. Always select the pin. This opens the info panel on the left side.
    select(location.id)
  }, [select, config, enterLevel, engine])

  doubleClickRef.current = useCallback((location: MapLocation) => {
    // Double click on a map level: drill down
    const isLevel = hasChildren(config?.locations, location.id) || (config?.overlays ?? []).some(o => o.parentId === location.id)
    if (isLevel) {
      enterLevel(location.id)
      if (location.view) engine?.flyToCamera(location.view, 1200)
      return
    }

    // Double click on a leaf pin: open viewer
    select(location.id)
    const ids = new Set(liveModelIds(meta, location))
    const models = meta.models.filter(m => ids.has(m.modelId))
    if (models.length > 0) {
      onOpenLocation(location)
    }
  }, [config, enterLevel, engine, meta, onOpenLocation, select])

  useEffect(() => {
    engine?.setDraggable(editing && editTool === 'none')
  }, [engine, editing, editTool])

  useEffect(() => {
    if (!import.meta.env.DEV) return
    ;(window as never as { __mapEngineForTest?: unknown }).__mapEngineForTest = engine?.map
  }, [engine])

  // Fly to the pin the moment it is picked, so the panel opens over the right place.
  // Skip if the location has a custom view — the click handler already called flyToCamera.
  useEffect(() => {
    if (!selectedId) return
    const loc = findLocation(config?.locations, selectedId)
    if (loc?.view) return
    engine?.flyToLocation(selectedId)
  }, [engine, selectedId, config])

  const locations = config?.locations
  const selected = findLocation(locations, selectedId)
  const trail = useMemo(
    () => pathTo(locations, levelId).map(id => findLocation(locations, id)).filter(Boolean) as MapLocation[],
    [locations, levelId]
  )

  const selectedModels = useMemo(() => {
    if (!selected) return []
    const ids = new Set(liveModelIds(meta, selected))
    return meta.models.filter(m => ids.has(m.modelId))
  }, [meta, selected])

  const handleOpen = useCallback(() => {
    if (!selected) return
    if (hasChildren(locations, selected.id)) {
      enterLevel(selected.id)
      if (selected.view) engine?.flyToCamera(selected.view, 1200)
      return
    }
    onOpenLocation(selected)
  }, [selected, locations, enterLevel, engine, onOpenLocation])

  const handleGoTo = useCallback((id: string | null) => {
    goToLevel(id)
    const target = findLocation(locations, id)
    if (target?.view) engine?.flyToCamera(target.view, 1200)
    else if (!id && config) engine?.flyToCamera(config.camera, 1200)
  }, [goToLevel, locations, engine, config])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (useMapStore.getState().editTool !== 'none') {
        useMapStore.getState().setEditTool('none')
        return
      }
      if (useMapStore.getState().selectedId) {
        select(null)
        return
      }
      // Escape never leaves the map — stepping up a level is as far as it goes
      if (useMapStore.getState().path.length) useMapStore.getState().exitLevel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [select])

  const levelLocations = childrenOf(locations, levelId)

  return (
    <div
      className={`map-layer ${phase === 'leaving' ? 'map-layer--leaving' : ''}`}
      role="application"
      aria-label="Project location map"
    >
      <div ref={containerRef} className="map-canvas" />
      <div className="map-vignette" />

      <header className="map-topbar">
        <MapBreadcrumb projectName={meta.name} trail={trail} onGoTo={handleGoTo} />
        <div className="map-spacer" />
        <button className="map-pill" onClick={onExit}>Back to projects</button>
      </header>

      <MapControls engine={engine} />

      {selected && (
        <MapLocationPanel
          location={selected}
          models={selectedModels}
          childCount={childrenOf(locations, selected.id).length}
          busy={phase === 'loading'}
          onOpen={handleOpen}
          onClose={() => select(null)}
        />
      )}

      {adminMode && <MapEditorPanel engine={engine} meta={meta} levelId={levelId} />}

      {levelLocations.length === 0 && !editing && (
        <div className="map-empty">
          <p>No locations at this level{adminMode ? ' — open Edit map to add one.' : '.'}</p>
        </div>
      )}

      <MapLoadProgress />
    </div>
  )
}
