// Dev-only: renders the LinkedIn banner (1584×396) with the site's fonts, colours and
// Simple Icons marks, screenshotted by headless Chrome. Not part of the site build, and
// the PNGs are not committed. Needs Google Chrome installed at the macOS default path.
//
//   bun scripts/linkedin-banner.tsx [out-dir]      # default: ~/Desktop/social
//
// Writes linkedin-banner.png and linkedin-banner-check.png. The check image has the
// profile-photo circle and its no-go zone (x 0–440, y 160–396) shaded, and the safe
// area (x 560–1480) dashed, so you can see nothing important gets covered.
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import type { IconType } from 'react-icons'
import {
  SiClaude,
  SiExpress,
  SiFigma,
  SiGsap,
  SiJenkins,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from 'react-icons/si'
import { identity } from '../src/content'

const out = resolve(process.argv[2] ?? join(homedir(), 'Desktop/social'))
const root = resolve(import.meta.dir, '..')
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// Colours come from the site's tokens, so the banner can't drift from them.
const css = readFileSync(join(root, 'src/index.css'), 'utf8')
const token = (name: string) => css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]+)`, 'i'))![1]

// Two even rows of six (12 don't fit one row inside the safe area).
const icons: [IconType, string][] = [
  [SiReact, 'React'],
  [SiTypescript, 'TypeScript'],
  [SiTailwindcss, 'Tailwind CSS'],
  [SiVite, 'Vite'],
  [SiNodedotjs, 'Node.js'],
  [SiExpress, 'Express'],
  [SiPostgresql, 'PostgreSQL'],
  [SiPrisma, 'Prisma'],
  [SiGsap, 'GSAP'],
  [SiClaude, 'Claude Code'],
  [SiFigma, 'Figma'],
  [SiJenkins, 'Jenkins'],
]
const iconRow = icons
  .map(([Icon, label]) => `<span>${renderToStaticMarkup(<Icon aria-hidden />)}${label}</span>`)
  .join('')

// The site's domain without the www (rishinegi.com redirects there).
const site = 'rishinegi.com'

const fonts = ['@fontsource-variable/newsreader', '@fontsource/fragment-mono']
  .map((pkg) => `<link rel="stylesheet" href="file://${root}/node_modules/${pkg}/index.css">`)
  .join('')

const page = (check: boolean) => `<!doctype html><meta charset="utf-8">${fonts}
<style>
  html, body { margin: 0; width: 1584px; height: 396px; overflow: hidden; background: ${token('paper')}; color: ${token('ink')}; }
  main { position: absolute; left: 560px; width: 920px; top: 0; height: 396px; box-sizing: border-box;
         padding: 0 16px; display: flex; flex-direction: column; justify-content: center; }
  h1 { font: 400 72px/1.1 'Newsreader Variable', serif; margin: 0; position: relative; width: max-content; }
  /* PenMark's underline stroke (src/components/PenMark.tsx), stretched under the name */
  h1 svg { position: absolute; left: -2px; bottom: -12px; width: calc(100% + 4px); height: 10px; overflow: visible; }
  .role { font: 20px 'Fragment Mono', monospace; margin-top: 28px; }
  .icons { font: 14px 'Fragment Mono', monospace; margin-top: 22px;
           display: grid; grid-template-columns: repeat(6, auto); justify-content: start; gap: 10px 22px; }
  .icons span { display: flex; align-items: center; gap: 8px; }
  .icons svg { width: 17px; height: 17px; }
  .contact { font: 14px 'Fragment Mono', monospace; color: ${token('ink-muted')}; margin-top: 20px; }
  .zone { position: absolute; box-sizing: border-box; }
</style>
<main>
  <h1>${identity.name}<svg viewBox="0 0 100 8" preserveAspectRatio="none"><path
    d="M 1 5.5 C 22 3.5, 48 6.5, 72 4.5 C 84 3.8, 93 4.2, 99 2.5" fill="none"
    stroke="${token('accent-muted')}" stroke-width="2.5" stroke-linecap="round"
    vector-effect="non-scaling-stroke"/></svg></h1>
  <div class="role">Full-stack engineer · AI coding agents · London</div>
  <div class="icons">${iconRow}</div>
  <div class="contact">${site} · ${identity.email}</div>
</main>
${
  check
    ? `<div class="zone" style="left:0;top:160px;width:440px;height:236px;border:2px dotted #c00"></div>
       <div class="zone" style="left:60px;top:226px;width:340px;height:340px;border-radius:50%;background:#e8807888;border:2px solid #c00"></div>
       <div class="zone" style="left:560px;top:70px;width:920px;height:260px;border:2px dashed #c00"></div>`
    : ''
}`

// file:// page so the Fontsource CSS can load its font files from node_modules.
const dir = mkdtempSync(join(tmpdir(), 'banner-'))
for (const [name, check] of [['linkedin-banner', false], ['linkedin-banner-check', true]] as const) {
  const html = join(dir, `${name}.html`)
  await Bun.write(html, page(check))
  await Bun.$`${chrome} --headless=new --allow-file-access-from-files --hide-scrollbars --force-device-scale-factor=1 --window-size=1584,396 --virtual-time-budget=3000 --user-data-dir=${dir}/profile --screenshot=${join(out, name + '.png')} file://${html}`.quiet()
  console.log('saved', join(out, name + '.png'))
}
rmSync(dir, { recursive: true })
