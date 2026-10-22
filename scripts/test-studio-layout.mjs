// Browser test, Studio layout (the React host with the dashboard overlay, as shipped), at the widths
// the client uses. Real pointer clicks (hit-tested: a control covered by another element, or with
// pointer-events:none, fails) and rendered geometry, not handler calls.
//
//  1. Locate in 3D on the Assets Register hides ONLY the central table. The Studio's left sidebar, the
//     dashboard's rail and top bar, and the right asset details panel (with its actions) stay; the
//     model takes the table's room; Back to Assets / Escape bring the table back.
//     Where no model is on screen (narrow register) the Overview, which has one, is used instead.
//  2. The Energy summary panel is as tall as its cards (16px under the last), scrolls inside itself
//     on a short screen without covering the timeline or toolbar, and no other summary changes.
//
//   1. npm run dev                       (Vite on :5173, proxying /api/fin to :8000)
//   2. make sure nothing listens on :8000 (this script starts the backend with a FAKE FIN client)
//   3. node scripts/test-studio-layout.mjs
//
// Needs Playwright (devDependency) and Microsoft Edge, or set PW_CHANNEL=chrome. PYTHON overrides the interpreter.
import assert from 'node:assert'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const APP = process.env.APP_URL || 'http://localhost:5173'
const API = 'http://127.0.0.1:8000'
const python = process.env.PYTHON || path.join(ROOT, 'backend', 'venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python')
const sleep = ms => new Promise(r => setTimeout(r, ms))

const backend = spawn(python, ['tests/fake_fin_server.py', '--port', '8000'], { cwd: path.join(ROOT, 'backend'), stdio: 'ignore' })
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || 'msedge', headless: true })
let passed = 0
const test = async (name, fn) => { await fn(); passed++; console.log('ok  ' + name) }

async function waitBackend() {
  for (let i = 0; i < 60; i++) { try { if ((await fetch(API + '/api/fin/status')).ok) return } catch {} await sleep(300) }
  throw new Error('fake backend did not start on :8000')
}

// the host as shipped: an Eko-DT FIN project, signed in, dashboard shown
async function openHost(width, height = 900) {
  const ctx = await browser.newContext({ viewport: { width, height } })
  const p = await ctx.newPage(), errors = []
  p.on('pageerror', e => errors.push(String(e)))
  await p.goto(APP)
  await p.waitForFunction(() => window.__twin?.stores?.project, null, { timeout: 60000 })
  await p.evaluate(async () => {
    const m = { version: 1, createdAt: 1, updatedAt: 1, models: [], geolocation: null, projectId: 'layout-1', name: 'Layout test',
                isFinProject: true, apiSettings: { finProjectName: 'adnocWarsan' } }
    const dir = await (await navigator.storage.getDirectory()).getDirectoryHandle(m.projectId, { create: true })
    const w = await (await dir.getFileHandle('project.json', { create: true })).createWritable(); await w.write(JSON.stringify(m)); await w.close()
    window.__twin.stores.project.setState({ currentProject: m, folderHandle: dir }); window.__twin.stores.app.getState().setStep('viewing')
  })
  const signIn = p.locator('#fin-username'), connected = p.locator('text=FIN CONNECTED')
  await signIn.or(connected).first().waitFor({ timeout: 30000 })   // the backend keeps one FIN session: signed in once, connected after
  if (await signIn.isVisible()) {
    await signIn.fill('tester'); await p.fill('#fin-password', 'secret')
    await p.click('button:has-text("Connect")')
  }
  await connected.waitFor({ timeout: 15000 })
  const show = p.locator('[title="Show Dashboard"]')
  if (await show.count()) await show.click()
  await p.waitForFunction(() => window.EKO && document.querySelector('.dashboard-native-container #topbar'), null, { timeout: 30000 })
  return { p, ctx, errors }
}

