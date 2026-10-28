// Dev-only: renders the Applyd case study's link-preview image (1200×630) with the site's
// fonts and colours, screenshotted by headless Chrome. Not part of the site build. Needs
// Google Chrome installed at the macOS default path.
//
//   bun scripts/og-applyd.tsx [out-file]      # default: public/og-applyd.png
//
// The title and subtitle come from src/content.ts, so the image can't drift from the page.
// Re-run it whenever applydCaseStudy.title or .subtitle changes, or the board screenshot does.
// The board is cropped from the capture script's full-resolution PNG (public/job-tracker/
// paper-board-light.png, gitignored: run scripts/capture-applyd.ts first), and the card is
// rendered at 2x and downscaled, so the small text in the screenshot stays clean.
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { applydCaseStudy, pageMeta } from '../src/content'
import { fontLinks, renderCard, root, token } from './lib/render-card'

const out = resolve(process.argv[2] ?? join(root, 'public/og-applyd.png'))

const source = join(root, 'public/job-tracker/paper-board-light.png')
if (!existsSync(source)) {
  throw new Error('Missing ' + source + '. Run `bun scripts/capture-applyd.ts` to make it.')
}

// The crop of that screenshot (2874×1552, the live demo at 1437×776 and 2x): the header
// plus the first two columns, in source pixels. x 160-1436 is CSS px 80-718, which ends in
// the gutter between the second and third columns.
const SOURCE_WIDTH = 2874
const crop = { x: 160, y: 0, w: 1276, h: 820 }

// Where it sits on the card. The image is scaled so the crop fills the frame exactly.
const frame = { left: 590, top: 145, width: 530 }
const scale = frame.width / crop.w
const frameHeight = Math.round(crop.h * scale)

// PenMark's underline stroke (src/components/PenMark.tsx), stretched under the title.
const underline = 'M 1 5.5 C 22 3.5, 48 6.5, 72 4.5 C 84 3.8, 93 4.2, 99 2.5'

const html = `<!doctype html><meta charset="utf-8">${fontLinks}
<style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: ${token('paper')}; color: ${token('ink')}; }
  .text { position: absolute; left: 80px; top: 130px; width: 470px; }
  h1 { font: 400 132px/1 'Newsreader Variable', serif; margin: 0; position: relative; width: max-content; }
  /* PenMark's stroke, as in the LinkedIn banner */
  h1 svg { position: absolute; left: -2px; bottom: -14px; width: calc(100% + 4px); height: 12px; overflow: visible; }
  /* big enough to read at feed size, where the whole card is shown ~500px wide */
  .sub { font: 400 38px/1.3 'Newsreader Variable', serif; margin: 52px 0 0; }
  .board { position: absolute; left: ${frame.left}px; top: ${frame.top}px; width: ${frame.width}px; height: ${frameHeight}px;
           box-sizing: border-box; overflow: hidden; border: 1px solid ${token('ink')}33; background: ${token('paper-raised')}; }
  .board img { position: absolute; left: ${-crop.x * scale}px; top: ${-crop.y * scale}px; width: ${SOURCE_WIDTH * scale}px; display: block; }
  .site { position: absolute; left: 80px; top: 553px; font: 20px 'Fragment Mono', monospace; color: ${token('ink-muted')}; }
</style>
<div class="text">
  <h1>${applydCaseStudy.title}<svg viewBox="0 0 100 8" preserveAspectRatio="none"><path
    d="${underline}" fill="none" stroke="${token('accent-muted')}" stroke-width="3"
    stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg></h1>
  <p class="sub">${applydCaseStudy.subtitle}</p>
</div>
<div class="board"><img src="file://${source}" alt=""></div>
<div class="site">rishinegi.com${pageMeta.applyd.path}</div>`

await renderCard(html, out, 1200, 630, { supersample: 2 })
