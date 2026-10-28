// Dev-only: what the link-preview image scripts share. Not part of the site build. Needs
// Google Chrome installed at the macOS default path.
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

/** The repo root. */
export const root = resolve(import.meta.dir, '../..')

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// Colours come from the site's tokens, so an image can't drift from them.
const css = readFileSync(join(root, 'src/index.css'), 'utf8')
export const token = (name: string) =>
  css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]+)`, 'i'))![1]

/** <link>s for the display and mono faces, as file:// so the Fontsource CSS can load its font
 *  files from node_modules. */
export const fontLinks = ['@fontsource-variable/newsreader', '@fontsource/fragment-mono']
  .map((pkg) => `<link rel="stylesheet" href="file://${root}/node_modules/${pkg}/index.css">`)
  .join('')

/** Screenshots `html` at `width`×`height` with headless Chrome and writes a PNG to `out`. The
 *  page is loaded from a temporary file:// URL, so it can also point at local images.
 *
 *  `supersample` renders at that many times the size (device scale factor) and then
 *  downscales to `width`×`height` with macOS's `sips`, which resamples with a proper filter.
 *  Text and image edges come out smoother than a 1x render, and a scaled-down screenshot
 *  doesn't look choppy. The default, 1, is a plain render. */
export async function renderCard(
  html: string,
  out: string,
  width: number,
  height: number,
  { supersample = 1 }: { supersample?: number } = {},
) {
  const dir = mkdtempSync(join(tmpdir(), 'card-'))
  const page = join(dir, 'card.html')
  await Bun.write(page, html)
  const shot = supersample > 1 ? join(dir, 'big.png') : out
  await Bun.$`${chrome} --headless=new --allow-file-access-from-files --hide-scrollbars --force-device-scale-factor=${supersample} --window-size=${width},${height} --virtual-time-budget=3000 --user-data-dir=${dir}/profile --screenshot=${shot} file://${page}`.quiet()
  if (supersample > 1) await Bun.$`sips -z ${height} ${width} ${shot} --out ${out}`.quiet()
  rmSync(dir, { recursive: true })
  console.log('saved', out)
}
