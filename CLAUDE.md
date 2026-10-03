# Rishi Negi — Portfolio

Personal portfolio for junior frontend / full-stack roles in London. The site is itself a
work sample: recruiters and engineers will judge the code and the craft, not just the content.

All copy, facts and links originate in `content.md` — never invent facts, metrics or
projects; if something is missing, ask me. Once `src/content.ts` exists, it is the working
source of truth for on-site copy (components read from it, not from JSX literals);
`content.md` stays the original brief and source of record for facts, and the two are not
kept in lockstep — update `content.ts` directly for copy changes, and only touch
`content.md` when the underlying facts change.

## Working with me

- I am learning Claude Code and must be able to explain every line in an interview.
- Plan before building. For any new section, propose the approach first and wait for my OK.
- Work one section at a time. After each change, tell me what you did and why in 3–5 lines,
  and point out anything worth me understanding (a hook, an animation technique, a CSS trick).
- Prefer simple, readable code over clever code. No abstractions "for later".
- Don't add a dependency without asking and saying why.
- Never delete source assets (images, screenshots) until the processed version has been
  checked; keep originals until I confirm.

## Stack (keep to this)

- React + TypeScript (strict) + Vite
- Tailwind CSS for styling, CSS variables for design tokens
- GSAP (`gsap` + `@gsap/react`'s `useGSAP`) for animation. Plugins: DrawSVG, MotionPath,
  SplitText, ScrollTrigger, registered once in `src/lib/gsap.ts`
- `react-icons` (Simple Icons set, `react-icons/si`) for tech logos
- Single page with anchor navigation; no router unless we add case-study pages
- Deployed on Vercel (`*.vercel.app` to start)
- Bun is the package manager and script runner — never npm/yarn/pnpm. Use `bun add`,
  `bun run`, `bunx`. Keep `bun.lock` committed.

## Design direction: "engineer's notebook"

The feeling: a thoughtful engineer's working notebook, with margin notes, annotations and
diagrams that explain how things work under the hood. Calm, warm, precise. Not a
template, not a dark neon dev site.

- Warm off-white "paper" background, near-black "ink" text, ONE accent colour used sparingly
  (like a single coloured pen for annotations). Full dark mode is optional, not required.
- Typography does the heavy lifting: a confident display face for headings, a readable body
  face, and a monospace for annotations, labels and code.
- Notebook motifs used with restraint: margin annotations, hand-drawn-feel SVG underlines and
  arrows, simple diagrams. Avoid kitsch: no ruled-paper background, no fake coffee stains, no
  scribble fonts for body text.
- Tech-stack icons: monochrome, tinted in the ink colour, always with a text label; brand colour
  only on hover/focus. Never a wall of full-colour logos.
- Typefaces: Newsreader (display/headings), Source Sans 3 (body), Fragment Mono (annotations,
  labels, mono text) — self-hosted via `@fontsource-variable/newsreader`,
  `@fontsource-variable/source-sans-3`, `@fontsource/fragment-mono`.
- Accent colour: deep teal-green `--color-accent` (#3E6259). `--color-accent-muted` is
  decorative only (lines, fills, underline strokes) — never text; text always uses
  `--color-accent` itself for sufficient contrast.
- Margin notes: mono text with a small hand-drawn arrow, never a left-border/side-tab stripe
  (Impeccable's design-review hook flags side-tab borders as an AI-slop tell).
- Links are always underlined, not colour-only (colour alone isn't an accessible link signal).
  On hover, darken or thicken the underline rather than lightening it — lightening reads as a
  wash-out, not emphasis.
- Hero fact line is the city plus coordinates only ("London · 51.51° N, 0.13° W"). Right to
  work is deliberately not in the hero; `identity.rightToWork` stays in `content.ts` for
  use elsewhere.
- Headings use `text-wrap: balance` (already set globally in `index.css` for h1–h3). Compound
  words like "full-stack" use a non-breaking hyphen (U+2011 `‑`) in copy so they don't break
  mid-word at odd viewport widths.

## Motion principles

- Motion explains or guides, never decorates for its own sake.
- Signature moments:
  1. SVG annotation lines and arrows that "draw" in as their section scrolls into view.
  2. CleanDeps: an animated terminal replaying the CLI's real output strings (from
     `bin/cleandeps.js` — it uses Node's fs, never shell commands like `rm -rf`) in two
     scenarios: a normal run, and a "wrong folder" run that refuses without a package.json.
     Each scenario has its own replay button; plus a copy-able install command.
  3. Job Tracker: an architecture diagram (React client ↔ shared Zod schemas ↔ Express API ↔
     PostgreSQL) whose connections draw in on scroll.
  4. Experience timeline: a reading-progress line. A pen nib travels down the dates column
     as you scroll, drawing the line behind it; each tick, and each key metric's pen
     underline, draws once as the nib passes it. At the switch to frontend the line swerves
     out and back once (the nib follows it via MotionPath), and the margin note there types
     itself in, then draws its arrow to the swerve.
- Micro-interactions (hover, focus, state changes): 150–400ms, CSS transitions, not GSAP.
- Signature sequences are GSAP timelines: ~1–2s total, play once, never loop. No bouncing.
- No ScrollSmoother, no scroll-jacking, no `scrub`. ScrollTrigger only starts a timeline
  (`once: true`). The one exception: the Experience timeline's line and nib are scrubbed
  (smoothed), as a reading-progress line. It is the only scroll-linked animation; keep it
  that way. Everything it passes (ticks, underlines, note) still plays once.
- Shared eases: type reveals `power3.out`, pen strokes `power2.inOut` (or `power2.out` for
  short strokes), typing `none`.
- All GSAP code goes through `useGSAP` (never a bare `useEffect`), so it's cleaned up on unmount.
- Reduced motion: build timelines inside
  `gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', …)`, so with reduced
  motion nothing runs and the DOM is already the final state.
- Hidden-before-animating states are set from JS (never in markup or CSS) and always have a
  timeout fallback, so content can never stay hidden.

## Avoid (AI-slop tells)

Purple/blue gradients, glassmorphism, glowing blobs, cards nested in cards, emoji headings,
"Hi, I'm X 👋" heroes, eyebrow chips above every heading, identical three-icon feature rows,
generic "Let's build something amazing together" CTAs, skill percentage bars.

## Quality bar

- Semantic HTML, keyboard accessible, visible focus states, WCAG AA contrast.
- Mobile-first; test at 375px, 768px, 1280px.
- Lighthouse 90+ on all categories. Optimise images (WebP/AVIF, explicit width/height).
- Components small and named clearly in `src/components/`, content kept out of JSX where
  practical (`src/content.ts`).
- Run `bun run build` and `bun run lint` before saying a task is done.
