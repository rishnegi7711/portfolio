import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

// The one place plugins are registered.
gsap.registerPlugin(useGSAP, DrawSVGPlugin, ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText, useGSAP }
