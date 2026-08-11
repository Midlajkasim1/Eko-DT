// Pins the tile math against EKO-Modon/src/data/dubai.js, whose renders are all
// tile-native — if these stop matching, georeferenced overlays will not align.
import { build } from 'esbuild'
import { readFileSync, unlinkSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'scripts', '.geo.build.mjs')

await build({
  entryPoints: [path.join(root, 'src', 'lib', 'geo.ts')],
  outfile: out,
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  logLevel: 'silent',
})

const geo = await import(pathToFileURL(out).href)
unlinkSync(out)

const CASES = [
  {
    name: 'dubai-overview — z13, 8x6 tiles, 2048x1536',
    grid: { z: 13, w: 8, h: 6 },
    center: [55.1953125, 25.1253343],
    expect: [
      [55.01953125, 25.24469595],
      [55.37109375, 25.24469595],
      [55.37109375, 25.00597266],
      [55.01953125, 25.00597266],
    ],
  },
  {
    name: 'palm-l2 — z16, 4x4 tiles, 1024x1024',
    grid: { z: 16, w: 4, h: 4 },
    center: [55.134887695, 25.115445],
    expect: [
      [55.1239013671875, 25.125392610065892],
      [55.1458740234375, 25.125392610065892],
      [55.1458740234375, 25.105497373014686],
      [55.1239013671875, 25.105497373014686],
    ],
  },
  {
    name: 'marsa-l3 — z18, 4x4 tiles, 1024x1024',
    grid: { z: 18, w: 4, h: 4 },
    center: [55.188446, 25.145284],
    expect: [
      [55.18569946289063, 25.147770876014975],
      [55.19119262695313, 25.147770876014975],
      [55.19119262695313, 25.142798294464103],
      [55.18569946289063, 25.142798294464103],
    ],
  },
]

const TOLERANCE = 1e-6
let failures = 0

for (const c of CASES) {
  const grid = geo.gridForImage(c.center, c.grid.z, c.grid.w * 256, c.grid.h * 256)
  const quad = geo.gridToQuad(grid)
  const [pxW, pxH] = geo.gridPixelSize(grid)

  const bad = quad.some((corner, i) =>
    Math.abs(corner[0] - c.expect[i][0]) > TOLERANCE ||
    Math.abs(corner[1] - c.expect[i][1]) > TOLERANCE
  )

  const gridOk = grid.z === c.grid.z && grid.w === c.grid.w && grid.h === c.grid.h
  if (bad || !gridOk) {
    failures++
    console.error(`FAIL ${c.name}`)
    console.error('  grid    ', JSON.stringify(grid))
    console.error('  expected', JSON.stringify(c.expect))
    console.error('  actual  ', JSON.stringify(quad))
  } else {
    console.log(`ok   ${c.name}  →  ${grid.w}x${grid.h} @ z${grid.z}, ${pxW}x${pxH}px, ${geo.metersPerPixel(c.center[1], grid.z).toFixed(2)} m/px`)
  }
}

const sameGrid = (a, b) => a.z === b.z && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h

// Round-trip: snapping a quad's own bounds must reproduce the same grid
for (const c of CASES) {
  const grid = geo.gridForImage(c.center, c.grid.z, c.grid.w * 256, c.grid.h * 256)
  const bounds = geo.quadUnion([geo.gridToQuad(grid)])
  const again = geo.snapBoundsToGrid(bounds, c.grid.z)
  if (!sameGrid(grid, again)) {
    failures++
    console.error(`FAIL round-trip ${c.name}: ${JSON.stringify(grid)} -> ${JSON.stringify(again)}`)
  } else {
    console.log(`ok   round-trip ${c.name}`)
  }
}

// The z0 tile is the whole world, which is what makes a single world image work
const worldQuad = geo.gridToQuad({ z: 0, x: 0, y: 0, w: 1, h: 1 })
const worldOff = worldQuad.some((corner, i) =>
  Math.abs(corner[0] - geo.WORLD_QUAD[i][0]) > TOLERANCE ||
  Math.abs(corner[1] - geo.WORLD_QUAD[i][1]) > TOLERANCE
)
if (worldOff) {
  failures++
  console.error('FAIL WORLD_QUAD is not the z0 tile:', JSON.stringify(worldQuad))
} else {
  console.log('ok   WORLD_QUAD equals the z0 tile')
}

// Sanity: 8x6 z13 tiles span exactly 8/2^13 of the globe
const overview = geo.gridToQuad({ z: 13, x: 5348, y: 3502, w: 8, h: 6 })
const span = overview[1][0] - overview[0][0]
if (Math.abs(span - (8 * 360) / 2 ** 13) > 1e-9) {
  failures++
  console.error('FAIL z13 8-tile longitude span is', span)
} else {
  console.log('ok   z13 8-tile span is exactly 8 x (360 / 2^13)')
}

if (failures) {
  console.error(`\n${failures} check(s) failed`)
  process.exit(1)
}
console.log('\nOK — tile math reproduces the reference bounds exactly')
