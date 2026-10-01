import { identity } from '../content'

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

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
        className="sticky top-0 z-40 border-b border-accent-muted/40 bg-paper/95
          backdrop-blur-sm"
      >
        <div
          className="mx-auto flex h-12 max-w-4xl items-center justify-between gap-2
            px-4 sm:gap-4 sm:px-6"
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
            <ul className="flex items-center gap-2 font-mono text-xs sm:gap-5 sm:text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-block py-3 -my-3 text-ink-muted underline
                      decoration-accent-muted underline-offset-4 transition-colors
                      hover:text-ink hover:decoration-accent focus-visible:outline
                      focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header
