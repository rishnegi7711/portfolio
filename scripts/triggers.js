// Probe for cdp.ts: each ScrollTrigger's stored start vs. where it should be (top 75%).
// Dev server only — it imports gsap from /src, the same module instance the page uses.
(async () => {
  const { ScrollTrigger } = await import('/src/lib/gsap.ts')
  return ScrollTrigger.getAll().map((t) => {
    const el = t.trigger
    const name = el.id || (el.className.baseVal ?? el.className).toString().slice(0, 40) || el.tagName
    const docTop = Math.round(el.getBoundingClientRect().top + scrollY)
    return { name, start: Math.round(t.start), expected: docTop - 0.75 * innerHeight, scrub: !!t.vars.scrub }
  })
})()
