// Dev-only: screenshots Applyd's live demo with headless Chrome, for the case study and the
// before/after slider. Not part of the site build. Needs Google Chrome at the macOS default
// path. Read-only: it logs in with the public demo account and only looks; it never creates,
// edits or deletes anything.
//
//   bun scripts/capture-applyd.ts            # PNG stills + exported WebPs in public/job-tracker/
//   PROBE=1 bun scripts/capture-applyd.ts    # logs in and prints the board's HTML instead
//
// The viewport is 1437×776 at 2x, which is the 2874×1552 framing of the original dark-UI
// screenshots, so old and new line up. The stills use reduced motion, so each one shows the
// final state with nothing half-animated. The PNGs are gitignored; only exported WebPs ship.
// CDP replies are untyped JSON, so `any` is the honest type here.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const demo = 'https://job-tracker-steel-ten.vercel.app'
// The public demo account, also shown on the portfolio.
const email = 'testUser@test.com'
const password = 'Password7711'
const outDir = resolve(import.meta.dir, '../public/job-tracker')
const COLD_START = 90_000 // ms; the free Render backend can take up to a minute to wake

// Fresh port + profile per run, so a leftover browser can never be reused.
const port = 9400 + Math.floor(Math.random() * 500)
const profile = tmpdir() + '/capture-prof-' + port
const chrome = Bun.spawn(
  [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=' + port,
    '--user-data-dir=' + profile, 'about:blank',
  ],
  { stderr: 'ignore' },
)
process.on('exit', () => chrome.kill()) // also on a crash, so no browser outlives its run
let targets: any
for (let i = 0; i < 40 && !targets; i++) {
  await Bun.sleep(250)
  targets = await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json()).catch(() => undefined)
}
if (!targets) throw new Error('chrome never came up on ' + port)
const page = targets.find((t: { type: string }) => t.type === 'page')
const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const pending = new Map<number, (v: any) => void>()
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data as string)
  pending.get(msg.id)?.(msg.result)
}
const send = (method: string, params = {}) =>
  new Promise<any>((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })) })
const evaluate = async (expression: string) =>
  (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value

/** Polls a page expression until it is truthy; throws with `what` if it never is. */
async function waitFor(expression: string, what: string, timeout = 15_000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (await evaluate(expression)) return
    await Bun.sleep(250)
  }
  const state = await evaluate(`location.pathname + ' | ' + document.body.innerText.slice(0, 300)`)
  throw new Error(`timed out waiting for ${what}. Page: ${state}`)
}

await send('Emulation.setDeviceMetricsOverride', { width: 1437, height: 776, deviceScaleFactor: 2, mobile: false })
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await send('Page.enable')

// The four status columns are h2s. (Not innerText: the app uppercases them with CSS.)
const boardReady = `document.querySelectorAll('h2').length >= 4`

