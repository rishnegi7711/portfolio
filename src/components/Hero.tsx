import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { identity } from '../content'

type ArrowGeometry = {
  oval: string
  path: string
  headStroke1: string
  headStroke2: string
  noteLeft: number
  containerWidth: number
  containerHeight: number
}

const NOTE_GAP = 32 // px between the left column and the floated note (md and up)
const ARROW_START_INSET = 10 // px into the note's top edge, so the line doesn't start exactly at its corner
const ARROWHEAD_LENGTH = 7 // px, each open-stroke wing
const ARROWHEAD_SPREAD = (26 * Math.PI) / 180 // angle between the two wings and the line
const WOBBLE = 6 // px of horizontal give in the curve's control points, for a hand-drawn feel
// The oval is sized from the span's own box, which covers the font's full ascent and
// descent. Horizontal room comes from the span's CSS padding (px-2.5 = 10px), so it
// pushes "into" away instead of the stroke landing on its "o"; vertical room is added here.
const OVAL_PAD_Y = 8 // px above and below the word's box
const KAPPA = 0.5523 // control-point distance (fraction of radius) for a cubic quarter circle

/** Measures the live position of the headline's "full‑stack" span, shifts the note
 *  to sit almost directly under it (clamped to the container's right edge so it can
 *  never overflow, and on md+ — where the note floats out of flow — kept clear of
 *  the fact line in the left column), loops a hand-drawn oval around the word, and draws a short curve
 *  + open arrowhead from the note to the oval. Word
 *  position can't be predicted with CSS alone: at narrow widths "full‑stack" wraps
 *  to its own line at the LEFT edge, but at wider widths it sits at the RIGHT end
 *  of a long line — opposite positions for the same word, which only measuring the
 *  live layout can resolve. */
function useAnnotationArrow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLSpanElement>(null)
  const noteRef = useRef<HTMLParagraphElement>(null)
  const factRef = useRef<HTMLParagraphElement>(null)
  const [geometry, setGeometry] = useState<ArrowGeometry | null>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    function measure() {
      const target = targetRef.current
      const note = noteRef.current
      const fact = factRef.current
      if (!container || !target || !note || !fact) return

      const c = container.getBoundingClientRect()
      const t = target.getBoundingClientRect()
      const n = note.getBoundingClientRect()

      // CSS decides whether the note floats (md+); JS just reads the result.
      const floating = getComputedStyle(note).position === 'absolute'
      const clearOfFactLine = floating
        ? fact.getBoundingClientRect().right - c.left + NOTE_GAP
        : 0
      const desiredLeft = Math.max(t.left - c.left, clearOfFactLine)
      const noteLeft = Math.max(0, Math.min(desiredLeft, c.width - n.width))

      const cx = t.left - c.left + t.width / 2
      const cy = t.top - c.top + t.height / 2
      const { d: oval, bottom: ovalBottom } = penLoop(cx, cy, t.width / 2, t.height / 2 + OVAL_PAD_Y)

      const startX = noteLeft + ARROW_START_INSET
      const startY = n.top - c.top
      const endX = cx
      const endY = ovalBottom + 2 // just under the oval's bottom edge

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
        oval,
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

  return { containerRef, targetRef, noteRef, factRef, geometry }
}

/** A hand-drawn loop around a box of half-width `hw`, half-height `r`: a pill
 *  (straight top/bottom, semicircular ends of radius r), which — unlike an ellipse —
 *  contains the whole box, corners included. The hand-drawn wobble only ever pushes
 *  outward (a slightly higher first pass, a lower bottom, wider ends), so the stroke
 *  can never drift onto the letters. Drawn clockwise from the top; the second pass
 *  over the top runs on past the start into the right-hand curve, so the pen's
 *  overlap sits at the top-right, in the padding above the letters. */
