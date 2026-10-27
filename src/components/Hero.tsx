import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { identity } from '../content'
import { noBreakHyphens } from '../lib/noBreakHyphens'
import Container from './Container'

type ArrowGeometry = {
  path: string
  headStroke1: string
  headStroke2: string
  noteLeft: number
  /** md and up only (null when the note is in the flow): its top, level with the loop's top */
  noteTop: number | null
  containerWidth: number
  containerHeight: number
}

type Point = { x: number; y: number }

const ARROW_START_INSET = 10 // px into the note's top edge, so the line doesn't start exactly at its corner
const ARROWHEAD_LENGTH = 7 // px, each open-stroke wing
const ARROWHEAD_SPREAD = (26 * Math.PI) / 180 // angle between the two wings and the line
const WOBBLE = 6 // px of horizontal give in the curve's control points, for a hand-drawn feel
const LOOP_INSET_X = 12 // px the loop's SVG extends left/right of the phrase (-inset-x-3)
const LOOP_INSET_Y = 8 // px the loop's SVG extends above/below the phrase (-inset-y-2)

// md and up: the note sits to the right of the loop, with a short arrow back to it.
const NOTE_OFFSET = 96 // px from the loop's right edge to the note's left edge
const ARROW_GAP = 12 // px between the arrow's tail and the note's left edge
const TIP_GAP = 4 // px between the arrowhead's tip and the loop's stroke
const NOTE_DROP = 8 // px the note's top sits below the loop's top: level enough, but clear of the role line above
const NOTE_LINE_MID = 10 // px from the note's top to the middle of its first line (14px text, 1.375 leading)
const BOW = 14 // px the arrow sags below the straight line between its ends, so it reads as drawn

// One authored pen loop around the marked phrase (identity.heroMark), drawn in a 200×60
// box that's stretched over it (preserveAspectRatio="none"). Starts top-right, runs anticlockwise, comes back
// round and overshoots past its start with a short tail. Lopsided (fuller on the right),
// and tilted about -2° (left side lower, right side higher). The left side sits closer
// in (~5px at x-height) since normal word spacing leaves only ~7px to the "h" of "with".
const LOOP_PATH =
  'M 170 5 C 128 0, 60 3, 24 8 C 10 11, 9 26, 11 41 C 14 55, 46 60, 100 58 ' +
  'C 152 57, 192 52, 197 34 C 201 18, 193 4, 158 2 C 142 1, 126 2, 110 5'
// The point on that stroke the md+ arrow aims at, in the same 200×60 box: lower right.
const LOOP_TARGET = { x: 197, y: 34 }

