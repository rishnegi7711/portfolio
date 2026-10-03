import { useRef } from 'react'
import { gsap, playOnceInView, useGSAP } from '../lib/gsap'

// One authored pen stroke in a 100×8 box stretched under the text (like the hero loop):
// a slight wave that lifts at the end, as if the pen came off the page.
const UNDERLINE_PATH = 'M 1 5.5 C 22 3.5, 48 6.5, 72 4.5 C 84 3.8, 93 4.2, 99 2.5'

type PenUnderlineProps = {
  children: string
  /** seconds after the trigger before the stroke starts drawing */
  delay?: number
  /** stroke colour (and hover colour) classes; the stroke uses currentColor */
  className?: string
}

/** Underlines its text in pen, drawn the first time it scrolls into view (once). The
 *  text is never hidden; only the stroke draws. Reduced motion: the stroke is simply
 *  there. Used for Experience's metrics and Contact's email address. */
function PenUnderline({ children, delay = 0, className = 'text-accent-muted' }: PenUnderlineProps) {
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
    // nowrap: text split over two lines would leave the stroke under neither.
    <span className="relative whitespace-nowrap">
      {children}
      {/* Stretched under the text; non-scaling-stroke keeps it 1.5px at any width. */}
      <svg
        ref={svgRef}
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        aria-hidden="true"
        className={
          'pointer-events-none absolute -inset-x-0.5 -bottom-1.5 h-2 w-[calc(100%+0.25rem)] ' +
          'overflow-visible ' +
          className
        }
      >
        <path
          d={UNDERLINE_PATH}
          pathLength={1}
          vectorEffect="non-scaling-stroke"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  )
}

export default PenUnderline
