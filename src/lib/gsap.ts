import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

// The one place plugins are registered.
gsap.registerPlugin(useGSAP, DrawSVGPlugin, ScrollTrigger, SplitText)

const WATCHDOG_SLACK = 1 // s past the timeline's own length before it's forced to the end

/** Plays a paused timeline once, the first time `trigger`'s top passes 75% down the
 *  viewport. Once started, a watchdog jumps it to the end if playback ever stalls, so
 *  content hidden by its start state can't stay hidden. Call inside a gsap context
 *  (useGSAP / matchMedia) so the trigger is killed with it; return the result from
 *  that context so the watchdog is cleared too. */
function playOnceInView(trigger: Element | null, tl: gsap.core.Timeline) {
  let watchdog = 0
  ScrollTrigger.create({
    trigger,
    start: 'top 75%',
    once: true,
    onEnter: () => {
      tl.play()
      watchdog = window.setTimeout(() => tl.progress(1), (tl.duration() + WATCHDOG_SLACK) * 1000)
    },
  })
  return () => window.clearTimeout(watchdog)
}

export { gsap, playOnceInView, ScrollTrigger, SplitText, useGSAP }
