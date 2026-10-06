import { type CSSProperties, useRef } from 'react'
import type { IconType } from 'react-icons'
import {
  SiCss,
  SiEslint,
  SiExpress,
  SiGit,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiLinux,
  SiNodedotjs,
  SiPostgresql,
  SiPrettier,
  SiPrisma,
  SiReact,
  SiReacthookform,
  SiReactquery,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
  SiVitest,
  SiZod,
} from 'react-icons/si'
import { identity, story, toolkit } from '../content'
import { gsap, playOnceInView, useGSAP } from '../lib/gsap'
import { noBreakHyphens } from '../lib/noBreakHyphens'
import Container from './Container'

// Toolkit names → Simple Icons, each with its brand colour (Simple Icons' hex, shown on
// hover only) and a small move. Kept here, not in content.ts, because an icon is
// presentation, not a fact. A name with no entry (REST) just shows its label.
// Colours under 3:1 on the paper are darkened (same hue) until they reach it; those
// are marked with the original hex.
// motion-safe: so with reduced motion only the colour changes.
const LIFT = 'duration-200 motion-safe:group-hover:-translate-y-0.5'
// React and Tailwind make the footer's moves, so the two places match.
const SPIN = 'duration-400 motion-safe:group-hover:rotate-360'
const SHIFT = 'duration-400 motion-safe:group-hover:translate-x-0.75'

const MARKS: Record<string, { Icon: IconType; brand: string; move: string }> = {
  React: { Icon: SiReact, brand: '#4499B0', move: SPIN }, // #61DAFB
  TypeScript: { Icon: SiTypescript, brand: '#3178C6', move: LIFT },
  JavaScript: { Icon: SiJavascript, brand: '#9F9013', move: LIFT }, // #F7DF1E
  Redux: { Icon: SiRedux, brand: '#764ABC', move: LIFT },
  'Tailwind CSS': { Icon: SiTailwindcss, brand: '#059CB5', move: SHIFT }, // #06B6D4
  HTML5: { Icon: SiHtml5, brand: '#E34F26', move: LIFT },
  CSS3: { Icon: SiCss, brand: '#663399', move: LIFT },
  'React Hook Form': { Icon: SiReacthookform, brand: '#EC5990', move: LIFT },
  GraphQL: { Icon: SiGraphql, brand: '#E10098', move: LIFT },
  'TanStack Query': { Icon: SiReactquery, brand: '#FF4154', move: LIFT },
  Zod: { Icon: SiZod, brand: '#408AFF', move: LIFT },
  'Node.js': { Icon: SiNodedotjs, brand: '#5E9E4D', move: LIFT }, // #5FA04E
  Express: { Icon: SiExpress, brand: '#0A0A0A', move: LIFT },
  PostgreSQL: { Icon: SiPostgresql, brand: '#4169E1', move: LIFT },
  Prisma: { Icon: SiPrisma, brand: '#2D3748', move: LIFT },
  JWT: { Icon: SiJsonwebtokens, brand: '#000000', move: LIFT },
  Git: { Icon: SiGit, brand: '#F03C2E', move: LIFT },
  Vite: { Icon: SiVite, brand: '#9135FF', move: LIFT },
  Vitest: { Icon: SiVitest, brand: '#00A44B', move: LIFT }, // #00FF74
  ESLint: { Icon: SiEslint, brand: '#4B32C3', move: LIFT },
  Prettier: { Icon: SiPrettier, brand: '#B4872D', move: LIFT }, // #F7B93E
  Linux: { Icon: SiLinux, brand: '#AF8A19', move: LIFT }, // #FCC624
  Vercel: { Icon: SiVercel, brand: '#000000', move: LIFT },
}

/** Who I am and why I work the way I do, then the toolkit. The story is static; each
 *  toolkit group's icons appear one after another the first time it scrolls into view
 *  (once). Reduced motion: they're simply there. */
function About() {
  const { photo } = identity
  const toolkitRef = useRef<HTMLDListElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // One paused timeline per group, played by that group's own trigger, with the
        // footer's stagger. playOnceInView's watchdog makes sure none stay hidden.
        const cleanups = gsap.utils.toArray<HTMLElement>('.toolkit-group').map((group) => {
          const tl = gsap.timeline({ paused: true }).from(group.querySelectorAll('.toolkit-icon'), {
            autoAlpha: 0,
            duration: 0.3,
            stagger: 0.12,
            ease: 'power2.out',
          })
          return playOnceInView(group, tl)
        })
        return () => cleanups.forEach((cleanup) => cleanup())
      })
    },
    { scope: toolkitRef },
  )

  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-14 py-16">
      <Container>
        <h2 id="about-heading" className="font-display text-3xl text-ink sm:text-4xl">
          About
        </h2>

        {/* Photo first in the DOM, so on mobile it sits above the story; on md+ the grid
            moves it into the right-hand column. */}
        <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_13rem] md:gap-12">
          <img
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className="h-auto w-3/5 max-w-52 border border-ink/15 md:col-start-2 md:row-start-1 md:w-full md:max-w-none"
          />
          <div className="flex max-w-[65ch] flex-col gap-5 text-lg leading-relaxed text-ink md:col-start-1 md:row-start-1">
            {story.map((paragraph) => (
              <p key={paragraph}>{noBreakHyphens(paragraph)}</p>
            ))}
          </div>
        </div>

        <h3 className="mt-16 font-display text-2xl text-ink">Toolkit</h3>
        <dl ref={toolkitRef} className="mt-4 grid gap-x-6 gap-y-4 font-mono text-sm sm:grid-cols-[10rem_1fr]">
          {toolkit.map((group) => (
            <div key={group.label} className="contents">
              <dt className="text-ink-muted sm:pt-0.5">{group.label}</dt>
              <dd className="toolkit-group mb-2 sm:mb-0">
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-ink">
                  {group.items.map((item) => {
                    const mark = MARKS[item]
                    return (
                      // group: hovering the item (icon or label) colours and moves its
                      // icon. Not a link or button, so no pointer cursor.
                      <li
                        key={item}
                        style={mark && ({ '--brand': mark.brand } as CSSProperties)}
                        className="group flex items-center gap-2"
                      >
                        {mark && (
                          <mark.Icon
                            aria-hidden="true"
                            className={
                              'toolkit-icon size-4 shrink-0 transition-[color,translate,rotate] ' +
                              'group-hover:text-(--brand) ' +
                              mark.move
                            }
                          />
                        )}
                        {item}
                      </li>
                    )
                  })}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}

export default About
