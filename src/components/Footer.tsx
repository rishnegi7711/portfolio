import { type CSSProperties, useRef } from 'react'
import type { IconType } from 'react-icons'
import { SiClaude, SiGsap, SiReact, SiTailwindcss } from 'react-icons/si'
import { colophon } from '../content'
import { gsap, playOnceInView, useGSAP } from '../lib/gsap'
import Container from './Container'

// Presentation for each colophon entry, kept here like About's ICONS: the logo, its
// brand colour (Simple Icons' published hex, shown on hover/focus only), and one small
// move. motion-safe: so with reduced motion only the colour changes.
const MARKS: Record<string, { Icon: IconType; brand: string; move: string }> = {
  React: {
    Icon: SiReact,
    brand: '#61DAFB',
    move: 'motion-safe:group-hover:rotate-360 motion-safe:group-focus-visible:rotate-360',
  },
  Tailwind: {
    Icon: SiTailwindcss,
    brand: '#06B6D4',
    move: 'motion-safe:group-hover:translate-x-0.75 motion-safe:group-focus-visible:translate-x-0.75',
  },
  GSAP: {
    Icon: SiGsap,
    brand: '#0AE448',
    move: 'motion-safe:group-hover:-translate-y-0.75 motion-safe:group-focus-visible:-translate-y-0.75',
  },
  'Claude Code': {
    Icon: SiClaude,
    brand: '#D97757',
    move: 'motion-safe:group-hover:rotate-90 motion-safe:group-focus-visible:rotate-90',
  },
}

/** A quiet colophon. The first time it scrolls into view the four logos appear one after
 *  another (~0.7s, once). Reduced motion: they're simply there. */
function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Paused, so from() only applies its hidden start state (from JS) until
        // playOnceInView plays it; its watchdog makes sure they can't stay hidden.
        const tl = gsap.timeline({ paused: true }).from('.colophon-icon', {
          autoAlpha: 0,
          duration: 0.3,
          stagger: 0.12,
          ease: 'power2.out',
        })
        return playOnceInView(footerRef.current, tl)
      })
    },
    { scope: footerRef },
  )

  return (
    <footer ref={footerRef} className="border-t border-ink/10 py-8">
      <Container>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-ink-muted">
          Built with
          {colophon.map(({ label, url }) => {
            const { Icon, brand, move } = MARKS[label]
            return (
              // --brand is read by the icon's hover/focus colour class below.
              <a
                key={label}
                href={url}
                  style={{ '--brand': brand } as CSSProperties}
                  className={
                    'group inline-flex items-center gap-1.5 py-3 -my-3 underline ' +
                    'decoration-accent-muted underline-offset-4 transition-colors ' +
                    'hover:text-ink hover:decoration-accent focus-visible:outline ' +
                    'focus-visible:outline-2 focus-visible:outline-accent'
                  }
                >
                  <Icon
                    aria-hidden="true"
                    className={
                      'colophon-icon size-3.5 shrink-0 transition-[color,translate,rotate] ' +
                      'duration-400 group-hover:text-(--brand) group-focus-visible:text-(--brand) ' +
                      move
                    }
                  />
                  {label}
              </a>
            )
          })}
        </p>
      </Container>
    </footer>
  )
}

export default Footer
