import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { pageMeta } from './src/content.ts'

/** Escapes text for an HTML attribute value (or element text). */
const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

/** Finds the one tag matching `tag` (a regex, written to name its identifying attribute) and
 *  returns it, or fails the build: a tag that has quietly gone missing from index.html must
 *  never produce a page with the wrong preview. */
function findTag(html: string, tag: RegExp, label: string): string {
  const found = html.match(tag)
  if (!found) throw new Error(`page-previews: no ${label} tag found in the built index.html`)
  return found[0]
}

/** Replaces the value of `attribute` inside the tag that `tag` matches. */
function setAttribute(html: string, tag: RegExp, attribute: string, value: string, label: string) {
  const old = findTag(html, tag, label)
  const next = old.replace(new RegExp(`${attribute}="[^"]*"`), () => `${attribute}="${escapeHtml(value)}"`)
  return html.replace(old, () => next)
}

/** At the end of `vite build`, writes a copy of index.html for each extra page (just the Applyd
 *  case study for now) at dist/<path>/index.html, with that page's title, description,
 *  canonical and link-preview tags.
 *
 *  Why: Slack, LinkedIn, X and the like build a link preview from the raw HTML and don't run
 *  JavaScript, and every address on the site otherwise returns the home page's index.html, so
 *  they'd preview the case study as the home page. The copy is otherwise identical, down to
 *  the script and style links (absolute, so they work from the deeper path), so the app
 *  starts and routes exactly as it does from index.html. Vercel serves a real file before it
 *  applies the catch-all rewrite in vercel.json, so this one is used for /work/applyd and
 *  everything else still falls through to index.html.
 *
 *  It is not a prerender: the body is still the empty #root. */
function pagePreviews(): Plugin {
  let outDir = ''
  let publicDir: string | false = ''

  return {
    name: 'page-previews',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
      publicDir = config.publicDir
    },
    closeBundle() {
      const html = readFileSync(join(outDir, 'index.html'), 'utf8')

      // index.html hard-codes the home page's tags (crawlers need them in the raw HTML) and
      // pageMeta.home holds them for the app: stop the build if the two have drifted apart.
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1]
      const description = findTag(html, /<meta\s[^>]*?name="description"[^>]*>/, 'description').match(
        /content="([^"]*)"/,
      )?.[1]
      if (title !== pageMeta.home.title || description !== pageMeta.home.description) {
        throw new Error(
          "page-previews: index.html's title or description no longer matches pageMeta.home " +
            'in src/content.ts. Change both together.',
        )
      }

      // The domain is written down once, in index.html's own canonical.
      const origin = new URL(
        findTag(html, /<link\s[^>]*?rel="canonical"[^>]*>/, 'canonical').match(/href="([^"]*)"/)![1],
      ).origin

      for (const page of [pageMeta.applyd]) {
        if (publicDir && !existsSync(join(publicDir, page.ogImage))) {
          throw new Error(`page-previews: ${page.ogImage} is missing from public/ (run its script)`)
        }
        const url = origin + page.path
        let out = html
        out = out.replace(/<title>[^<]*<\/title>/, () => `<title>${escapeHtml(page.title)}</title>`)
        out = setAttribute(out, /<meta\s[^>]*?name="description"[^>]*>/, 'content', page.description, 'description')
        out = setAttribute(out, /<link\s[^>]*?rel="canonical"[^>]*>/, 'href', url, 'canonical')
        out = setAttribute(out, /<meta\s[^>]*?property="og:title"[^>]*>/, 'content', page.title, 'og:title')
        out = setAttribute(out, /<meta\s[^>]*?property="og:description"[^>]*>/, 'content', page.description, 'og:description')
        out = setAttribute(out, /<meta\s[^>]*?property="og:url"[^>]*>/, 'content', url, 'og:url')
        out = setAttribute(out, /<meta\s[^>]*?property="og:image"[^>]*>/, 'content', origin + page.ogImage, 'og:image')
        out = setAttribute(out, /<meta\s[^>]*?property="og:image:alt"[^>]*>/, 'content', page.ogImageAlt, 'og:image:alt')
        out = setAttribute(out, /<meta\s[^>]*?name="twitter:title"[^>]*>/, 'content', page.title, 'twitter:title')
        out = setAttribute(out, /<meta\s[^>]*?name="twitter:description"[^>]*>/, 'content', page.description, 'twitter:description')

        const dir = join(outDir, page.path)
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'index.html'), out)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), pagePreviews()],
})
