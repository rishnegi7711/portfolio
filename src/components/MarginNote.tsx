import { type CSSProperties, useRef } from 'react'
import { gsap, playOnceInView, SplitText, useGSAP } from '../lib/gsap'
import { noBreakHyphens } from '../lib/noBreakHyphens'

// Hand-authored pen arrows, each one path: a slightly bent line, then an open
// arrowhead (wing → tip → wing) angled off the line's direction at the tip, like the
// hero's. As one path, a single dash draws the line first and the head last.
const ARROWS = {
  up: { viewBox: '0 0 32 40', d: 'M 6 38 C 4 26, 14 12, 22 3 M 15.5 5.7 L 22 3 L 20.1 9.7' },
  left: { viewBox: '0 0 40 24', d: 'M 38 6 C 28 2, 14 16, 3 14 M 8.6 18.1 L 3 14 L 9.7 12.1' },
  // 1 unit = 1px; x = 0 is the caption's end, y = 0 the figure's bottom edge. Rises the
  // fixed 102px (caption, install row, grid margin) from the note's top to a tip 16px
  // past the caption's end and 10px below the figure, pointing without touching either.
  // It stays right of x = 0, so it can't cross the caption or the row under it.
  upLeft: {
    viewBox: '0 0 120 102',
    d: 'M 112 98 C 110 50, 38 49, 16 10 M 15.9 19 L 16 10 L 23.7 14.6',
  },
  // 1 unit = 1px, drawn for the md+ gap (184px) from the note's left edge (x = 184) back
  // to just short of the Experience timeline (x = 0). Narrower boxes crop the tail, not
  // the head (see the Arrow's preserveAspectRatio below).
  line: { viewBox: '0 0 184 24', d: 'M 182 14 C 130 20, 60 2, 3 12 M 10.7 14.2 L 3 12 L 9.5 7.3' },
}

type MarginNoteProps = {
  text: string
  /** "left": below md, up at the thing above the note (it sits right under it); on md+,
   *  left across the gap at whatever is beside it (a narrow figure, or the text).
   *  "upLeft": like "up" below md; on md+, a longer arrow from the note up-left to the
   *  bottom edge of the full-width figure above, just past the end of its caption.
   *  "line": left, back across the Experience dates column to the timeline line. */
  pointsTo: 'left' | 'upLeft' | 'line'
  /** "upLeft" only: the caption's length in characters. It's monospace, so its end is
   *  that many `ch` from the left of the note's positioned ancestor (the notes grid). */
  captionLength?: number
}

/** Mono margin note with a small drawn arrow. The first time it scrolls into view the
 *  arrow draws in, then the text fades in (~0.6s, once); the Experience note ("line")
 *  types itself in first, then draws its arrow. Reduced motion: both are simply there. */
function MarginNote({ text, pointsTo, captionLength = 0 }: MarginNoteProps) {
  const noteRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Paused, so from()/fromTo() only apply their hidden start state (from JS),
        // until playOnceInView plays it. pathLength={1}: a dash of 1 offset by 1 is
        // hidden, offset 0 is drawn; autoRound: false, or the offset jumps 1 → 0.
        const tl = gsap.timeline({ paused: true })
        const typed = pointsTo === 'line'
        if (typed) {
          // The timeline's pivot: the note types itself in as the nib reaches the swerve
          // (0.25s in: the smoothed nib arrives just after the trigger), then the arrow
          // draws to it.
          const { chars } = SplitText.create('.margin-note-text', { type: 'chars', aria: 'none' })
          tl.from(
            chars,
            { autoAlpha: 0, duration: 0.01, stagger: { amount: 0.6 }, ease: 'none' },
            0.25,
          )
        }
        // Appended, so it draws after the typing, or first when the note fades.
        tl.fromTo(
          '.margin-note-arrow',
          { strokeDasharray: '1 1', strokeDashoffset: 1 },
          { strokeDashoffset: 0, autoRound: false, duration: 0.4, ease: 'power2.inOut' },
        )
        if (!typed) {
          tl.from('.margin-note-text', { autoAlpha: 0, duration: 0.3, ease: 'power2.out' }, 0.3)
        }

        return playOnceInView(noteRef.current, tl)
      })
    },
    { scope: noteRef },
  )

  return (
    // md:static for upLeft, so its arrow is positioned against the grid, not the note.
    <p
      ref={noteRef}
      className={
        'relative font-mono text-sm leading-snug text-accent' +
        (pointsTo === 'upLeft' ? ' md:static' : '')
      }
    >
      {pointsTo === 'line' ? (
        // xMinYMid slice: scaled to the box's height and pinned left, so on narrow screens
        // the box crops the arrow's tail end and the head still lands by the line.
        // −8px / −16px: the head stops 6px short of the timeline's swerve (12px / 20px).
        <Arrow
          arrow={ARROWS.line}
          preserveAspectRatio="xMinYMid slice"
          className="absolute right-full -top-0.5 h-6 w-[calc(6.5rem-8px)] md:w-[calc(11.5rem-16px)]"
        />
      ) : (
        <Arrow arrow={ARROWS.up} className="mb-1 ml-2 h-10 w-8 md:hidden" />
      )}
      {pointsTo === 'left' && (
        <Arrow
          arrow={ARROWS.left}
          className="absolute top-0.5 -left-11 hidden h-6 w-10 md:block"
        />
      )}
      {pointsTo === 'upLeft' && (
        // text-xs font-mono: the caption's font, so 1ch here is one caption character.
        <Arrow
          arrow={ARROWS.upLeft}
          className="absolute bottom-full hidden h-[102px] w-[120px] font-mono text-xs md:block"
          style={{ left: `${captionLength}ch` }}
        />
      )}
      {/* Screen readers get the plain copy: the visible one may be split into chars, and
          SplitText's aria-label on a span isn't reliably read. */}
      <span className="sr-only">{text}</span>
      <span className="margin-note-text" aria-hidden="true">
        {noBreakHyphens(text)}
      </span>
    </p>
  )
}

type ArrowProps = {
  arrow: { viewBox: string; d: string }
  className: string
  style?: CSSProperties
  preserveAspectRatio?: string
}

function Arrow({ arrow, className, style, preserveAspectRatio }: ArrowProps) {
  return (
    <svg
      viewBox={arrow.viewBox}
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden="true"
      className={'text-accent-muted ' + className}
      style={style}
    >
      <path
        className="margin-note-arrow"
        d={arrow.d}
        pathLength={1}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export default MarginNote