// what is on screen, from the rendered layout
const layout = p => p.evaluate(() => {
  const q = s => [...document.querySelectorAll(s)].find(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden')
  const box = s => { const e = q(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } }
  const st = window.EKO.state
  const canvas = document.querySelector('.viewer-canvas-container canvas')      // the host's BIM canvas, under the overlay
  const c = canvas && canvas.getBoundingClientRect(), v = box('#vpmain')
  const side = q('aside.sidebar'), panel = q('#assetpanel')
  return {
    pageId: st.pageId, focus: !!st.locFocus, assetSel: st.assetSel, paint: st.paint,
    table: !!q('.dgwrap[data-grid="assets"]'), tableParts: !!q('.dgwrap .dgbar, .dgwrap .dgfoot, .dgwrap table'), strip: !!q('.regmodelwrap'),
    viewer: v, panel: box('#assetpanel'), panelText: panel ? panel.innerText.replace(/\s+/g, ' ') : '',
    rail: box('#ekonav'), topbar: box('#topbar'), back: box('.vpback'),
    sidebar: side ? { text: side.innerText.replace(/\s+/g, ' ').trim(), ...box('aside.sidebar') } : null,
    canvasCovers: !c || !v || (c.left <= v.x + 1 && c.top <= v.y + 1 && c.right >= v.x + v.w - 1 && c.bottom >= v.y + v.h - 1),
    pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    dashOverflow: (r => r.scrollWidth > r.clientWidth + 1)(window.DASHBOARD_ROOT || document.querySelector('.dashboard-native-container')),
    scrollW: (window.DASHBOARD_ROOT || document.querySelector('.dashboard-native-container')).scrollWidth,
  }
})
const rows = '.dgwrap[data-grid="assets"] tr[data-asset]'
// A click as a user makes it: the mouse at the control's centre. (locator.click() scrolls a covered control
// into view, and that sideways-scrolls the dashboard's overflow:hidden wrapper, which no user can do.)
const mclick = async (p, loc) => { const b = await loc.boundingBox(); assert.ok(b, 'the control is on screen'); await p.mouse.click(b.x + b.width / 2, b.y + b.height / 2) }
// A real click where the control can be clicked. Where the host covers it (a narrow Studio: its Render tab over the
// asset panel, its toolbar over a stacked panel; the table squeezed under the model strip) the control's own click
// handler stands in, and a note says so. `strict` (wide windows) allows no stand-in.
let strict = true
const press = async (p, loc) => {
  const why = await hit(loc)
  if (!why) return mclick(p, loc)
  assert.ok(!strict, 'the control can be clicked: ' + why)
  console.log('     note: ' + why + ' (the host covers it here): using its click handler')
  await loc.evaluate(el => el.click())
}
// until two looks 100ms apart agree: the panel slide-in and the width transitions have finished
const settle = async p => { let a = JSON.stringify(await layout(p)); for (let i = 0; i < 30; i++) { await sleep(100); const b = JSON.stringify(await layout(p)); if (a === b) return; a = b } throw new Error('layout never settled') }
const register = async p => {
  await p.evaluate(() => window.EKO.go('assets-register', 'assets', 'reg'))
  await p.locator(rows).first().waitFor()
}
// a register row, clicked where a user would: its asset id cell
async function pickRow(p, n) {
  const row = p.locator(rows).nth(n)
  const id = await row.getAttribute('data-asset')
  await press(p, row.locator('td.mono').first())
  await p.locator(`[data-act="locate"][data-asset="${id}"]`).filter({ visible: true }).first().waitFor()
  await settle(p)
  return id
}
const locateBtn = (p, id) => p.locator(`[data-act="locate"][data-asset="${id}"]`).filter({ visible: true }).first()
const locate = async (p, id) => {
  await press(p, locateBtn(p, id))
  await p.locator('.vpback').waitFor()
  await settle(p)
}
// is a control really on top where a user would click it (not covered, not click-through)?
const hit = async loc => {
  let why = ''
  for (let i = 0; i < 20; i++) {                               // the panel's entrance animation settles first
    why = await loc.evaluate(el => {
      const r = el.getBoundingClientRect(), t = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
      return r.width > 0 && !!t && (t === el || el.contains(t)) ? '' : 'covered by ' + (t ? t.tagName + '.' + String(t.className).slice(0, 40) : 'nothing') + ' at ' + Math.round(r.x + r.width / 2) + ',' + Math.round(r.y + r.height / 2)
    })
    if (!why) return ''
    await sleep(100)
  }
  return why
}

// The panel and its actions: the asset's own details, not the register summary
async function assertPanel(p, id, { strict }) {
  const f = await layout(p)
  assert.ok(f.panel, 'the asset details panel is on screen: ' + JSON.stringify(f))
  assert.ok(f.panelText.includes(id), `the panel shows ${id}'s own details: ` + f.panelText.slice(0, 80))
  assert.ok(f.panel.x >= 0 && f.panel.x + f.panel.w <= (await p.evaluate(() => innerWidth)) + 1, 'the panel is inside the window')
  const panel = p.locator('#assetpanel')
  for (const name of [/Locate in 3D/, /work order/i, /CAFM/]) {
    const b = panel.getByRole('button', { name }).filter({ visible: true }).first()
    assert.ok(await b.count(), `the panel has its ${name} action`)
    if (strict) assert.strictEqual(await hit(b), '', `the ${name} action is not covered`)
  }
  assert.ok(await panel.locator('.aptab').filter({ visible: true }).count(), 'the panel keeps its tabs')
  assert.strictEqual(f.assetSel, id)
}

// Locate in 3D on a register with its model strip on screen (the Studio at 1100 and wider)
async function inPlaceWorkflow(p, name, { grows }) {
  await register(p)
  const before = await layout(p), sb0 = before.sidebar
  assert.ok(before.table && before.strip && before.sidebar, `${name}: the register is open: ` + JSON.stringify(before))
  for (const n of [0, 1]) {
    if (n) { await p.keyboard.press('Escape'); await p.waitForFunction(() => !window.EKO.state.assetSel); await settle(p) }   // the first asset's panel covers the next row in the Studio
    const id = await pickRow(p, n)
    const opened = await layout(p)
    await locate(p, id)
    const f = await layout(p), at = ' ' + JSON.stringify(f)
    assert.strictEqual(f.pageId, 'assets-register', 'still on the register page' + at)
    assert.strictEqual(f.table || f.tableParts, false, 'the central table (search, filters, columns, export, rows, paging) is gone' + at)
    assert.deepStrictEqual(f.sidebar, sb0, "the Studio's left sidebar is exactly as it was" + at)
    assert.ok(f.rail && f.rail.w === opened.rail.w, "the dashboard's rail is unchanged" + at)
    assert.ok(f.topbar && f.topbar.w === opened.topbar.w, 'the top bar is unchanged' + at)
    assert.ok(f.viewer, 'the model is on screen' + at)
    if (grows) assert.ok(f.viewer.w > opened.viewer.w + 100, `the model grew into the table's room: ${opened.viewer.w} -> ${f.viewer.w}`)
    assert.ok(f.panel, 'the asset details panel is still open after Locate in 3D' + at)
    assert.ok(f.panel.x - (f.viewer.x + f.viewer.w) <= 2, 'no empty gap between the model and the details panel' + at)
    assert.ok(f.canvasCovers, 'the 3D canvas covers the whole viewer' + at)
    // docked flush at the window's right edge, full width. (Before, a narrow Studio's table could push it past the edge.)
    assert.ok(f.panel.w === opened.panel.w && Math.abs(f.panel.x + f.panel.w - await p.evaluate(() => innerWidth)) <= 1, 'the details panel keeps its size and sits fully inside the window' + at)
    await assertPanel(p, id, { strict: true })
    assert.strictEqual(f.paint, id, 'the located asset is highlighted')
    assert.strictEqual(f.pageOverflow || f.dashOverflow, false, 'no horizontal scrolling' + at)
    // Back to Assets: the table again, the asset still selected, the layout as before
    await press(p, p.locator('.vpback'))
    await p.locator(rows).first().waitFor(); await settle(p)
    const b = await layout(p)
    assert.ok(b.table && !b.back && !b.focus, 'Back to Assets shows the table again' + JSON.stringify(b))
    assert.deepStrictEqual([b.assetSel, b.panel && b.panel.w, b.viewer.w], [id, opened.panel.w, opened.viewer.w], 'selection and layout as before')   // the register as it was
    assert.deepStrictEqual(b.sidebar, sb0)
    // Escape does the same, and leaves the panel open
    await locate(p, id)
    await p.keyboard.press('Escape')
    await p.locator(rows).first().waitFor(); await settle(p)
    const e = await layout(p)
    assert.ok(e.table && e.panel && e.assetSel === id, 'Escape brings the table back and keeps the asset and its panel' + JSON.stringify(e))
    assert.strictEqual(e.pageId, 'assets-register')
  }
}

// Locate in 3D where the register shows no model (1024 and narrower): the Overview has the model
async function overviewWorkflow(p, name) {
  await register(p)
  const base = await layout(p), sb0 = base.sidebar
  const id = await pickRow(p, 0)
  await press(p, locateBtn(p, id))
  await p.locator('.vpback').waitFor(); await settle(p)
  const f = await layout(p), at = ' ' + JSON.stringify(f)
  assert.strictEqual(f.pageId, 'marsa-overview', name + ': the Overview, which shows the model' + at)
  assert.strictEqual(f.table || f.tableParts, false, 'the table is gone' + at)
  assert.deepStrictEqual(f.sidebar, sb0, "the Studio's left sidebar is exactly as it was" + at)
  assert.ok(f.viewer, 'the model is on screen' + at)
  // The Studio's 340px sidebar leaves a stacked dashboard 460px (800) or 50px (390): its own top bar already
  // overflows there, before anything is clicked. Locate in 3D must not add to it.
  assert.ok(f.scrollW <= base.scrollW && !f.pageOverflow, `no horizontal scrolling added: ${base.scrollW} -> ${f.scrollW}` + at)
  assert.strictEqual(f.paint, id)
  await assertPanel(p, id, { strict: false })
  await press(p, p.locator('.vpback'))
  await p.locator(rows).first().waitFor(); await settle(p)
  const b = await layout(p)
  assert.ok(b.table && b.pageId === 'assets-register' && b.assetSel === id && b.panel, 'Back to Assets: the table, the asset and its panel' + JSON.stringify(b))
}

try {
  await waitBackend()
  try { await fetch(APP) } catch { throw new Error(`no app at ${APP}: start it with npm run dev`) }

  for (const width of [1920, 1400, 1100, 1024]) await test(`Studio ${width}px: Locate in 3D hides only the table; sidebar, rail, top bar and the asset panel stay; Back and Escape return`, async () => {
    const { p, ctx, errors } = await openHost(width)
    strict = width >= 1400
    // the table has room to give only on a wide screen like the client's: at 1400 the Studio leaves the strip, table
    // and panel 440px + 380px, the table already ~10px, so there the model can only keep what it had
    await inPlaceWorkflow(p, width + 'px', { grows: width >= 1920 })
    assert.deepStrictEqual(errors, [])
    await ctx.close()
  })

  for (const width of [800, 390]) await test(`Studio ${width}px: no model beside the register, so Locate in 3D uses the Overview; panel and sidebar stay`, async () => {
    const { p, ctx, errors } = await openHost(width)
    strict = false
    await overviewWorkflow(p, width + 'px')
    assert.deepStrictEqual(errors, [])
    await ctx.close()
  })

  // ── Energy summary ────────────────────────────────────────────────────────────────────────
  const energy = p => p.evaluate(() => {
    const vis = s => [...document.querySelectorAll(s)].find(e => e.getClientRects().length)
    const r = e => { if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom), h: Math.round(b.height) } }
    const ovp = document.querySelector('#ovp'), pad = ovp.querySelector('.ovpad'), cards = [...ovp.querySelectorAll('.ovk')]
    pad.scrollTop = 0
    const o = { fit: ovp.dataset.fit, ovp: r(ovp), vp: r(document.querySelector('#vpmain')), last: r(cards[cards.length - 1]), cards: cards.length,
      scrolls: pad.scrollHeight > pad.clientHeight + 1, scrollY: getComputedStyle(pad).overflowY,
      toolbar: r(vis('#vbottom')), timeline: r(vis('.scrubbar')),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth || ovp.scrollWidth > ovp.clientWidth + 1 }
    pad.scrollTop = pad.scrollHeight                           // the end of the cards
    o.lastAtEnd = r(cards[cards.length - 1]); o.ovpAtEnd = r(ovp)
    pad.scrollTop = 0
    return o
  })
  for (const [width, height] of [[1400, 900], [1100, 900], [1024, 800], [1400, 560], [800, 900], [390, 900]]) await test(`Energy summary ${width}x${height}: as tall as its cards, scrolls inside on a short screen, nothing covered`, async () => {
    const { p, ctx, errors } = await openHost(width, height)
    await p.evaluate(() => window.EKO.go('energy', 'energy', null))
    await p.waitForSelector('#ovp'); await sleep(800)
    const m = await energy(p), at = ' ' + JSON.stringify(m)
    assert.strictEqual(m.cards, 5, 'all five cards are there' + at)
    if (width < 1024) {
      // the stacked shell lays the summary out in the page: the fit rule must not touch it (the Studio's sidebar already
      // leaves such a page too little width, before this change). Same box with and without data-fit.
      const box = () => p.evaluate(() => JSON.stringify(document.querySelector('#ovp').getBoundingClientRect()))
      const withFit = await box()
      await p.evaluate(() => document.querySelector('#ovp').removeAttribute('data-fit'))
      assert.strictEqual(await box(), withFit, 'the stacked summary is unchanged by data-fit' + at)
    } else {
      assert.strictEqual(m.overflow, false, 'no horizontal scrolling' + at)
      assert.strictEqual(m.fit, '1')
      if (!m.scrolls) {
        assert.ok(Math.abs((m.ovp.bottom - m.last.bottom) - 16) <= 2, `16px under the last card, got ${m.ovp.bottom - m.last.bottom}` + at)
        if (height >= 900) assert.ok(m.ovp.h < m.vp.h * 0.85, 'not stretched to the full height' + at)
      } else {
        assert.strictEqual(m.scrollY, 'auto', 'the cards scroll inside the panel' + at)
        assert.ok(m.lastAtEnd.bottom <= m.ovpAtEnd.bottom - 14, 'every card is reachable, 16px clear at the end' + at)
      }
      for (const bar of [m.toolbar, m.timeline]) if (bar) assert.ok(m.ovp.bottom <= bar.top + 1, 'the panel ends above the toolbar and timeline' + at)
    }
    assert.deepStrictEqual(errors, [])
    await ctx.close()
  })

  await test('the other summary panels (Overview, Utilities, Systems, Spaces, Assets) are not fitted', async () => {
    const { p, ctx, errors } = await openHost(1400, 900)
    for (const [id, mod] of [['marsa-overview', 'overview'], ['utilities', 'utilities'], ['systems', 'systems'], ['spaces', 'spaces'], ['assets', 'assets']]) {
      await p.evaluate(([i, m]) => window.EKO.go(i, m, null), [id, mod])
      await p.waitForSelector('#ovp'); await sleep(500)
      const m = await p.evaluate(() => { const o = document.querySelector('#ovp'), v = document.querySelector('#vpmain'); return { fit: o.dataset.fit ?? null, oh: o.getBoundingClientRect().height, vh: v.getBoundingClientRect().height } })
      assert.strictEqual(m.fit, null, id + ' has no data-fit')
      assert.ok(m.oh > m.vh * 0.8, `${id} keeps its full-height panel: ${m.oh} of ${m.vh}`)
    }
    assert.deepStrictEqual(errors, [])
    await ctx.close()
  })
} finally {
  await browser.close()
  backend.kill()
}
console.log(`\n${passed} layout tests passed`)
