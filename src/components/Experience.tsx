import { useRef } from 'react'
import { experience, type ExperienceEntry, type Point } from '../content'
import { gsap, playOnceInView, useGSAP } from '../lib/gsap'
import Container from './Container'
import MarginNote from './MarginNote'

// One authored pen stroke in a 100×8 box stretched under a metric (like the hero loop):
// a slight wave that lifts at the end, as if the pen came off the page.
const UNDERLINE_PATH = 'M 1 5.5 C 22 3.5, 48 6.5, 72 4.5 C 84 3.8, 93 4.2, 99 2.5'

const strokeProps = {
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  fill: 'none',
} as const

/** The timeline as a reading-progress line: as you scroll, a pen nib travels down it and
 *  draws the line behind it (the site's only scroll-linked animation).
 *
 *  Sync: the scrub runs from the line's top reaching 75% of the viewport to its bottom
 *  reaching 75%, so the nib's target is always wherever the line crosses that 75% mark.
 *  Every other trigger here (ticks, underlines, the margin note) is playOnceInView, which
 *  also fires at "top 75%" — i.e. exactly when the nib's target reaches that element. */
function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const line = timelineRef.current?.querySelector<HTMLElement>('.timeline-line')
        if (!line) return

        // The nib only exists while motion runs (matchMedia undoes this set otherwise).
        gsap.set('.timeline-nib', { display: 'block' })

        // Line and nib share one playhead (same start, same length, linear), so the nib
        // is always at the line's drawn end. scrub: 0.5 smooths the playhead's catch-up.
        // invalidateOnRefresh re-measures the nib's distance after a resize.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: line,
              start: 'top 75%',
              end: 'bottom 75%',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0)
          .fromTo('.timeline-nib', { y: 0 }, { y: () => line.offsetHeight, ease: 'none' }, 0)
      })
    },
    { scope: timelineRef },
  )

  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-14 py-16">
      <Container>
        <h2 id="experience-heading" className="font-display text-3xl text-ink sm:text-4xl">
          Experience
        </h2>
        <div ref={timelineRef} className="relative mt-10">
          {/* top-4: starts at the first tick. bottom-0: ends where the last entry's content
              ends (it has no bottom padding). A div stretches between top and bottom; an
              SVG wouldn't. The nib is centred on the line's top: (1.5px − 7px) / 2. */}
          <div
            aria-hidden="true"
            className="timeline-line absolute top-4 bottom-0 left-0 w-[1.5px] origin-top bg-accent-muted"
          />
          <div
            aria-hidden="true"
            className="timeline-nib absolute top-[calc(1rem-3.5px)] left-[-2.75px] hidden size-[7px] rounded-full bg-accent"
          />
          <ol>
            {experience.map((entry) => (
              <Entry key={entry.id} entry={entry} />
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}

/** One timeline entry: dates on the left, what happened on the right. Its tick draws
 *  when the nib reaches it. */
function Entry({ entry }: { entry: ExperienceEntry }) {
  const tickRef = useRef<SVGSVGElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Pen-stroke trick: pathLength={1}, so a dash of 1 offset by 1 is hidden and
      // offset 0 is drawn. Paused until playOnceInView plays it.
      const tl = gsap.timeline({ paused: true }).fromTo(
        tickRef.current?.querySelector('path') ?? null,
        { strokeDasharray: '1 1', strokeDashoffset: 1 },
        { strokeDashoffset: 0, autoRound: false, duration: 0.2, ease: 'power2.out' },
      )
      return playOnceInView(tickRef.current, tl)
    })
  })

  return (
    // pt-2 + half the dates' 1rem line height puts the tick 1rem down (top-4), level with
    // the middle of the heading's first line, and on the line.
    <li className="grid grid-cols-[6rem_minmax(0,1fr)] gap-x-4 pb-12 last:pb-0 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-x-8">
      <p className="relative pt-2 pl-4 font-mono text-xs leading-4 text-ink-muted">
        <svg
          ref={tickRef}
          viewBox="0 0 10 2"
          aria-hidden="true"
          className="absolute top-4 left-0 h-0.5 w-2.5 -translate-y-1/2 text-accent-muted"
        >
          <path d="M 0 1 H 10" pathLength={1} {...strokeProps} strokeLinecap="butt" />
        </svg>
        {entry.dates}
      </p>

      <div>
        <h3 className="font-display text-2xl text-ink">{entry.org}</h3>
        <p className="mt-1 font-mono text-xs text-ink-muted">
          {entry.place ? `${entry.role} · ${entry.place}` : entry.role}
        </p>
        {entry.points.length > 0 && (
          <ul className="mt-3 flex max-w-[65ch] list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-accent-muted">
            {entry.points.map((point) => (
              <li key={typeof point === 'string' ? point : point.join('')}>
                <PointText point={point} />
              </li>
            ))}
          </ul>
        )}
        {/* At the bottom of the entry, so the note sits at the boundary with the next
            (older) role, and its arrow points back at the line there. */}
        {entry.note && (
          <div className="mt-6">
            <MarginNote text={entry.note} pointsTo="line" />
          </div>
        )}
      </div>
    </li>
  )
}

function PointText({ point }: { point: Point }) {
  if (typeof point === 'string') return point
  const [before, metric, after] = point
  return (
    <>
      {before}
      <PenUnderline>{metric}</PenUnderline>
      {after}
    </>
  )
}

/** Underlines a metric in pen the first time the nib passes it (its own trigger, so
 *  each one draws on its own line of text). The text is never hidden; only the stroke
 *  draws. Reduced motion: the stroke is simply there. */
function PenUnderline({ children }: { children: string }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Starts 0.25s in: the trigger fires when the nib's target passes, and the smoothed
      // nib itself arrives a moment later (scrub: 0.5).
      const tl = gsap.timeline({ paused: true }).fromTo(
        svgRef.current?.querySelector('path') ?? null,
        { strokeDasharray: '1 1', strokeDashoffset: 1 },
        { strokeDashoffset: 0, autoRound: false, duration: 0.4, ease: 'power2.out' },
        0.25,
      )
      return playOnceInView(svgRef.current, tl)
    })
  })

  return (
    // nowrap: a metric split over two lines would leave the stroke under neither.
    <span className="relative whitespace-nowrap">
      {children}
      {/* Stretched under the word; non-scaling-stroke keeps it 1.5px at any width. */}
      <svg
        ref={svgRef}
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-0.5 -bottom-1.5 h-2 w-[calc(100%+0.25rem)] overflow-visible text-accent-muted"
      >
        <path d={UNDERLINE_PATH} pathLength={1} vectorEffect="non-scaling-stroke" {...strokeProps} />
      </svg>
    </span>
  )
}

export default Experience
