// Dev-only: drive headless Chrome over the DevTools protocol to measure the live page.
// Not part of the site build. Needs Google Chrome installed at the macOS default path.
//
//   bun run dev                                    # in another terminal
//   bun scripts/cdp.ts <url> <width> <js-expression> [screenshot.png selector]
//
// e.g. check every ScrollTrigger starts where it should (expect start === expected):
//   NOSCROLL=1 WAIT=3000 bun scripts/cdp.ts http://localhost:5173/ 1280 "$(cat scripts/triggers.js)"
//
// By default it scrolls to the bottom first so every play-once timeline fires.
// NOSCROLL=1 skips that (once-triggers are killed after they fire, so measure them unscrolled);
// WAIT=<ms> waits longer before evaluating.
// CDP replies are untyped JSON, so `any` is the honest type here.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { tmpdir } from 'node:os'
const [url, width, expr, shot, selector] = process.argv.slice(2)
// Fresh port + profile per run, so a leftover browser can never be reused.
const port = 9400 + Math.floor(Math.random() * 500)
const profile = tmpdir() + '/cdp-prof-' + port
const chrome = Bun.spawn([
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=' + port,
  '--user-data-dir=' + profile, 'about:blank',
], { stderr: 'ignore' })
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

await send('Emulation.setDeviceMetricsOverride', { width: +width, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url })
await Bun.sleep(2500)
// Scroll through the page so every once-on-scroll timeline fires, then let them finish.
if (!process.env.NOSCROLL) await send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight)' })
if (!process.env.NOSCROLL) await Bun.sleep(3000)
if (process.env.WAIT) await Bun.sleep(+process.env.WAIT)
const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })
console.log(JSON.stringify(res.result.value, null, 1))
if (shot) {
  const box = (await send('Runtime.evaluate', {
    expression: `(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return { x: 0, y: r.top + scrollY - 40, width: innerWidth, height: r.height + 330 } })()`,
    returnByValue: true,
  })).result.value
  const img = await send('Page.captureScreenshot', { clip: { ...box, scale: 1 }, captureBeyondViewport: true })
  await Bun.write(shot, Buffer.from(img.data, 'base64'))
  console.log('saved', shot)
}
ws.close()
chrome.kill()
await chrome.exited
await Bun.$`rm -rf ${profile}`.quiet()