/** Types into a field the way a visitor would, so the app's own form handling sees it. */
async function type(selector: string, text: string) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).focus()`)
  await send('Input.insertText', { text })
}

// Log in through the real form. Always load the root: the demo has no rewrite for deep
// links, so /login 404s on a fresh load, but the app redirects there itself.
await send('Page.navigate', { url: demo + '/' })
await waitFor(`!!document.querySelector('#email')`, 'the login form')
await type('#email', email)
await type('#password', password)
await evaluate(`document.querySelector('button[type=submit]').click()`)
console.log('logging in; the backend may be waking up (up to a minute)...')
await waitFor(`location.pathname !== '/login'`, 'login to finish', COLD_START)
await waitFor(boardReady, 'the board', COLD_START)

/** Saves the current viewport as a PNG, after letting the page settle. */
async function shot(name: string) {
  await Bun.sleep(1200)
  const img = await send('Page.captureScreenshot', { format: 'png' })
  const file = join(outDir, name + '.png')
  await Bun.write(file, Buffer.from(img.data, 'base64'))
  console.log('saved', file)
}

/** Uses the app's own Light / Dark toggle, so what we capture is what a visitor gets. */
async function setTheme(theme: 'light' | 'dark') {
  await evaluate(`document.querySelector('label[title="${theme === 'light' ? 'Light' : 'Dark'}"]').click()`)
  await waitFor(`document.documentElement.classList.contains('dark') === ${theme === 'dark'}`, theme + ' theme')
  // A scripted click leaves the toggle focused, and its focus ring would show in the still.
  await evaluate('document.activeElement?.blur()')
}

/** Opens an application from the board by its company name (client-side navigation). */
async function openApplication(company: string) {
  await evaluate(
    `[...document.querySelectorAll('a')].find((a) => a.textContent.includes(${JSON.stringify(company)})).click()`,
  )
  await waitFor(`location.pathname !== '/'`, 'the detail page')
  await Bun.sleep(500)
}

/** Bounding boxes in CSS px (the PNGs are 2x), for placing the case study's pen circles. */
async function measure(selectors: Record<string, string>) {
  return evaluate(`(() => {
    const out = {}
    for (const [name, selector] of Object.entries(${JSON.stringify(selectors)})) {
      out[name] = [...document.querySelectorAll(selector)].map((el) => {
        const r = el.getBoundingClientRect()
        return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
      })
    }
    return out
  })()`)
}

/** Re-encodes a PNG as WebP, optionally cropped to its top `cropHeight` px and scaled to
 *  `width`. Done in the page with a canvas, because no WebP encoder is installed. */
async function exportWebp(png: string, webp: string, width: number, cropHeight?: number) {
  const b64 = Buffer.from(await Bun.file(join(outDir, png)).arrayBuffer()).toString('base64')
  const data = await evaluate(`(async () => {
    const img = new Image()
    img.src = 'data:image/png;base64,${b64}'
    await img.decode()
    const h = ${cropHeight ?? 0} || img.height
    const canvas = document.createElement('canvas')
    canvas.width = ${width}
    canvas.height = Math.round((h * ${width}) / img.width)
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, img.width, h, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/webp', 0.82).split(',')[1]
  })()`)
  await Bun.write(join(outDir, webp), Buffer.from(data, 'base64'))
  console.log('exported', webp)
}

if (process.env.PROBE) {
  console.log(await evaluate(`document.body.innerHTML.replace(/<script[\\s\\S]*?<\\/script>/g, '').slice(0, 9000)`))
} else {
  await setTheme('light')
  await shot('paper-board-light')
  console.log('board boxes (CSS px):', JSON.stringify(await measure({
    statusDots: 'h2 > span[aria-hidden]',
    countChips: 'h2 + span',
    columnHeadings: 'h2',
    themeToggle: 'fieldset',
  })))
  await openApplication('Fernleaf Studio')
  await shot('paper-detail-light')
  console.log('detail boxes (CSS px):', JSON.stringify(await measure({ emptyNotes: '[class*="border-dashed"]' })))
  await setTheme('dark')
  await shot('paper-detail-dark')
  await evaluate('history.back()')
  await waitFor(boardReady, 'the board again')
  await shot('paper-board-dark')

  // WebPs. The boards are cropped to their top 880px (440 CSS px of the 776 viewport is
  // empty below the columns), and the old dark board gets the identical crop, so the
  // before/after slider lines up exactly.
  await send('Page.navigate', { url: 'about:blank' })
  const BOARD_CROP = 880
  const SLIDER_WIDTH = 1792 // 2x the 896px content column
  await exportWebp('board.png', 'board-before.webp', SLIDER_WIDTH, BOARD_CROP)
  for (const theme of ['light', 'dark']) {
    await exportWebp(`paper-board-${theme}.png`, `board-paper-${theme}.webp`, SLIDER_WIDTH, BOARD_CROP)
    await exportWebp(`paper-board-${theme}.png`, `board-paper-${theme}-full.webp`, 2874, BOARD_CROP)
    await exportWebp(`paper-detail-${theme}.png`, `detail-paper-${theme}.webp`, SLIDER_WIDTH)
    await exportWebp(`paper-detail-${theme}.png`, `detail-paper-${theme}-full.webp`, 2874)
  }
}

ws.close()
chrome.kill()
await chrome.exited
await Bun.$`rm -rf ${profile}`.quiet()
