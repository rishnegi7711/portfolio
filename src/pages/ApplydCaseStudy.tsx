import Container from '../components/Container'
import { usePageMeta } from '../lib/usePageMeta'

// Placeholder: the real page is built in the later case-study steps.
function ApplydCaseStudy() {
  usePageMeta(
    'Applyd case study | Rishi Negi',
    'How I built Applyd, a job application tracker, by hand and then with Claude Code.',
  )

  return (
    <article className="py-16">
      <Container>
        <a
          href="/#work"
          className={
            'inline-block py-3 -my-3 font-mono text-sm text-ink-muted underline ' +
            'decoration-accent-muted underline-offset-4 transition-colors hover:text-ink ' +
            'hover:decoration-accent focus-visible:outline focus-visible:outline-2 ' +
            'focus-visible:outline-accent'
          }
        >
          Back to work
        </a>
        <h1 className="mt-8 font-display text-4xl text-ink sm:text-5xl">Applyd case study</h1>
        <p className="mt-4 max-w-[65ch] text-lg text-ink-muted">In progress.</p>
      </Container>
    </article>
  )
}

export default ApplydCaseStudy
