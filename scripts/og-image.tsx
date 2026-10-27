// Dev-only: renders the link-preview image (1200×630) with the site's fonts and colours,
// screenshotted by headless Chrome. Not part of the site build. Needs Google Chrome
// installed at the macOS default path.
//
//   bun scripts/og-image.tsx [out-file]      # default: public/og.png
//
// The role line, the circled phrase and the name come from src/content.ts, so the image
// can't drift from the hero. Re-run it whenever identity.heroRole or heroMark changes.
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { identity } from '../src/content'

const root = resolve(import.meta.dir, '..')
const out = resolve(process.argv[2] ?? join(root, 'public/og.png'))
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// Colours come from the site's tokens, so the image can't drift from them.
const css = readFileSync(join(root, 'src/index.css'), 'utf8')
const token = (name: string) => css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]+)`, 'i'))![1]

// The hero's pen loop (LOOP_PATH in src/components/Hero.tsx), stretched over the phrase.
const loopPath =
  'M 170 5 C 128 0, 60 3, 24 8 C 10 11, 9 26, 11 41 C 14 55, 46 60, 100 58 ' +
  'C 152 57, 192 52, 197 34 C 201 18, 193 4, 158 2 C 142 1, 126 2, 110 5'

const markStart = identity.heroRole.indexOf(identity.heroMark)
if (markStart === -1) throw new Error('identity.heroMark is not inside identity.heroRole')
const before = identity.heroRole.slice(0, markStart).trim()

const fonts = ['@fontsource-variable/newsreader', '@fontsource/fragment-mono']
  .map((pkg) => `<link rel="stylesheet" href="file://${root}/node_modules/${pkg}/index.css">`)
  .join('')

const html = `<!doctype html><meta charset="utf-8">${fonts}
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
    d="${loopPath}" fill="none" stroke="${token('accent-muted')}" stroke-width="3"
    stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg></span></p>
</main>
<div class="site">rishinegi.com</div>`

// file:// page so the Fontsource CSS can load its font files from node_modules.
const dir = mkdtempSync(join(tmpdir(), 'og-'))
const page = join(dir, 'og.html')
await Bun.write(page, html)
await Bun.$`${chrome} --headless=new --allow-file-access-from-files --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=3000 --user-data-dir=${dir}/profile --screenshot=${out} file://${page}`.quiet()
rmSync(dir, { recursive: true })
console.log('saved', out)
