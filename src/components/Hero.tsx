import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { identity } from '../content'

type ArrowGeometry = {
  path: string
  headStroke1: string
  headStroke2: string
  noteLeft: number
  containerWidth: number
  containerHeight: number
}

const ARROW_START_INSET = 10 // px into the note's top edge, so the line doesn't start exactly at its corner
const ARROWHEAD_LENGTH = 7 // px, each open-stroke wing
const ARROWHEAD_SPREAD = (26 * Math.PI) / 180 // angle between the two wings and the line
const WOBBLE = 6 // px of horizontal give in the curve's control points, for a hand-drawn feel

/** Measures the live position of the headline's "full‑stack" span, shifts the note
 *  to sit almost directly under it (clamped to the container's right edge so it can
 *  never overflow), and draws a short curve + open arrowhead between the two. Word
 *  position can't be predicted with CSS alone: at narrow widths "full‑stack" wraps
 *  to its own line at the LEFT edge, but at wider widths it sits at the RIGHT end
 *  of a long line — opposite positions for the same word, which only measuring the
 *  live layout can resolve. */
function useAnnotationArrow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLSpanElement>(null)
  const noteRef = useRef<HTMLParagraphElement>(null)
  const [geometry, setGeometry] = useState<ArrowGeometry | null>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    function measure() {
      const target = targetRef.current
      const note = noteRef.current
      if (!container || !target || !note) return

      const c = container.getBoundingClientRect()
      const t = target.getBoundingClientRect()
      const n = note.getBoundingClientRect()

      const desiredLeft = t.left - c.left
      const noteLeft = Math.max(0, Math.min(desiredLeft, c.width - n.width))

      const startX = noteLeft + ARROW_START_INSET
      const startY = n.top - c.top
      const endX = t.left - c.left + t.width / 2
      const endY = t.top - c.top + t.height

      const dx = endX - startX
      const dy = endY - startY
      const cp1x = startX + dx * 0.3 + WOBBLE
      const cp1y = startY + dy * 0.3
      const cp2x = startX + dx * 0.7 - WOBBLE
      const cp2y = startY + dy * 0.7

      const path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`

      // Open, hand-drawn arrowhead: two short strokes angled off the curve's own
      // tangent at its end point, instead of a filled marker triangle.
      const angle = Math.atan2(endY - cp2y, endX - cp2x)
      const wing = (sign: 1 | -1): [number, number] => {
        const a = angle + Math.PI - sign * ARROWHEAD_SPREAD
        return [endX + ARROWHEAD_LENGTH * Math.cos(a), endY + ARROWHEAD_LENGTH * Math.sin(a)]
      }
      const [w1x, w1y] = wing(1)
      const [w2x, w2y] = wing(-1)

      setGeometry({
        path,
        headStroke1: `M ${w1x} ${w1y} L ${endX} ${endY}`,
        headStroke2: `M ${w2x} ${w2y} L ${endX} ${endY}`,
        noteLeft,
        containerWidth: c.width,
        containerHeight: c.height,
      })
    }

    measure()
    // ResizeObserver catches the container changing size for any reason (viewport
    // resize, content reflow), not just a window resize event — see notes/field-notes.md.
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    document.fonts?.ready.then(measure)

    return () => observer.disconnect()
  }, [])

  return { containerRef, targetRef, noteRef, geometry }
}

function Hero() {
  const { containerRef, targetRef, noteRef, geometry } = useAnnotationArrow()
  const reduceMotion = useReducedMotion()
  const [beforeFullStack, fullStack] = splitOnFullStack(identity.heroRole)
  const city = identity.location.split(',')[0].trim()

  const linkStyle =
    'inline-block px-1 py-3 -my-3 underline decoration-accent-muted underline-offset-4 ' +
    'transition-colors hover:text-ink hover:decoration-accent focus-visible:outline ' +
    'focus-visible:outline-2 focus-visible:outline-accent'

  const strokeProps = {
    stroke: 'currentColor',
    strokeWidth: '1.5',
    strokeLinecap: 'round' as const,
    fill: 'none',
  }

  return (
    <section className="scroll-mt-14 px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
      <div ref={containerRef} className="relative isolate mx-auto flex max-w-4xl flex-col gap-6">
        {geometry && (
          <svg
            width={geometry.containerWidth}
            height={geometry.containerHeight}
            viewBox={`0 0 ${geometry.containerWidth} ${geometry.containerHeight}`}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 text-accent-muted"
          >
            <motion.path
              d={geometry.path}
              {...strokeProps}
              initial={reduceMotion ? false : { pathLength: 0 }}
              whileInView={reduceMotion ? undefined : { pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
            <motion.path
              d={geometry.headStroke1}
              {...strokeProps}
              initial={reduceMotion ? false : { pathLength: 0 }}
              whileInView={reduceMotion ? undefined : { pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.12, delay: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
            />
            <motion.path
              d={geometry.headStroke2}
              {...strokeProps}
              initial={reduceMotion ? false : { pathLength: 0 }}
              whileInView={reduceMotion ? undefined : { pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.12, delay: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
            />
          </svg>
        )}

        <div>
          <h1 className="font-display text-5xl leading-tight text-ink sm:text-6xl">
            {identity.name}
          </h1>
          <p className="mt-2 max-w-xl font-display text-2xl leading-snug text-ink sm:text-3xl">
            {beforeFullStack}
            <span ref={targetRef} className="text-accent">
              {fullStack}
            </span>
          </p>

          {/* Shifted under "full‑stack" via inline style (see useAnnotationArrow) so
              it stays close to the word whether that word wraps to the left edge
              (narrow viewports) or the end of a long line (wide viewports). */}
          <p
            ref={noteRef}
            style={{ marginLeft: geometry?.noteLeft }}
            className="mt-3 max-w-[13rem] font-mono text-sm leading-snug text-accent"
          >
            {identity.heroAnnotation}
          </p>

          <p className="mt-4 font-mono text-sm text-ink-muted">
            {city} · {identity.rightToWork}
          </p>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
          <a
            href="#work"
            className={
              'font-body text-base text-ink underline decoration-accent decoration-2 ' +
              'underline-offset-4 transition-colors hover:text-accent focus-visible:outline ' +
              'focus-visible:outline-2 focus-visible:outline-accent px-1 py-2.5 -my-2.5 inline-block'
            }
          >
            View work →
          </a>
          <a
            href={`mailto:${identity.email}`}
            className={
              'font-body text-base text-ink underline decoration-accent-muted ' +
              'underline-offset-4 transition-colors hover:decoration-accent ' +
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ' +
              'px-1 py-2.5 -my-2.5 inline-block'
            }
          >
            Email me
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-ink-muted">
          <a href={identity.github} className={linkStyle}>
            GitHub
          </a>
          <a href={identity.linkedin} className={linkStyle}>
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}

/** Splits the role line on the non-breaking hyphen (U+2011) in "full‑stack" so the
 *  word can be wrapped in an accent span; a plain hyphen edit would silently skip
 *  the split, so keep this character matching content.ts's heroRole. */
function splitOnFullStack(headline: string): [string, string] {
  const marker = 'full‑stack'
  const index = headline.indexOf(marker)
  if (index === -1) return [headline, '']
  return [headline.slice(0, index), headline.slice(index)]
}

export default Hero
