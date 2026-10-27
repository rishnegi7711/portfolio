import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const media = matchMedia(query)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

/** Whether the visitor has asked for reduced motion, and re-renders if they change it. For
 *  choosing what to render (a still instead of a video); GSAP timelines use
 *  gsap.matchMedia() instead. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(query).matches,
    () => false, // there's no server render; this only satisfies the signature
  )
}
