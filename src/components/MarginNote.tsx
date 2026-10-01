import { useRef } from 'react'
import { gsap, playOnceInView, useGSAP } from '../lib/gsap'

// Two hand-authored pen arrows, each one path: a slightly bent line, then an open
// arrowhead (wing → tip → wing) angled off the line's direction at the tip, like the
// hero's. As one path, a single dash draws the line first and the head last.
const ARROWS = {
  up: { viewBox: '0 0 32 40', d: 'M 6 38 C 4 26, 14 12, 22 3 M 15.5 5.7 L 22 3 L 20.1 9.7' },
  left: { viewBox: '0 0 40 24', d: 'M 38 6 C 28 2, 14 16, 3 14 M 8.6 18.1 L 3 14 L 9.7 12.1' },
}

type MarginNoteProps = {
  text: string
  /** "up": at the thing above the note (shown at every width, since the note sits right
   *  under it). "left": across the column gap at the text beside it, so md+ only, once
   *  the note is in the margin. */
  pointsTo: 'up' | 'left'
}

/** Mono margin note with a small drawn arrow. The first time it scrolls into view the
 *  arrow draws in, then the text fades in (~0.6s, once). Reduced motion: both are simply
 *  there. */
function MarginNote({ text, pointsTo }: MarginNoteProps) {
  const noteRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Paused, so from()/fromTo() only apply their hidden start state (from JS),
        // until playOnceInView plays it. pathLength={1}: a dash of 1 offset by 1 is
        // hidden, offset 0 is drawn; autoRound: false, or the offset jumps 1 → 0.
        const tl = gsap.timeline({ paused: true })
        tl.fromTo(
          '.margin-note-arrow',
          { strokeDasharray: '1 1', strokeDashoffset: 1 },
          { strokeDashoffset: 0, autoRound: false, duration: 0.4, ease: 'power2.inOut' },
        ).from('.margin-note-text', { autoAlpha: 0, duration: 0.3, ease: 'power2.out' }, 0.3)

        return playOnceInView(noteRef.current, tl)
      })
    },
    { scope: noteRef },
  )

  const arrow = ARROWS[pointsTo]
  return (
    <p ref={noteRef} className="relative font-mono text-sm leading-snug text-accent">
      <svg
        viewBox={arrow.viewBox}
        aria-hidden="true"
        className={
          'text-accent-muted ' +
          (pointsTo === 'up'
            ? 'mb-1 ml-2 h-10 w-8'
            : 'absolute top-0.5 -left-11 hidden h-6 w-10 md:block')
        }
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
      <span className="margin-note-text">{text}</span>
    </p>
  )
}

export default MarginNote
