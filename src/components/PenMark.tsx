import { useRef } from 'react'
import { gsap, playOnceInView, useGSAP } from '../lib/gsap'

// Authored pen strokes in a 100×8 box stretched over the text (like the hero loop).
// underline: a slight wave that lifts at the end, as if the pen came off the page.
// highlight: a broad marker pass through the text's lower half, slightly uneven.
const PATHS = {
  underline: 'M 1 5.5 C 22 3.5, 48 6.5, 72 4.5 C 84 3.8, 93 4.2, 99 2.5',
  highlight: 'M 1 4.6 C 25 3.9, 55 4.8, 80 4.1 C 90 3.9, 96 4.3, 99 3.8',
}

type PenMarkProps = {
  children: string
  /** "underline" is for links (the site's link signal); "highlight" marks non-link
   *  text, so it's never mistaken for one. */
  kind?: 'underline' | 'highlight'
  /** seconds after the trigger before the stroke starts drawing */
  delay?: number
  /** stroke colour (and hover colour) classes; the stroke uses currentColor */
  className?: string
}

/** Marks its text in pen, drawn left to right the first time it scrolls into view
 *  (once). The text is never hidden; only the stroke draws. Reduced motion: the stroke
 *  is simply there. Underline: Contact's email link. Highlight: Experience's metrics. */
function PenMark({
  children,
  kind = 'underline',
  delay = 0,
  className = 'text-accent-muted',
}: PenMarkProps) {
  const highlight = kind === 'highlight'
  const svgRef = useRef<SVGSVGElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // clearProps once drawn: with non-scaling-stroke, Chrome measures the dash in
      // screen px, so on a long stroke the dash's gap half would show through.
      const tl = gsap.timeline({ paused: true }).fromTo(
        svgRef.current?.querySelector('path') ?? null,
        { strokeDasharray: '1 1', strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          autoRound: false,
          duration: 0.4,
          ease: 'power2.out',
          clearProps: 'strokeDasharray,strokeDashoffset',
        },
        delay,
      )
      return playOnceInView(svgRef.current, tl)
    })
  })

  return (
    // nowrap: text split over two lines would leave the stroke under neither. isolate:
    // a stacking context, so the highlight's -z-10 sits behind the text, not the page.
    <span className="relative isolate whitespace-nowrap">
      {children}
      {/* Stretched under the text; non-scaling-stroke keeps it 1.5px at any width. */}
      <svg
        ref={svgRef}
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        aria-hidden="true"
        className={
          'pointer-events-none absolute overflow-visible ' +
          (highlight
            ? '-z-10 top-[0.3em] left-[0.25em] h-[0.6em] w-[calc(100%-0.5em)] '
            : '-inset-x-0.5 -bottom-1.5 h-2 w-[calc(100%+0.25rem)] ') +
          className
        }
      >
        {/* The highlight's width is in em (0.6em of the text), and translucent, like
            marker ink: the text stays ink on a pale wash, well above 4.5:1. Its box is
            inset 0.25em each side so the round caps (half the width) end at the text. */}
        <path
          d={PATHS[kind]}
          pathLength={1}
          vectorEffect="non-scaling-stroke"
          stroke="currentColor"
          strokeWidth={highlight ? '0.6em' : 1.5}
          strokeOpacity={highlight ? 0.3 : 1}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  )
}

export default PenMark
