import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

// The one place plugins are registered.
gsap.registerPlugin(useGSAP, DrawSVGPlugin, MotionPathPlugin, ScrollTrigger, SplitText)

// Triggers measure their start when they mount, before the webfonts and the lazy Work
// screenshots have settled the layout, so starts land late. Re-measure once both fonts
// and the page have loaded, then once more when the lazy screenshots are in.
const pageLoaded = new Promise((r) => window.addEventListener('load', r, { once: true }))
Promise.all([document.fonts.ready, pageLoaded]).then(() => {
  ScrollTrigger.refresh()
  const lazyImages = [...document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]')]
  // `error` resolves too, so one broken image can't block the refresh.
  const loaded = lazyImages.map(
    (img) =>
      img.complete ||
      new Promise((r) => {
        img.addEventListener('load', r, { once: true })
        img.addEventListener('error', r, { once: true })
      }),
  )
  Promise.all(loaded).then(() => ScrollTrigger.refresh())
})

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
