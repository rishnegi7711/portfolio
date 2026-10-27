// Dev-only: headless Chrome, logged in to Applyd's live demo, shared by the capture and
// record scripts. Not part of the site build. Needs Google Chrome at the macOS default
// path. Read-only: it logs in with the public demo account and only looks.
// CDP replies are untyped JSON, so `any` is the honest type here.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { tmpdir } from 'node:os'

export const demo = 'https://job-tracker-steel-ten.vercel.app'
// The public demo account, also shown on the portfolio.
const email = 'testUser@test.com'
const password = 'Password7711'
const COLD_START = 90_000 // ms; the free Render backend can take up to a minute to wake

// The four status columns are h2s. (Not innerText: the app uppercases them with CSS.)
export const boardReady = `document.querySelectorAll('h2').length >= 4`

type Options = {
  /** 2 matches the original screenshots' 2874×1552 framing; 1 is enough for video */
  deviceScaleFactor: number
  /** stills want the final state; video wants the animations */
  reducedMotion: boolean
}

/** Opens headless Chrome at 1437×776, logs in through the demo's real form, and waits for
 *  the board. Call `close()` when done. */
export async function openDemo({ deviceScaleFactor, reducedMotion }: Options) {
  // Fresh port + profile per run, so a leftover browser can never be reused.
  const port = 9400 + Math.floor(Math.random() * 500)
  const profile = tmpdir() + '/applyd-prof-' + port
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
  const listeners = new Map<string, (params: any) => void>()
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data as string)
    if (msg.id !== undefined) pending.get(msg.id)?.(msg.result)
    else listeners.get(msg.method)?.(msg.params) // events, e.g. Page.screencastFrame
  }
  const send = (method: string, params = {}) =>
    new Promise<any>((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })) })
  const evaluate = async (expression: string) =>
    (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value
  /** Calls `handler` for each CDP event with this name. */
  const on = (method: string, handler: (params: any) => void) => listeners.set(method, handler)

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

  await send('Emulation.setDeviceMetricsOverride', { width: 1437, height: 776, deviceScaleFactor, mobile: false })
  if (reducedMotion) {
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  }
  await send('Page.enable')

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

  /** Uses the app's own Light / Dark toggle, so what we capture is what a visitor gets. */
  async function setTheme(theme: 'light' | 'dark') {
    await evaluate(`document.querySelector('label[title="${theme === 'light' ? 'Light' : 'Dark'}"]').click()`)
    await waitFor(`document.documentElement.classList.contains('dark') === ${theme === 'dark'}`, theme + ' theme')
    // A scripted click leaves the toggle focused, and its focus ring would show on screen.
    await evaluate('document.activeElement?.blur()')
  }

  /** Opens an application from the board by its company name (client-side navigation). */
  async function openApplication(company: string) {
    await evaluate(
      `[...document.querySelectorAll('a')].find((a) => a.textContent.includes(${JSON.stringify(company)})).click()`,
    )
    await waitFor(`location.pathname !== '/'`, 'the detail page')
  }

  async function close() {
    ws.close()
    chrome.kill()
    await chrome.exited
    await Bun.$`rm -rf ${profile}`.quiet()
  }

  return { send, evaluate, waitFor, on, setTheme, openApplication, close }
}
