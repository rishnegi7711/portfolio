import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

// The one place plugins are registered. Add ScrollTrigger here with the first
// scroll-triggered section; until then nothing uses it, so it isn't shipped.
gsap.registerPlugin(useGSAP, DrawSVGPlugin, SplitText)

export { gsap, SplitText, useGSAP }
