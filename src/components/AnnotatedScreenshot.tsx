import { useRef } from 'react'
import { figureEnlargeHint, type AnnotatedFigure } from '../content'
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
 *  (~1.4s, once). Pressing the screenshot opens it larger in a native modal <dialog> (the
 *  same lightbox as the other figures), circles and numbers included. The overlay is hidden
 *  from assistive technology: the alt text and the numbered notes carry the meaning.
 *  Reduced motion: the circles are simply there. */
function AnnotatedScreenshot({ figure, number }: AnnotatedScreenshotProps) {
  const figureRef = useRef<HTMLElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

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
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className={
          'block w-full cursor-zoom-in border border-ink/15 transition-colors hover:border-ink/40 ' +
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
        }
      >
        <span className="sr-only">Enlarge: </span>
        <span className="relative block">
          <img
            src={figure.src}
            width={figure.width}
            height={figure.height}
            alt={figure.alt}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
          <Overlay figure={figure} animated />
        </span>
      </button>
      <figcaption className="mt-2 font-mono text-xs text-ink-muted">
        Fig. {number} — {figure.caption}
        <span aria-hidden="true"> · {figureEnlargeHint}</span>
      </figcaption>

      <dialog
        ref={dialogRef}
        aria-label={`Fig. ${number} — ${figure.caption}`}
        // A click on the dialog element itself (not its content) is a click on the backdrop.
        onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
        className="figure-dialog m-auto max-w-[min(94vw,1440px)] bg-paper p-3 backdrop:bg-ink/70 sm:p-4"
      >
        <form method="dialog" className="mb-3 flex justify-end">
          <button
            className={
              'py-2 font-mono text-xs text-ink underline decoration-accent-muted underline-offset-4 ' +
              'hover:decoration-accent focus-visible:outline-2 focus-visible:outline-accent'
            }
          >
            Close
          </button>
        </form>
        {/* On a narrow screen the image keeps a readable minimum width and the dialog scrolls
            sideways, instead of shrinking it back to a thumbnail. Lazy inside a closed
            dialog: the larger image only downloads on first open. */}
        <div className="max-h-[80vh] overflow-auto">
          <div className="relative min-w-[820px] border border-ink/15">
            <img
              src={figure.full.src}
              width={figure.full.width}
              height={figure.full.height}
              alt={figure.alt}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
            <Overlay figure={figure} />
          </div>
        </div>
      </dialog>

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

/** The pen circles and their numbers, positioned over a screenshot in its own CSS px so they
 *  scale with it. `animated` adds the classes the draw-in timeline targets; the enlarged
 *  view leaves them off, so it is simply drawn. */
function Overlay({ figure, animated = false }: { figure: AnnotatedFigure; animated?: boolean }) {
  const { view } = figure
  return (
    <>
      <svg
        viewBox={`0 0 ${view.width} ${view.height}`}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-accent"
      >
        {figure.marks.map(({ circle }, i) => (
          <path
            key={i}
            className={animated ? 'pen-circle' : undefined}
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
          className={
            (animated ? 'pen-number ' : '') +
            'absolute flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent-muted bg-paper font-mono text-[11px] leading-none text-accent'
          }
          style={{ left: `${(at.x / view.width) * 100}%`, top: `${(at.y / view.height) * 100}%` }}
        >
          {i + 1}
        </span>
      ))}
    </>
  )
}

export default AnnotatedScreenshot
