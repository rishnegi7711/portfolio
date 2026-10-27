import { useRef, useState } from 'react'
import { compareHint, type Compare, type CompareImage } from '../content'
import { gsap, playOnceInView, useGSAP } from '../lib/gsap'

const START = 50 // % of the width showing the old design; also where the sweep ends

type BeforeAfterProps = {
  compare: Compare
  /** the figure's number on the page */
  number: number
}

/** The old design and the new one, the same crop of the same screen, with a draggable
 *  divider: old on the left, new on the right. The first time it scrolls into view the
 *  divider sweeps across once (~1.6s) to show it moves, then it is the visitor's.
 *  Reduced motion: it stays at 50/50. The control is a native range input laid invisibly
 *  over the image, so the keyboard (arrows, Home, End, Page Up and Down) and assistive
 *  technology work without any code of ours. */
function BeforeAfter({ compare, number }: BeforeAfterProps) {
  const [pos, setPos] = useState(START)
  const frameRef = useRef<HTMLDivElement>(null)
  const sweepRef = useRef<gsap.core.Timeline | null>(null)
  const takenOver = useRef(false)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The tween moves a plain object, and each update copies it into state. Nothing
        // is hidden, so there's no start state to guard with a fallback.
        const sweep = { pos: START }
        const tl = gsap
          .timeline({
            paused: true,
            defaults: { ease: 'power2.inOut' },
            onUpdate: () => {
              // Once the visitor has touched it, the sweep must never move it again, not
              // even when playOnceInView's watchdog jumps the timeline to its end.
              if (!takenOver.current) setPos(Math.round(sweep.pos))
            },
          })
          .to(sweep, { pos: 72, duration: 0.5 })
          .to(sweep, { pos: 28, duration: 0.7 })
          .to(sweep, { pos: START, duration: 0.4 })
        sweepRef.current = tl
        return playOnceInView(frameRef.current, tl)
      })
    },
    { scope: frameRef },
  )

  /** The visitor's first press or key ends the sweep. */
  function takeOver() {
    takenOver.current = true
    sweepRef.current?.pause()
  }

  return (
    <figure>
      {/* 33:38 below sm (matching the mobile crop), 2:1 from sm up. The outline appears
          when the range input inside has keyboard focus. */}
      <div
        ref={frameRef}
        className={
          'relative aspect-[33/38] select-none overflow-hidden border border-ink/15 ' +
          'bg-paper-raised sm:aspect-[2/1] has-focus-visible:outline-2 ' +
          'has-focus-visible:outline-offset-2 has-focus-visible:outline-accent'
        }
      >
        {/* Each side is clipped to its own part of the frame, so its label disappears when
            the other side covers it. */}
        <Side image={compare.before} label="Before" corner="left-3" clip={`inset(0 ${100 - pos}% 0 0)`} />
        <Side image={compare.after} label="After" corner="right-3" clip={`inset(0 0 0 ${pos}%)`} />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -translate-x-1/2"
          style={{ left: `${pos}%` }}
        >
          <div className="h-full w-0.5 bg-ink" />
          <div className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-paper text-ink">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 9 7 L 4 12 L 9 17 M 15 7 L 20 12 L 15 17" />
            </svg>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={(event) => setPos(event.target.valueAsNumber)}
          onPointerDown={takeOver}
          onKeyDown={takeOver}
          aria-label="Compare the old and new design"
          aria-valuetext={`Old design ${pos}%, new design ${100 - pos}%`}
          className="compare-range absolute inset-0 z-10 m-0 h-full w-full cursor-ew-resize touch-pan-y opacity-0"
        />
      </div>
      <figcaption className="mt-2 font-mono text-xs text-ink-muted">
        Fig. {number} — {compare.caption}
        <span aria-hidden="true"> · {compareHint}</span>
      </figcaption>
    </figure>
  )
}

type SideProps = {
  image: CompareImage
  label: string
  /** which bottom corner the label sits in */
  corner: 'left-3' | 'right-3'
  clip: string
}

/** One design, filling the frame, clipped to its side of the divider. */
function Side({ image, label, corner, clip }: SideProps) {
  return (
    <div className="absolute inset-0" style={{ clipPath: clip }}>
      <picture className="block h-full">
        <source media="(max-width: 639px)" srcSet={image.mobileSrc} />
        <img
          src={image.src}
          width={1792}
          height={896}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </picture>
      {/* Bottom corners: the top-left holds the app's own logo. Each label sits on its own
          side's colour, so it reads on both the dark old design and the light new one. */}
      <span
        className={
          `absolute bottom-3 ${corner} border px-2 py-0.5 font-mono text-xs ` +
          (label === 'Before'
            ? 'border-paper/40 bg-ink text-paper'
            : 'border-ink/25 bg-paper text-ink')
        }
      >
        {label}
      </span>
    </div>
  )
}

export default BeforeAfter
