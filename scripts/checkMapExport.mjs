// Exercises the export-time pruning: pins that reference dropped models, orphaned levels,
// and map assets nothing references any more.
import { build } from 'esbuild'
import { unlinkSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

async function load(entry, outName) {
  const outfile = path.join(root, 'scripts', outName)
  await build({
    entryPoints: [path.join(root, 'src', 'lib', entry)],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    logLevel: 'silent',
    alias: { '@': path.join(root, 'src') },
  })
  const mod = await import(pathToFileURL(outfile).href)
  unlinkSync(outfile)
  return mod
}

const { pruneMapConfig } = await load('mapConfig.ts', '.mapconfig.build.mjs')
const { collectMapGarbage } = await load('mapAssets.ts', '.mapassets.build.mjs')

const problems = []
const check = (label, ok, detail = '') => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? ' — ' + detail : ''}`)
  if (!ok) problems.push(label)
}

const config = {
  version: 1,
  camera: { center: [0, 0], zoom: 10 },
  basemap: { kind: 'image', hash: 'world', coordinates: [[0, 0], [1, 0], [1, 1], [0, 1]] },
  overlays: [
    { id: 'o-root', hash: 'a', coordinates: [] },
    { id: 'o-site', hash: 'b', parentId: 'site', coordinates: [] },
    { id: 'o-dead', hash: 'c', parentId: 'gone', coordinates: [] },
  ],
  locations: [
    { id: 'site', name: 'Site', position: [0, 0] },
    { id: 'keep', parentId: 'site', name: 'Keep', position: [0, 0], modelIds: ['m1', 'ghost'] },
    { id: 'drop', parentId: 'site', name: 'Drop', position: [0, 0], modelIds: ['ghost'] },
    { id: 'empty', name: 'Empty top level', position: [0, 0] },
    { id: 'label', name: 'A PLACE', position: [0, 0], kind: 'place' },
    { id: 'orphan', parentId: 'gone', name: 'Orphan', position: [0, 0], modelIds: ['m1'] },
  ],
}

const pruned = pruneMapConfig(config, new Set(['m1']))
const ids = pruned.locations.map(l => l.id).sort()

check('unbundled model ids are stripped',
  JSON.stringify(pruned.locations.find(l => l.id === 'keep').modelIds) === '["m1"]')
check('a pin whose only model vanished is dropped', !ids.includes('drop'))
check('its parent survives because a sibling still has models', ids.includes('site'))
check('a level with nothing under it is dropped', !ids.includes('empty'))
check('a label is never pruned', ids.includes('label'))
check('an orphan whose parent is gone is dropped', !ids.includes('orphan'), ids.join(','))
check('overlays follow their level', pruned.overlays.map(o => o.id).sort().join(',') === 'o-root,o-site',
  pruned.overlays.map(o => o.id).join(','))

const meta = {
  models: [],
  mapConfig: pruned,
  mapAssets: {
    world: { kind: 'image', hash: 'world', src: 'mapassets/world.webp', mime: 'image/webp', bytes: 1 },
    a: { kind: 'image', hash: 'a', src: 'mapassets/a.webp', mime: 'image/webp', bytes: 1 },
    b: { kind: 'image', hash: 'b', src: 'mapassets/b.webp', mime: 'image/webp', bytes: 1 },
    c: { kind: 'image', hash: 'c', src: 'mapassets/c.webp', mime: 'image/webp', bytes: 1 },
    unused: { kind: 'image', hash: 'unused', src: 'mapassets/u.webp', mime: 'image/webp', bytes: 1 },
  },
}
const kept = Object.keys(collectMapGarbage(meta)).sort()
check('garbage collection keeps only referenced assets', kept.join(',') === 'a,b,world', kept.join(','))

// Cascading: dropping every model must collapse the whole tree but keep labels
const empty = pruneMapConfig(config, new Set())
check('with no models the tree collapses to labels only',
  empty.locations.map(l => l.id).join(',') === 'label', empty.locations.map(l => l.id).join(','))

if (problems.length) {
  console.error(`\nFAIL — ${problems.length} problem(s)`)
  process.exit(1)
}
console.log('\nOK — export pruning drops dangling pins, orphaned levels and unreferenced assets')
