import { useRef, useState } from 'react'
import type { Project } from '../content'
import { gsap, playOnceInView, SplitText, useGSAP } from '../lib/gsap'

type Terminal = NonNullable<Project['terminal']>
type Scenario = 'normalRun' | 'wrongFolderRun'

const SCENARIOS: { id: Scenario; label: string }[] = [
  { id: 'normalRun', label: 'Normal run' },
  { id: 'wrongFolderRun', label: 'Wrong folder' },
]

const WATCHDOG_SLACK = 1 // s, as in playOnceInView

const buttonStyle =
  'cursor-pointer border border-ink/25 px-3 py-1.5 font-mono text-xs text-ink transition-colors ' +
  'hover:border-ink aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-paper ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/** Types the command, then reveals the output line by line (~1.5s). Uses fromTo, not
 *  from: a from() tween records the element's *current* look as its end state, so after
 *  an interrupted run it could "animate" from hidden to hidden. */
function replayTimeline(pre: Element) {
  return gsap
    .timeline()
    .fromTo(
      pre.querySelectorAll('.terminal-char'),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.01, stagger: 0.04, ease: 'none' },
    )
    .fromTo(
      pre.querySelectorAll('.terminal-output'),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.2, stagger: 0.07, ease: 'power3.out' },
      '+=0.2',
    )
}

/** CleanDeps' real output, replayed as if typed. One scenario shows at a time; each
 *  button selects and replays its run. Reduced motion: the buttons just switch runs. */
function TerminalReplay({ terminal, number }: { terminal: Terminal; number: number }) {
  const [scenario, setScenario] = useState<Scenario>('normalRun')
  const [copyStatus, setCopyStatus] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const commandRef = useRef<HTMLElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const watchdog = useRef(0)

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Split once, up front: re-splitting on every replay would nest the char divs.
        SplitText.create('.terminal-command', { type: 'chars', charsClass: 'terminal-char' })

        // The normal run plays once on scroll. Paused, so its hidden start state is
        // applied now (from JS) but nothing moves until it's in view.
        const tl = replayTimeline(rootRef.current!.querySelector('[data-scenario="normalRun"]')!)
        tl.pause()
        timeline.current = tl
        return playOnceInView(rootRef.current, tl)
      })
      return () => window.clearTimeout(watchdog.current)
    },
    { scope: rootRef },
  )

  function replay(next: Scenario) {
    setScenario(next)
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return

    // contextSafe: tweens made in a click handler join the useGSAP context, so they're
    // cleaned up on unmount like the rest. Wrapped here, in the handler, not at render.
    contextSafe(() => {
      // Finish (all lines visible), then kill whatever is playing, so two timelines
      // never fight over the same lines.
      timeline.current?.progress(1).kill()
      window.clearTimeout(watchdog.current)

      const tl = replayTimeline(rootRef.current!.querySelector(`[data-scenario="${next}"]`)!)
      timeline.current = tl
      watchdog.current = window.setTimeout(
        () => tl.progress(1),
        (tl.duration() + WATCHDOG_SLACK) * 1000,
      )
    })()
  }

  async function copyInstall() {
    try {
      // Throws if the API is missing (non-HTTPS) or permission is denied.
      await navigator.clipboard.writeText(terminal.install)
      setCopyStatus('Copied')
      // Clear it, so copying again changes the text and is announced again.
      window.setTimeout(() => setCopyStatus(''), 2000)
    } catch {
      // Select the command so the keyboard shortcut copies it.
      window.getSelection()?.selectAllChildren(commandRef.current!)
      setCopyStatus('Press Cmd+C to copy')
    }
  }

  return (
    <div ref={rootRef}>
      <figure>
        <div role="group" aria-label="Replay a run" className="mb-3 flex flex-wrap gap-2">
          {SCENARIOS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={scenario === id}
              onClick={() => replay(id)}
              className={buttonStyle}
            >
              <span aria-hidden="true">↻ </span>
              {label}
            </button>
          ))}
        </div>

        {/* Both runs share one grid cell, so the box is always as tall as the longer
            run and switching never shifts the page. `invisible` (visibility: hidden)
            also hides the other run from screen readers. */}
        <div className="grid border border-ink/15 bg-paper-raised p-4 sm:p-5">
          {SCENARIOS.map(({ id }) => (
            <pre
              key={id}
              data-scenario={id}
              className={
                '[grid-area:1/1] font-mono text-xs leading-relaxed whitespace-pre-wrap ' +
                'break-words sm:text-sm ' +
                (scenario === id ? '' : 'invisible')
              }
            >
              {terminal[id].map((line, i) =>
                line.text.startsWith('$ ') ? (
                  <span key={i} className="block text-ink">
                    <span className="text-accent">$</span>{' '}
                    <span className="terminal-command">{line.text.slice(2)}</span>
                  </span>
                ) : (
                  <span
                    key={i}
                    className={'terminal-output block ' + (line.dim ? 'text-ink-muted' : 'text-ink')}
                  >
                    {line.text}
                  </span>
                ),
              )}
            </pre>
          ))}
        </div>

        <figcaption className="mt-2 font-mono text-xs text-ink-muted">
          Fig. {number} — {terminal.caption}
        </figcaption>
      </figure>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm">
        <code ref={commandRef} className="border border-ink/15 bg-paper-raised px-3 py-1.5 text-ink">
          {terminal.install}
        </code>
        <button type="button" onClick={copyInstall} className={buttonStyle}>
          Copy
        </button>
        {/* role="status" is a polite live region: screen readers announce its text when
            it changes. It's in the DOM from the start, or the first change is missed. */}
        <span role="status" className="text-xs text-accent">
          {copyStatus}
        </span>
      </div>
    </div>
  )
}

export default TerminalReplay
