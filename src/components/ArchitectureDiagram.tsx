import { useId, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { gsap, playOnceInView, useGSAP } from '../lib/gsap'
import type { Architecture, ArchitectureNode } from '../content'

type Point = { x: number; y: number }
type Arrow = { d: string; heads: string[] }
type Label = { x: number; y: number; anchor: 'start' | 'middle' | 'end' }

type Geometry = {
  width: number
  height: number
  /** client ↔ API, API ↔ database: solid, an arrowhead at each end */
  main: Arrow[]
  mainLabels: Label[]
  /** shared schemas → client, shared schemas → API: dashed, one arrowhead */
  shared: Arrow[]
  sharedLabels: Label[]
}

const GAP = 6 // px between a node's edge and the tip of the arrow touching it
const HEAD_LENGTH = 7 // px, each open-stroke wing
const HEAD_SPREAD = (26 * Math.PI) / 180 // angle between each wing and the line
const BEND = 2 // px a main line bows sideways, for a hand-drawn feel
const LANE_RADIUS = 12 // px, the corner where the mobile lane turns into the API
const LABEL_OFFSET = 10 // px between a line and its label

/** An open arrowhead whose tip IS the line's endpoint. `from` is the point the line
 *  arrives from (its control point, or the previous point), so the wings follow the
 *  line's real direction at the tip instead of a guessed angle. */
function head(tip: Point, from: Point): string {
  const angle = Math.atan2(tip.y - from.y, tip.x - from.x)
  const wing = (sign: 1 | -1) => ({
    x: tip.x + HEAD_LENGTH * Math.cos(angle + Math.PI - sign * HEAD_SPREAD),
    y: tip.y + HEAD_LENGTH * Math.sin(angle + Math.PI - sign * HEAD_SPREAD),
  })
  const [a, b] = [wing(1), wing(-1)]
  return `M ${a.x} ${a.y} L ${tip.x} ${tip.y} L ${b.x} ${b.y}`
}

/** A two-way line from a to b that bows slightly; both heads come from its control point. */
function twoWay(a: Point, b: Point): Arrow {
  const length = Math.hypot(b.x - a.x, b.y - a.y)
  const control = {
    x: (a.x + b.x) / 2 - ((b.y - a.y) / length) * BEND,
    y: (a.y + b.y) / 2 + ((b.x - a.x) / length) * BEND,
  }
  return {
    d: `M ${a.x} ${a.y} Q ${control.x} ${control.y}, ${b.x} ${b.y}`,
    heads: [head(a, control), head(b, control)],
  }
}

/** A straight one-way line, head at b. */
function oneWay(a: Point, b: Point): Arrow {
  return { d: `M ${a.x} ${a.y} L ${b.x} ${b.y}`, heads: [head(b, a)] }
}

const mid = (a: Point, b: Point, t = 0.5): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
})

/** Measures the four nodes and builds every line from their live positions. CSS decides
 *  the layout (stacked on mobile, a row from md); JS only reads which one it got. */
