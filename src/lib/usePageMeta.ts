import { useEffect } from 'react'

/** Sets the tab title (and, if given, the meta description) for one page, and puts the
 *  previous values back when the page unmounts. index.html carries the home page's, which
 *  is also what link previews and crawlers that don't run JavaScript read. React 19 can
 *  hoist <title> and <meta> from a component, but it adds them beside index.html's rather
 *  than replacing them, which leaves two descriptions on the page. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousTitle = document.title
    const previousDescription = meta?.content

    document.title = title
    if (meta && description) meta.content = description

    return () => {
      document.title = previousTitle
      if (meta && previousDescription !== undefined) meta.content = previousDescription
    }
  }, [title, description])
}
