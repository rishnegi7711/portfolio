import { identity, sections } from '../content'
import Container from './Container'

function Header() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50
          focus:rounded focus:bg-paper focus:px-3 focus:py-2 focus:font-mono focus:text-sm
          focus:text-ink focus:outline focus:outline-2 focus:outline-accent"
      >
        Skip to content
      </a>

      <header
        className="sticky top-0 z-40 border-b border-accent-muted/40 bg-paper"
      >
        {/* Below 375px the name and four links only fit inside the gutters with tighter
            gaps and tracking. */}
        <Container
          className="flex h-12 items-center justify-between gap-2 max-[374px]:gap-1
            max-[374px]:tracking-tight sm:gap-4"
        >
          <a
            href="#"
            aria-label="Back to top"
            className="inline-block shrink-0 py-3 -my-3 font-mono text-sm text-ink
              whitespace-nowrap focus-visible:outline focus-visible:outline-2
              focus-visible:outline-accent"
          >
            {identity.name}
          </a>

          <nav aria-label="Primary">
            {/* py-3.5 on the links keeps each tap target 44px tall. */}
            <ul className="flex items-center gap-2 font-mono text-xs max-[374px]:gap-1 sm:gap-5 sm:text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-block py-3.5 -my-3.5 text-ink-muted underline
                      decoration-accent-muted underline-offset-4 transition-colors
                      hover:text-ink hover:decoration-accent focus-visible:outline
                      focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </header>
    </>
  )
}

export default Header
