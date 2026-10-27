import { useEffect, useRef, useState } from 'react'
import type { MotionFigure } from '../content'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

type MotionLoopProps = {
  motion: MotionFigure
  /** the figure's number on the page */
  number: number
}

/** A short muted loop of the app. It plays only while it is on screen, and the visitor can
 *  pause it (a pause stays until they press play). With reduced motion there is no video
 *  at all, so nothing is downloaded: just the first frame, as a still. This is the one
 *  looping thing on the site; it is footage of the app, not decoration. */
function MotionLoop({ motion, number }: MotionLoopProps) {
  const reduced = usePrefersReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState(false) // the visitor's choice

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.4, // mostly on screen, not just brushing past
    })
    observer.observe(video)
    return () => observer.disconnect()
  }, [reduced])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (inView && !paused) {
      // play() returns a promise that rejects if the browser refuses; the poster stays up.
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [inView, paused, reduced])

  return (
    <figure>
      <div className="relative border border-ink/15 bg-paper-raised">
        {/* The video: muted + playsInline is what lets it play without a tap, and
            preload="none" means nothing downloads until it first scrolls into view. */}
        {reduced ? (
          <img
            src={motion.poster}
            width={motion.width}
            height={motion.height}
            alt={motion.alt}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        ) : (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster={motion.poster}
            width={motion.width}
            height={motion.height}
            aria-label={motion.alt}
            className="block h-auto w-full"
          >
            <source src={motion.webm} type='video/webm; codecs="vp9"' />
            <source src={motion.mp4} type='video/mp4; codecs="avc1.42E01E"' />
          </video>
        )}
      </div>
      {/* Below the video, not over it: on a phone the clip is small and a button on top of it
          would hide part of it. aria-pressed styling matches the CleanDeps replay buttons. */}
      {!reduced && (
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
          className={
            'mt-3 cursor-pointer border border-ink/25 px-3 py-2 font-mono text-xs text-ink ' +
            'transition-colors hover:border-ink aria-pressed:border-accent aria-pressed:bg-accent ' +
            'aria-pressed:text-paper focus-visible:outline focus-visible:outline-2 ' +
            'focus-visible:outline-offset-2 focus-visible:outline-accent'
          }
        >
          {paused ? 'Play animation' : 'Pause animation'}
        </button>
      )}
      <figcaption className="mt-2 font-mono text-xs text-ink-muted">
        Fig. {number} — {motion.caption}
      </figcaption>
    </figure>
  )
}

export default MotionLoop
