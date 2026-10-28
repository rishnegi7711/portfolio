// Dev-only: renders the link-preview image (1200×630) with the site's fonts and colours,
// screenshotted by headless Chrome. Not part of the site build. Needs Google Chrome
// installed at the macOS default path.
//
//   bun scripts/og-image.tsx [out-file]      # default: public/og.png
//
// The role line, the circled phrase and the name come from src/content.ts, so the image
// can't drift from the hero. Re-run it whenever identity.heroRole or heroMark changes.
// Rendered at 2x and downscaled (see lib/render-card.ts), so the text edges stay clean.
import { join, resolve } from 'node:path'
import { identity } from '../src/content'
import { LOOP_PATH } from '../src/lib/penLoop'
import { fontLinks, renderCard, root, token } from './lib/render-card'

const out = resolve(process.argv[2] ?? join(root, 'public/og.png'))

const markStart = identity.heroRole.indexOf(identity.heroMark)
if (markStart === -1) throw new Error('identity.heroMark is not inside identity.heroRole')
const before = identity.heroRole.slice(0, markStart).trim()

const html = `<!doctype html><meta charset="utf-8">${fontLinks}
<style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: ${token('paper')}; color: ${token('ink')}; }
  main { position: absolute; left: 80px; top: 112px; }
  h1 { font: 400 126px/1 'Newsreader Variable', serif; margin: 0; }
  /* 2x the hero's text-3xl role line, so it reads at feed size */
  .role { font: 400 60px/1.55 'Newsreader Variable', serif; margin: 34px 0 0; }
  .mark { position: relative; display: inline-block; color: ${token('accent')}; white-space: nowrap; }
  /* the hero's -inset-x-3 / -inset-y-2, doubled */
  .mark svg { position: absolute; left: -24px; top: -16px; width: calc(100% + 48px); height: calc(100% + 32px); overflow: visible; }
  .site { position: absolute; left: 80px; top: 553px; font: 20px 'Fragment Mono', monospace; color: ${token('ink-muted')}; }
</style>
<main>
  <h1>${identity.name}</h1>
  <p class="role">${before}<br><span class="mark">${identity.heroMark}<svg viewBox="0 0 200 60" preserveAspectRatio="none"><path
    d="${LOOP_PATH}" fill="none" stroke="${token('accent-muted')}" stroke-width="3"
    stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg></span></p>
</main>
<div class="site">rishinegi.com</div>`

await renderCard(html, out, 1200, 630, { supersample: 2 })