/** Measures the live position of the headline's marked-phrase span and places the note
 *  and its arrow around it. md and up, where the note floats out of flow: the note sits to
 *  the right of the pen loop with its top level with the loop's, and a short curved arrow
 *  runs from the note's left edge to the loop's lower-right stroke. Below md the note is in
 *  the flow, under the headline, and its arrow curves up to the bottom of the loop. In both
 *  the arrow ends in an open, hand-drawn arrowhead. Where the phrase sits can't be
 *  predicted with CSS alone (the role line wraps differently at each width), which only
 *  measuring the live layout can resolve. */
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

      // CSS decides whether the note floats (md+); JS just reads the result.
      const floating = getComputedStyle(note).position === 'absolute'

      let noteLeft: number
      let noteTop: number | null = null
      let start: Point
      let end: Point
      let cp1: Point
      let cp2: Point

      if (floating) {
        // The loop's SVG box, relative to the container.
        const loopLeft = t.left - c.left - LOOP_INSET_X
        const loopTop = t.top - c.top - LOOP_INSET_Y
        const loopWidth = t.width + 2 * LOOP_INSET_X
        const loopHeight = t.height + 2 * LOOP_INSET_Y

        // Clamped to the container's right edge so the note can never overflow.
        noteLeft = Math.max(0, Math.min(loopLeft + loopWidth + NOTE_OFFSET, c.width - n.width))
        // Its offset parent is the wrapper around the role line, not the container.
        const parent = (note.offsetParent ?? container).getBoundingClientRect()
        noteTop = t.top - LOOP_INSET_Y + NOTE_DROP - parent.top

        start = { x: noteLeft - ARROW_GAP, y: loopTop + NOTE_DROP + NOTE_LINE_MID }
        end = {
          x: loopLeft + (LOOP_TARGET.x / 200) * loopWidth + TIP_GAP,
          y: loopTop + (LOOP_TARGET.y / 60) * loopHeight,
        }
        // Both control points sag below the line, so it bows down and rises into the loop.
        const run = start.x - end.x
        cp1 = { x: start.x - run * 0.3, y: start.y + BOW }
        cp2 = { x: end.x + run * 0.3, y: end.y + BOW }
      } else {
        noteLeft = Math.max(0, Math.min(t.left - c.left, c.width - n.width))
        start = { x: noteLeft + ARROW_START_INSET, y: n.top - c.top }
        end = { x: t.left - c.left + t.width / 2, y: t.bottom - c.top + LOOP_INSET_Y } // the loop's bottom edge
        const dx = end.x - start.x
        const dy = end.y - start.y
        cp1 = { x: start.x + dx * 0.3 + WOBBLE, y: start.y + dy * 0.3 }
        cp2 = { x: start.x + dx * 0.7 - WOBBLE, y: start.y + dy * 0.7 }
      }

      const path = `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`

      // Open, hand-drawn arrowhead: two short strokes angled off the curve's own
      // tangent at its end point, instead of a filled marker triangle.
      const angle = Math.atan2(end.y - cp2.y, end.x - cp2.x)
      const wing = (sign: 1 | -1): [number, number] => {
        const a = angle + Math.PI - sign * ARROWHEAD_SPREAD
        return [end.x + ARROWHEAD_LENGTH * Math.cos(a), end.y + ARROWHEAD_LENGTH * Math.sin(a)]
      }
      const [w1x, w1y] = wing(1)
      const [w2x, w2y] = wing(-1)

      setGeometry({
        path,
        headStroke1: `M ${w1x} ${w1y} L ${end.x} ${end.y}`,
        headStroke2: `M ${w2x} ${w2y} L ${end.x} ${end.y}`,
        noteLeft,
        noteTop,
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

const FONT_WAIT_LIMIT = 800 // ms; start the entrance even if fonts are still loading

/** The hero's entrance: name → role line → pen loop around the marked phrase → note types in →
 *  arrow draws to the loop (~1.9s, plays once). Only built when the user hasn't asked
 *  for reduced motion; otherwise nothing runs and the DOM is already the final state. */
function useHeroTimeline(containerRef: RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', (_context, contextSafe) => {
        const container = containerRef.current
        if (!container) return

        // Hidden from JS (never in markup), before first paint, so if JS fails the
        // hero is simply visible. The context reverts this on unmount.
        gsap.set(container, { autoAlpha: 0 })

        // SplitText measures text, so wait for the real fonts — but never longer than
        // FONT_WAIT_LIMIT, so a slow font can't keep the hero hidden.
        let cancelled = false
        let timer = 0
        const fontsOrTimeout = Promise.race([
          document.fonts.ready,
          new Promise((resolve) => (timer = window.setTimeout(resolve, FONT_WAIT_LIMIT))),
        ])

        // contextSafe: this runs later (after the promise), outside the synchronous
        // useGSAP call, so it has to be wrapped to be recorded and reverted.
        const build = contextSafe!(() => {
          if (cancelled) return
          const name = SplitText.create('h1', { type: 'words', mask: 'words' })
          const note = SplitText.create('.hero-note', { type: 'words,chars' }) // words keep line breaks between words

          // Typed chars are hidden explicitly: a zero-duration from() with a stagger
          // doesn't apply its start state until the playhead reaches it.
          gsap.set(note.chars, { autoAlpha: 0 })

          const tl = gsap.timeline({
            onComplete: () => {
              // Back to plain text and plain strokes, so later resizes re-wrap and
              // re-measure without split spans or stale dash lengths in the way.
              name.revert()
              note.revert()
              gsap.set('.hero-loop, .hero-arrow, .hero-wing', {
                clearProps: 'strokeDasharray,strokeDashoffset',
              })
            },
          })
          tl.from(name.words, { yPercent: 110, duration: 0.6, ease: 'power3.out', stagger: 0.08 }, 0)
            .from('.hero-role', { y: 8, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, 0.25)
            // The loop is stretched non-uniformly with a non-scaling stroke, so its length
            // can't be measured (DrawSVG warns). pathLength={1} defines its length as 1
            // instead: a 1-long dash offset by 1 is hidden, offset 0 is fully drawn.
            .fromTo(
              '.hero-loop',
              { strokeDasharray: '1 1', strokeDashoffset: 1 },
              // autoRound: false, or GSAP rounds the px offset and it jumps 1 → 0.
              { strokeDashoffset: 0, autoRound: false, duration: 0.55, ease: 'power2.inOut' },
              0.65,
            )
            .to(note.chars, { autoAlpha: 1, duration: 0, ease: 'none', stagger: { amount: 0.5 } }, 1.05)
            .from('.hero-arrow', { drawSVG: 0, duration: 0.35, ease: 'power2.out' }, 1.45)
            .from('.hero-wing', { drawSVG: 0, duration: 0.12, ease: 'power2.out' }, 1.75)

          // Every start state above has already been applied, so revealing the
          // container now can't flash the final layout.
          gsap.set(container, { autoAlpha: 1 })
        })
        fontsOrTimeout.then(() => build())

        // StrictMode mounts, unmounts and remounts: stop the first mount's promise
        // from building a second timeline on the same DOM nodes.
        return () => {
          cancelled = true
          window.clearTimeout(timer)
        }
      })
    },
    { scope: containerRef },
  )
}