function useDiagramGeometry() {
  const stageRef = useRef<HTMLDivElement>(null)
  const sharedRef = useRef<HTMLDivElement>(null)
  const pathRefs = useRef<(HTMLDivElement | null)[]>([])
  const [geometry, setGeometry] = useState<Geometry | null>(null)

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    function measure() {
      const sharedEl = sharedRef.current
      const [clientEl, apiEl, dbEl] = pathRefs.current
      if (!stage || !sharedEl || !clientEl || !apiEl || !dbEl) return

      const s = stage.getBoundingClientRect()
      const box = (el: HTMLElement) => {
        const r = el.getBoundingClientRect()
        const left = r.left - s.left
        const top = r.top - s.top
        return { left, top, right: left + r.width, bottom: top + r.height, cx: left + r.width / 2, cy: top + r.height / 2 }
      }
      const zod = box(sharedEl)
      const client = box(clientEl)
      const api = box(apiEl)
      const db = box(dbEl)
      const stacked = api.top > client.bottom

      const main: Arrow[] = []
      const mainLabels: Label[] = []
      for (const [from, to] of [[client, api], [api, db]]) {
        const [a, b] = stacked
          ? [{ x: from.cx, y: from.bottom + GAP }, { x: to.cx, y: to.top - GAP }]
          : [{ x: from.right + GAP, y: from.cy }, { x: to.left - GAP, y: to.cy }]
        const m = mid(a, b)
        main.push(twoWay(a, b))
        // Stacked: left of the line, so the right side stays clear for the lane to the API.
        mainLabels.push(
          stacked
            ? { x: m.x - LABEL_OFFSET, y: m.y + 4, anchor: 'end' }
            : { x: m.x, y: m.y - LABEL_OFFSET, anchor: 'middle' },
        )
      }

      let shared: Arrow[]
      let sharedLabels: Label[]
      if (stacked) {
        // Client is directly below the schemas. The API is two rows down, so its line
        // runs down a lane to the right of the client, then turns into the API's side.
        const toClient = oneWay({ x: client.cx, y: zod.bottom + GAP }, { x: client.cx, y: client.top - GAP })
        const laneX = (client.right + s.width) / 2
        const corner = { x: laneX - LANE_RADIUS, y: api.cy }
        const tip = { x: api.right + GAP, y: api.cy }
        const toApi: Arrow = {
          d:
            `M ${laneX} ${zod.bottom + GAP} L ${laneX} ${api.cy - LANE_RADIUS} ` +
            `Q ${laneX} ${api.cy}, ${corner.x} ${corner.y} L ${tip.x} ${tip.y}`,
          heads: [head(tip, corner)],
        }
        shared = [toClient, toApi]
        sharedLabels = [
          { x: client.cx + LABEL_OFFSET, y: (zod.bottom + client.top) / 2 + 4, anchor: 'start' },
          { x: laneX - LABEL_OFFSET, y: (client.bottom + api.top) / 2 + 4, anchor: 'end' },
        ]
      } else {
        // Each line leaves the schemas' bottom edge as close above its target as the box allows.
        const startAbove = (x: number) => ({
          x: Math.min(Math.max(x, zod.left + 16), zod.right - 16),
          y: zod.bottom + GAP,
        })
        const ends = [client, api].map((t) => ({ x: t.cx, y: t.top - GAP }))
        const starts = ends.map((e) => startAbove(e.x))
        shared = [oneWay(starts[0], ends[0]), oneWay(starts[1], ends[1])]
        // Both labels to the right of their line: left of the client line there's no room
        // at 768px. The client line leans right as it rises into its label's text height,
        // so that label sits further out.
        const p = mid(starts[0], ends[0])
        const q = mid(starts[1], ends[1])
        sharedLabels = [
          { x: p.x + LABEL_OFFSET * 1.8, y: p.y + 4, anchor: 'start' },
          { x: q.x + LABEL_OFFSET, y: q.y + 4, anchor: 'start' },
        ]
      }

      setGeometry({ width: s.width, height: s.height, main, mainLabels, shared, sharedLabels })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    document.fonts?.ready.then(measure)
    return () => observer.disconnect()
  }, [])

  return { stageRef, sharedRef, pathRefs, geometry }
}

const STEP = 0.45 // s from one path node to the next

function byStep(_index: number, target: Element) {
  return Number((target as HTMLElement | SVGElement).dataset.step) * STEP
}

/** Plays once, the first time the diagram scrolls into view (~1.9s): the request path
 *  node by node, then the shared schemas and their dashed lines as the reveal. With
 *  reduced motion nothing runs and the diagram is simply there. */
function useDiagramTimeline(figureRef: RefObject<HTMLElement | null>, ready: boolean) {
  useGSAP(
    () => {
      if (!ready) return // the lines don't exist until the first measurement
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // pathLength={1}: a dash of 1 offset by 1 is hidden, offset 0 is drawn.
        const hidden = { strokeDasharray: '1 1', strokeDashoffset: 1 }
        // autoRound: false, or GSAP rounds the offset and it jumps 1 → 0.
        const drawn = { strokeDashoffset: 0, autoRound: false }
        const reveal = 1.15 // when the shared schemas start

        // Paused: built now, played by playOnceInView below. from()/fromTo() apply
        // their start state straight away, so everything is hidden here, from JS.
        const tl = gsap.timeline({ paused: true })
        tl.from('.arch-path-node', { autoAlpha: 0, y: 8, duration: 0.4, ease: 'power3.out', stagger: STEP }, 0)
          .fromTo('.arch-main-line', hidden, { ...drawn, duration: 0.3, ease: 'power2.inOut', stagger: STEP }, 0.2)
          .fromTo('.arch-main-head', hidden, { ...drawn, duration: 0.12, ease: 'power2.out', stagger: byStep }, 0.5)
          .from('.arch-main-label', { autoAlpha: 0, duration: 0.25, ease: 'power2.out', stagger: STEP }, 0.35)
          .from('.arch-shared-node', { autoAlpha: 0, y: -8, duration: 0.4, ease: 'power3.out' }, reveal)
          // The dashed lines can't be drawn with a dash (they already are one), so a solid
          // copy of each path in a mask is drawn instead, uncovering the dashes beneath it.
          .fromTo('.arch-shared-mask', hidden, { ...drawn, duration: 0.4, ease: 'power2.inOut' }, reveal + 0.2)
          .fromTo('.arch-shared-head', hidden, { ...drawn, duration: 0.12, ease: 'power2.out' }, reveal + 0.6)
          .from('.arch-shared-label', { autoAlpha: 0, duration: 0.25, ease: 'power2.out' }, reveal + 0.4)

        return playOnceInView(figureRef.current, tl)
      })
    },
    { scope: figureRef, dependencies: [ready] },
  )
}

