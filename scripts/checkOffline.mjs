import { chromium } from 'playwright'

const BASE = process.env.OFFLINE_CHECK_URL || 'http://localhost:5173'
const PAGES = ['/', '/viewer.html']

const LOCAL = /^(data:|blob:|about:|http:\/\/localhost|http:\/\/127\.0\.0\.1|http:\/\/\[::1\])/
// FIN, auth and the dashboard's weather widget are owned elsewhere and deliberately untouched
const NOT_OURS = /openweathermap\.org|\/api\/(fin|auth)\//

const escaped = new Set()

// Prefer whatever is already on the machine so this never needs `playwright install`
async function launch() {
  const channels = [undefined, 'chromium', 'chrome', 'msedge']
  let last
  for (const channel of channels) {
    try {
      return await chromium.launch(channel ? { channel } : {})
    } catch (err) {
      last = err
    }
  }
  throw last
}

const browser = await launch()
const context = await browser.newContext()

await context.route('**/*', route => {
  const url = route.request().url()
  if (LOCAL.test(url)) return route.continue()
  if (!NOT_OURS.test(url)) escaped.add(url)
  return route.abort()
})

for (const route of PAGES) {
  const page = await context.newPage()
  await page.goto(BASE + route, { waitUntil: 'load' })
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.close()
}

await browser.close()

if (escaped.size) {
  console.error(`FAIL — ${escaped.size} outbound request(s) escaped:`)
  for (const url of escaped) console.error('  ' + url)
  process.exit(1)
}

console.log(`OK — ${PAGES.length} page(s) loaded with zero outbound requests`)