function penLoop(cx: number, cy: number, hw: number, r: number): { d: string; bottom: number } {
  const a = Math.max(0, hw - r) // half-length of the straight top/bottom edges
  const top1 = cy - r - 2.5 // first pass, a touch high
  const top2 = cy - r // second pass, exactly on the pill
  const bottom = cy + r + 1.5
  const right = cx + a + r + 1
  const left = cx - a - r - 2

  // Each end is two quarter-ellipse curves between the top and bottom edges.
  const rMid = (top1 + bottom) / 2
  const rk = (rMid - top1) * KAPPA
  const rkx = (right - cx - a) * KAPPA
  const lMid = (top2 + bottom) / 2
  const lk = (bottom - lMid) * KAPPA
  const lkx = (cx - a - left) * KAPPA

  // Overshoot: 30° round the right-hand end, on the pill itself.
  const angle = Math.PI / 6
  const ox = cx + a + r * Math.sin(angle)
  const oy = cy - r * Math.cos(angle)
  const ok = r * (4 / 3) * Math.tan(angle / 4) // control length for a 30° circular arc

  const d = [
    `M ${cx - a * 0.3} ${top1}`,
    `L ${cx + a} ${top1}`,
    `C ${cx + a + rkx} ${top1}, ${right} ${rMid - rk}, ${right} ${rMid}`,
    `C ${right} ${rMid + rk}, ${cx + a + rkx} ${bottom}, ${cx + a} ${bottom}`,
    `L ${cx - a} ${bottom}`,
    `C ${cx - a - lkx} ${bottom}, ${left} ${lMid + lk}, ${left} ${lMid}`,
    `C ${left} ${lMid - lk}, ${cx - a - lkx} ${top2}, ${cx - a} ${top2}`,
    `L ${cx + a} ${top2}`,
    `C ${cx + a + ok} ${top2}, ${ox - ok * Math.cos(angle)} ${oy - ok * Math.sin(angle)}, ${ox} ${oy}`,
  ].join(' ')

  return { d, bottom }
}

const FONT_WAIT_LIMIT = 800 // ms; start the entrance even if fonts are still loading

/** The hero's entrance: name → role line → oval around "full‑stack" → note types in →
 *  arrow draws to the oval (~1.9s, plays once). Only built when the user hasn't asked
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
              gsap.set('.hero-oval, .hero-arrow, .hero-wing', {
                clearProps: 'strokeDasharray,strokeDashoffset',
              })
            },
          })
          tl.from(name.words, { yPercent: 110, duration: 0.6, ease: 'power3.out', stagger: 0.08 }, 0)
            .from('.hero-role', { y: 8, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, 0.25)
            .from('.hero-oval', { drawSVG: 0, duration: 0.55, ease: 'power2.inOut' }, 0.65)
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
  const { containerRef, targetRef, noteRef, factRef, geometry } = useAnnotationArrow()
  useHeroTimeline(containerRef)
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
            className="pointer-events-none absolute inset-0 -z-10 overflow-visible text-accent-muted"
          >
            <path className="hero-oval" d={geometry.oval} {...strokeProps} />
            <path className="hero-arrow" d={geometry.path} {...strokeProps} />
            <path className="hero-wing" d={geometry.headStroke1} {...strokeProps} />
            <path className="hero-wing" d={geometry.headStroke2} {...strokeProps} />
          </svg>
        )}

        <div>
          <h1 className="font-display text-5xl leading-tight text-ink sm:text-6xl">
            {identity.name}
          </h1>
          {/* Positioning context for the note: on md+ it floats just below the role
              line (top-full), out of flow, so the content below doesn't move down. */}
          <div className="relative">
            <p className="hero-role mt-2 max-w-xl font-display text-2xl leading-snug text-ink sm:text-3xl">
              {beforeFullStack}
              <span ref={targetRef} className="px-2.5 text-accent">
                {fullStack}
              </span>
            </p>

            {/* Shifted under "full‑stack" via inline style (see useAnnotationArrow) so
                it stays close to the word whether that word wraps to the left edge
                (narrow viewports) or the end of a long line (wide viewports). With
                left-0, the same margin-left also places it when it's absolute. */}
            <p
              ref={noteRef}
              style={{ marginLeft: geometry?.noteLeft }}
              className={
                'hero-note mt-6 max-w-[22rem] font-mono text-sm leading-snug text-accent ' +
                'md:absolute md:top-full md:left-0 md:w-[22rem]'
              }
            >
              {identity.heroAnnotation}
            </p>
          </div>

          {/* Narrow on md+ so the floated note has a clear right-hand column beside it. */}
          <p ref={factRef} className="mt-4 font-mono text-sm text-ink-muted md:max-w-[19rem]">
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
