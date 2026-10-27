import { useEffect } from 'react'

/** Sets the tab title, and optionally the meta description and the canonical address, for
 *  one page, and puts the previous values back when the page unmounts. index.html carries the
 *  home page's, which is also what link previews and crawlers that don't run JavaScript
 *  read. React 19 can hoist <title> and <meta> from a component, but it adds them beside
 *  index.html's rather than replacing them, which leaves two descriptions on the page.
 *
 *  `path` is the page's own address (e.g. "/work/applyd"). Without it the canonical stays
 *  the home page's, which would tell search engines the page is a copy of home. It is
 *  resolved against index.html's canonical, so the domain is only written down once. */
export function usePageMeta(title: string, description?: string, path?: string) {
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const previousTitle = document.title
    const previousDescription = meta?.content
    const previousCanonical = canonical?.href

    document.title = title
    if (meta && description) meta.content = description
    if (canonical && path) canonical.href = new URL(path, canonical.href).href

    return () => {
      document.title = previousTitle
      if (meta && previousDescription !== undefined) meta.content = previousDescription
      if (canonical && previousCanonical !== undefined) canonical.href = previousCanonical
    }
  }, [title, description, path])
}
