import { useState, useEffect } from 'react'
import type { FragmentsEngine } from '@/lib/fragmentsEngine'
import type { FragmentsModel } from '@thatopen/fragments'

export interface SpatialTreeItem {
  category: string | null
  localId: number | null
  children?: SpatialTreeItem[]
  name?: string
}

export function useSpatialTree(engineRef: React.MutableRefObject<FragmentsEngine | null>, modelId: string | null, isLoadedInEngine: boolean = false) {
  const [treeData, setTreeData] = useState<SpatialTreeItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!engineRef.current || !modelId || !isLoadedInEngine) {
      setTreeData(null)
      return
    }

    let cancelled = false

    const loadTree = async () => {
      setIsLoading(true)
      try {
        const engine = engineRef.current
        if (!engine) return
        const model = engine.fragments.models.list.get(modelId) as FragmentsModel
        if (!model) return

        const structure = await model.getSpatialStructure()

        const localIds: number[] = []
        const collectIds = (node: SpatialTreeItem) => {
          if (node.localId !== null) localIds.push(node.localId)
          node.children?.forEach(collectIds)
        }
        collectIds(structure)

        // One worker round trip for the whole tree rather than one per node
        const items = localIds.length ? await model.getItems(localIds) : new Map()
        if (cancelled) return

        const nameOf = (localId: number | null) => {
          if (localId === null) return undefined
          const data = items.get(localId)?.data
          const value = (data?.Name ?? data?.LongName)?.value
          return value === undefined || value === null || value === '' ? undefined : String(value)
        }

        const enrichNode = (node: SpatialTreeItem): SpatialTreeItem => ({
          ...node,
          name: nameOf(node.localId),
          children: node.children?.map(enrichNode),
        })

        setTreeData(enrichNode(structure))
      } catch (err) {
        console.error('Failed to load spatial tree', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadTree()
    return () => { cancelled = true }
  }, [engineRef, modelId, isLoadedInEngine])

  return { treeData, isLoading }
}
