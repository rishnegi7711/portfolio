import { useRef } from 'react'
import { experience, type ExperienceEntry, type Point } from '../content'
import { gsap, playOnceInView, ScrollTrigger, useGSAP } from '../lib/gsap'
import Container from './Container'
import MarginNote from './MarginNote'
import PenMark from './PenMark'

// The line starts at the first tick (top-4). x = 0.75 is the middle of a 1.5px stroke
// at the column's left edge, where the ticks meet it.
const LINE_TOP = 16
const LINE_X = 0.75

/** Straight down, except one out-and-back swerve of `bulge` px to the right, 64px tall
 *  and centred on `apex`: two curves, out then back, each easing in and out. */
function swervePath(height: number, apex: number, bulge: number) {
  const x = LINE_X
  const out = x + bulge
  return (
    `M ${x} 0 V ${apex - 32} ` +
    `C ${x} ${apex - 16}, ${out} ${apex - 16}, ${out} ${apex} ` +
    `C ${out} ${apex + 16}, ${x} ${apex + 16}, ${x} ${apex + 32} V ${height}`
  )
}

const strokeProps = {
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  fill: 'none',
} as const

/** The timeline as a reading-progress line: as you scroll, a pen nib travels down it and
 *  draws the line behind it (the site's only scroll-linked animation). At the switch to
 *  frontend the line swerves out and back once, and the nib rides through the swerve.
 *
 *  Sync: the scrub runs from the line's top reaching 75% of the viewport to its bottom
 *  reaching 75%, so the nib's target is always wherever the line crosses that 75% mark.
 *  Every other trigger here (ticks, highlights, the margin note) is playOnceInView, which
 *  also fires at "top 75%" — i.e. exactly when the nib's target reaches that element. */
function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const timeline = timelineRef.current
      const svg = timeline?.querySelector<SVGSVGElement>('.timeline-line')
      const path = svg?.querySelector('path')
      if (!timeline || !svg || !path) return

      // An SVG can't stretch between top and bottom like a div, so its height and the
      // swerve's position are measured, then written straight onto the SVG (not React
      // state: ScrollTrigger needs the new path synchronously, before it re-measures).
      function layoutLine() {
        if (!timeline || !svg || !path) return
        const height = timeline.offsetHeight - LINE_TOP
        // The swerve's apex sits level with the note's arrow, so the arrow always points
        // at it. A difference of two rects, so scroll position doesn't matter.
        const arrow = timeline.querySelector('.margin-note-arrow')?.closest('svg')
        const box = arrow?.getBoundingClientRect()
        const apex = box ? box.top + box.height / 2 - svg.getBoundingClientRect().top : height / 2
        const bulge = window.matchMedia('(min-width: 768px)').matches ? 20 : 12
        svg.setAttribute('height', String(height))
        svg.setAttribute('width', String(bulge + 2))
        svg.setAttribute('viewBox', `0 0 ${bulge + 2} ${height}`)
        path.setAttribute('d', swervePath(height, apex, bulge))
      }
      layoutLine()

      // Re-layout before every ScrollTrigger refresh (resize, fonts, lazy images), so the
      // scrub below re-reads an up-to-date path. The observer covers reduced motion,
      // where no ScrollTriggers exist to refresh.
      ScrollTrigger.addEventListener('refreshInit', layoutLine)
      const observer = new ResizeObserver(layoutLine)
      observer.observe(timeline)

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The nib only exists while motion runs (matchMedia undoes this set otherwise).
        gsap.set('.timeline-nib', { display: 'block' })

        // Line and nib share one playhead (same start, same length, linear in path
        // length), so the nib is always at the line's drawn end. scrub: 0.5 smooths the
        // playhead's catch-up. invalidateOnRefresh re-reads the path after a re-layout.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: svg,
              start: 'top 75%',
              end: 'bottom 75%',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            path,
            { strokeDasharray: '1 1', strokeDashoffset: 1 },
            { strokeDashoffset: 0, autoRound: false, ease: 'none' },
            0,
          )
          .to(
            '.timeline-nib',
            { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, ease: 'none' },
            0,
          )
      })

      return () => {
        ScrollTrigger.removeEventListener('refreshInit', layoutLine)
        observer.disconnect()
      }
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
          {/* top-4: starts at the first tick. Its height and path are set by layoutLine. */}
          <svg
            aria-hidden="true"
            className="timeline-line absolute top-4 left-0 overflow-visible text-accent-muted"
          >
            <path pathLength={1} {...strokeProps} strokeLinecap="butt" />
          </svg>
          <div
            aria-hidden="true"
            className="timeline-nib absolute top-0 left-0 hidden size-[7px] rounded-full bg-accent"
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
      {/* 0.25s: the trigger fires when the nib's target passes, and the smoothed nib
          itself arrives a moment later (scrub: 0.5). */}
      <PenMark kind="highlight" delay={0.25}>
        {metric}
      </PenMark>
      {after}
    </>
  )
}

export default Experience
