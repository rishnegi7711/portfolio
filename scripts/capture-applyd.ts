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
import { join, resolve } from 'node:path'
import { boardReady, openDemo } from './lib/applyd-demo'

const outDir = resolve(import.meta.dir, '../public/job-tracker')
const { evaluate, waitFor, setTheme, openApplication, send, close } = await openDemo({
  deviceScaleFactor: 2,
  reducedMotion: true,
})

/** Saves the current viewport as a PNG, after letting the page settle. */
async function shot(name: string) {
  await Bun.sleep(1200)
  const img = await send('Page.captureScreenshot', { format: 'png' })
  const file = join(outDir, name + '.png')
  await Bun.write(file, Buffer.from(img.data, 'base64'))
  console.log('saved', file)
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

/** A region of a screenshot, in the PNG's own pixels. */
type Crop = { x: number; y: number; w: number; h: number }

/** Re-encodes a PNG as WebP, cropped to `crop` (default: the whole image) and scaled to
 *  `width`. Done in the page with a canvas, because no WebP encoder is installed. */
async function exportWebp(png: string, webp: string, width: number, crop?: Crop) {
  const b64 = Buffer.from(await Bun.file(join(outDir, png)).arrayBuffer()).toString('base64')
  const data = await evaluate(`(async () => {
    const img = new Image()
    img.src = 'data:image/png;base64,${b64}'
    await img.decode()
    const c = ${JSON.stringify(crop ?? null)} ?? { x: 0, y: 0, w: img.width, h: img.height }
    const canvas = document.createElement('canvas')
    canvas.width = ${width}
    canvas.height = Math.round((c.h * ${width}) / c.w)
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, c.x, c.y, c.w, c.h, 0, 0, canvas.width, canvas.height)
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
  await Bun.sleep(500)
  await shot('paper-detail-light')
  console.log('detail boxes (CSS px):', JSON.stringify(await measure({ emptyNotes: '[class*="border-dashed"]' })))
  await setTheme('dark')
  await shot('paper-detail-dark')
  await evaluate('history.back()')
  await waitFor(boardReady, 'the board again')
  await shot('paper-board-dark')

  // WebPs. The slider and the theme figure need text readable at column width, so the board
  // is cropped tight: the header plus the first three columns at exactly 2:1. Below sm the
  // column is ~343px, which would shrink three columns to ~5px text, so there is also a
  // square crop of the header plus the first column. The old dark board gets identical
  // crops, so before and after line up. Crop edges sit in the gutters between columns in
  // both layouts (x ≈ 1015-1032 after column 3, short of the theme toggle at 1021;
  // x ≈ 405-415 after column 1). The values are CSS px x 2, because the PNGs are 2x.
  await send('Page.navigate', { url: 'about:blank' })
  const WIDE: Crop = { x: 160, y: 0, w: 1876, h: 938 } // CSS px x 80-1018, y 0-469
  const NARROW: Crop = { x: 160, y: 0, w: 660, h: 660 } // CSS px x 80-410, y 0-330
  const SLIDER_WIDTH = 1792 // 2x the 896px content column
  const MOBILE_WIDTH = 686 // 2x a 343px column (a 375px screen less its gutters)
  await exportWebp('board.png', 'board-before.webp', SLIDER_WIDTH, WIDE)
  await exportWebp('board.png', 'board-before-mobile.webp', MOBILE_WIDTH, NARROW)
  for (const theme of ['light', 'dark']) {
    await exportWebp(`paper-board-${theme}.png`, `board-paper-${theme}.webp`, SLIDER_WIDTH, WIDE)
    await exportWebp(`paper-board-${theme}.png`, `board-paper-${theme}-mobile.webp`, MOBILE_WIDTH, NARROW)
    // The enlarged view: the full-width board, without the empty space below the columns.
    await exportWebp(`paper-board-${theme}.png`, `board-paper-${theme}-full.webp`, 2874, { x: 0, y: 0, w: 2874, h: 880 })
    await exportWebp(`paper-detail-${theme}.png`, `detail-paper-${theme}.webp`, SLIDER_WIDTH)
    await exportWebp(`paper-detail-${theme}.png`, `detail-paper-${theme}-full.webp`, 2874)
  }
}

await close()
