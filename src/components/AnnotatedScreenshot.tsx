import { useRef } from 'react'
import type { AnnotatedFigure } from '../content'
import { gsap, playOnceInView, useGSAP } from '../lib/gsap'
import { LOOP_PATH } from '../lib/penLoop'
import { noBreakHyphens } from '../lib/noBreakHyphens'

type AnnotatedScreenshotProps = {
  figure: AnnotatedFigure
  /** the figure's number on the page */
  number: number
}

/** A screenshot with numbered pen circles over it and a note for each below. The first
 *  time it scrolls into view the circles draw in one after another, each with its number
 *  (~1.4s, once). The overlay is hidden from assistive technology: the alt text and the
 *  numbered notes carry the meaning. Reduced motion: the circles are simply there. */
function AnnotatedScreenshot({ figure, number }: AnnotatedScreenshotProps) {
  const figureRef = useRef<HTMLElement>(null)
  const { view } = figure

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Paused, so fromTo()/from() only apply their hidden start state (from JS) until
        // playOnceInView plays it. pathLength={1}: a dash of 1 offset by 1 is hidden,
        // offset 0 is drawn; autoRound: false, or the offset jumps 1 → 0.
        const tl = gsap
          .timeline({ paused: true })
          .fromTo(
            '.pen-circle',
            { strokeDasharray: '1 1', strokeDashoffset: 1 },
            { strokeDashoffset: 0, autoRound: false, duration: 0.7, ease: 'power2.inOut', stagger: 0.35 },
          )
          .from('.pen-number', { autoAlpha: 0, duration: 0.3, ease: 'power2.out', stagger: 0.35 }, 0)
        return playOnceInView(figureRef.current, tl)
      })
    },
    { scope: figureRef },
  )

  return (
    <figure ref={figureRef}>
      <div className="relative border border-ink/15">
        <img
          src={figure.src}
          width={figure.width}
          height={figure.height}
          alt={figure.alt}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
        {/* The circles live in the screenshot's own CSS px, so they scale with it. */}
        <svg
          viewBox={`0 0 ${view.width} ${view.height}`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-accent"
        >
          {figure.marks.map(({ circle }, i) => (
            <path
              key={i}
              className="pen-circle"
              d={LOOP_PATH}
              // The loop is drawn in a 200×60 box; stretch it over this circle's box. A
              // non-scaling stroke keeps the line the same width at any size.
              transform={`translate(${circle.x} ${circle.y}) scale(${circle.w / 200} ${circle.h / 60})`}
              pathLength={1}
              vectorEffect="non-scaling-stroke"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </svg>
        {/* Numbers are HTML, not SVG text, so they stay a readable size however far the
            screenshot is scaled down. */}
        {figure.marks.map(({ number: at }, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="pen-number absolute flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent-muted bg-paper font-mono text-[11px] leading-none text-accent"
            style={{ left: `${(at.x / view.width) * 100}%`, top: `${(at.y / view.height) * 100}%` }}
          >
            {i + 1}
          </span>
        ))}
      </div>
      <figcaption className="mt-2 font-mono text-xs text-ink-muted">
        Fig. {number} — {figure.caption}
      </figcaption>
      <ol role="list" className="mt-6 grid gap-5 md:grid-cols-3 md:gap-8">
        {figure.marks.map(({ note }, i) => (
          <li key={i} className="flex gap-3 font-mono text-sm leading-snug text-accent">
            <span
              aria-hidden="true"
              className="flex size-5 shrink-0 items-center justify-center rounded-full border border-accent-muted text-[11px] leading-none"
            >
              {i + 1}
            </span>
            <span>{noBreakHyphens(note)}</span>
          </li>
        ))}
      </ol>
    </figure>
  )
}

export default AnnotatedScreenshot
