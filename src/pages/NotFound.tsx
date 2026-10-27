import Container from '../components/Container'
import { usePageMeta } from '../lib/usePageMeta'

/** Any address the site doesn't have. A plain <a>, not a router Link, so home loads fresh. */
function NotFound() {
  usePageMeta('Page not found | Rishi Negi')

  return (
    <section className="py-24">
      <Container>
        <h1 className="font-display text-4xl text-ink">Page not found</h1>
        <p className="mt-4 text-lg text-ink">
          There is nothing at this address.{' '}
          <a
            href="/"
            className={
              'underline decoration-accent-muted underline-offset-4 transition-colors ' +
              'hover:decoration-accent focus-visible:outline focus-visible:outline-2 ' +
              'focus-visible:outline-accent'
            }
          >
            Back to the home page
          </a>
        </p>
      </Container>
    </section>
  )
}

export default NotFound