function Hero() {
  const { containerRef, targetRef, noteRef, geometry } = useAnnotationArrow()
  useHeroTimeline(containerRef)
  const [beforeMark, mark] = splitOnMark(identity.heroRole, identity.heroMark)
  const city = identity.location.split(',')[0].trim()

  const linkStyle =
    'inline-block py-3 -my-3 underline decoration-accent-muted underline-offset-4 ' +
    'transition-colors hover:text-ink hover:decoration-accent focus-visible:outline ' +
    'focus-visible:outline-2 focus-visible:outline-accent'

  const strokeProps = {
    stroke: 'currentColor',
    strokeWidth: '1.5',
    strokeLinecap: 'round' as const,
    fill: 'none',
  }

  return (
    <section className="scroll-mt-14 pt-16 pb-20 sm:pt-24">
      <Container ref={containerRef} className="relative isolate flex flex-col gap-6">
        {geometry && (
          <svg
            width={geometry.containerWidth}
            height={geometry.containerHeight}
            viewBox={`0 0 ${geometry.containerWidth} ${geometry.containerHeight}`}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 text-accent-muted"
          >
            <path className="hero-arrow" d={geometry.path} {...strokeProps} />
            <path className="hero-wing" d={geometry.headStroke1} {...strokeProps} />
            <path className="hero-wing" d={geometry.headStroke2} {...strokeProps} />
          </svg>
        )}

        <div>
          <h1 className="font-display text-5xl leading-tight text-ink sm:text-6xl lg:text-8xl">
            {identity.name}
          </h1>
          {/* Positioning context for the note: on md+ it floats out of flow, to the right
              of the circled phrase, so the content below doesn't move down. */}
          <div className="relative">
            <p className="hero-role mt-2 max-w-xl font-display text-2xl leading-snug text-ink sm:text-3xl">
              {beforeMark}
              {/* nowrap: the loop is one box over the phrase, so the phrase must stay on
                  one line or the loop would span a line break. */}
              <span ref={targetRef} className="relative ml-1 whitespace-nowrap text-accent">
                {noBreakHyphens(mark)}
                {/* Stretched over the word with a negative inset; non-scaling-stroke
                    keeps the line 1.5px however much the box is stretched. */}
                <svg
                  viewBox="0 0 200 60"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)] overflow-visible text-accent-muted"
                >
                  <path
                    className="hero-loop"
                    d={LOOP_PATH}
                    pathLength={1}
                    vectorEffect="non-scaling-stroke"
                    {...strokeProps}
                  />
                </svg>
              </span>
            </p>

            {/* Placed by inline style (see useAnnotationArrow). In the flow (below md) only
                its margin-left applies, shifting it under the phrase; absolute (md+) it
                gets left-0 plus that margin, and a top level with the loop's. md:mt-0 so
                the in-flow margin doesn't also push the absolute note down. */}
            <p
              ref={noteRef}
              style={{ marginLeft: geometry?.noteLeft, top: geometry?.noteTop ?? undefined }}
              className={
                'hero-note mt-6 max-w-[22rem] font-mono text-sm leading-snug text-accent ' +
                'md:absolute md:left-0 md:mt-0 md:w-[22rem]'
              }
            >
              {identity.heroAnnotation}
            </p>
          </div>

          {/* md:mt-9: the floated note's last line stays 12px or more above this row (measured
              at 768 and 1280), even where the note extends over it horizontally. */}
          <p className="mt-4 font-mono text-sm text-ink-muted md:mt-9">
            {city} · {identity.heroFact}
          </p>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
          <a
            href="#work"
            className={
              'font-body text-base text-ink underline decoration-accent decoration-2 ' +
              'underline-offset-4 transition-colors hover:text-accent focus-visible:outline ' +
              'focus-visible:outline-2 focus-visible:outline-accent py-2.5 -my-2.5 inline-block'
            }
          >
            View work
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="ml-1.5 inline-block h-[0.85em] w-[0.85em] align-[-0.05em]"
            >
              <path
                d="M 2 8 H 13 M 9 4 L 13 8 L 9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </a>
          <a
            href={`mailto:${identity.email}`}
            className={
              'font-body text-base text-ink underline decoration-accent-muted ' +
              'underline-offset-4 transition-colors hover:decoration-accent ' +
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ' +
              'py-2.5 -my-2.5 inline-block'
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
          {/* Up here too, since it's what a recruiter wants first. New tab, as in Contact. */}
          {identity.cvUrl && (
            <a href={identity.cvUrl} target="_blank" rel="noopener" className={linkStyle}>
              CV (PDF)
            </a>
          )}
        </div>
      </Container>
    </section>
  )
}

/** Splits the role line at the marked phrase so it can be wrapped in an accent span;
 *  keep content.ts's heroMark inside its heroRole, or the split is silently skipped. */
function splitOnMark(headline: string, marker: string): [string, string] {
  const index = headline.indexOf(marker)
  if (index === -1) return [headline, '']
  return [headline.slice(0, index), headline.slice(index)]
}

export default Hero