const strokeProps = {
  stroke: 'currentColor',
  strokeWidth: '1.5',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
}

function NodeBox({ node, focal = false }: { node: ArchitectureNode; focal?: boolean }) {
  return (
    <>
      <span className={'font-display leading-tight ' + (focal ? 'text-xl text-accent' : 'text-lg text-ink')}>
        {node.label}
      </span>
      {node.details.map((detail) => (
        <span key={detail} className="font-mono text-xs text-ink-muted">
          {detail}
        </span>
      ))}
    </>
  )
}

const nodeBase = 'flex flex-col items-center justify-center gap-1 border px-3 text-center'

function ArchitectureDiagram({ architecture, number }: { architecture: Architecture; number: number }) {
  const figureRef = useRef<HTMLElement>(null)
  const { stageRef, sharedRef, pathRefs, geometry } = useDiagramGeometry()
  useDiagramTimeline(figureRef, geometry !== null)
  const maskId = useId()

  return (
    <figure ref={figureRef}>
      <p className="sr-only">{architecture.description}</p>

      {/* Mobile: one column, path nodes narrowed to leave a lane on the right for the
          dashed line to the API. md+: shared schemas centred over client and API, the
          path in a row of three underneath. */}
      <div
        ref={stageRef}
        aria-hidden="true"
        className="relative grid gap-y-16 md:grid-cols-3 md:gap-x-24 md:gap-y-24 lg:gap-x-28"
      >
        <div
          ref={sharedRef}
          className={
            nodeBase +
            ' arch-shared-node border-accent bg-paper-raised py-5 md:col-span-2 md:w-64 md:justify-self-center'
          }
        >
          <NodeBox node={architecture.shared} focal />
        </div>

        {architecture.path.map((node, i) => (
          <div
            key={node.label}
            ref={(el) => {
              pathRefs.current[i] = el
            }}
            // md:row-start-2, or auto-placement fills the empty cell beside the schemas.
            className={nodeBase + ' arch-path-node w-[72%] border-ink/15 py-4 md:row-start-2 md:w-auto'}
          >
            <NodeBox node={node} />
          </div>
        ))}

        {geometry && (
          <svg
            width={geometry.width}
            height={geometry.height}
            viewBox={`0 0 ${geometry.width} ${geometry.height}`}
            className="pointer-events-none absolute inset-0 overflow-visible text-accent-muted"
          >
            <defs>
              {geometry.shared.map((arrow, i) => (
                // userSpaceOnUse: the default mask box is the path's own bounding box,
                // which is zero-wide for a vertical line and would hide it entirely.
                <mask
                  key={i}
                  id={`${maskId}-${i}`}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width={geometry.width}
                  height={geometry.height}
                >
                  <path className="arch-shared-mask" d={arrow.d} pathLength={1} {...strokeProps} stroke="white" strokeWidth="6" />
                </mask>
              ))}
            </defs>

            {geometry.main.map((arrow, i) => (
              <g key={i}>
                <path className="arch-main-line" d={arrow.d} pathLength={1} {...strokeProps} />
                {/* Keyed by position, not by d: d changes on every re-measure, and a new key
                    would swap in a fresh element that GSAP never hid. */}
                {arrow.heads.map((d, j) => (
                  <path key={j} className="arch-main-head" data-step={i} d={d} pathLength={1} {...strokeProps} />
                ))}
              </g>
            ))}

            {geometry.shared.map((arrow, i) => (
              <g key={i}>
                <path d={arrow.d} mask={`url(#${maskId}-${i})`} {...strokeProps} strokeDasharray="4 5" />
                {arrow.heads.map((d, j) => (
                  <path key={j} className="arch-shared-head" d={d} pathLength={1} {...strokeProps} />
                ))}
              </g>
            ))}

            <g className="fill-accent font-mono text-xs">
              {geometry.mainLabels.map((label, i) => (
                <text key={i} className="arch-main-label" x={label.x} y={label.y} textAnchor={label.anchor}>
                  {architecture.pathLinks[i]}
                </text>
              ))}
              {geometry.sharedLabels.map((label, i) => (
                <text key={i} className="arch-shared-label" x={label.x} y={label.y} textAnchor={label.anchor}>
                  {architecture.sharedLinks[i]}
                </text>
              ))}
            </g>
          </svg>
        )}
      </div>

      <figcaption className="mt-4 font-mono text-xs text-ink-muted">
        Fig. {number} — {architecture.caption}
      </figcaption>
    </figure>
  )
}

export default ArchitectureDiagram
