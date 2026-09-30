# Rishi Negi — Portfolio

Personal portfolio for junior frontend / full-stack roles in London. The site is itself a
work sample: recruiters and engineers will judge the code and the craft, not just the content.

All copy, facts and links live in `content.md`. Never invent facts, metrics or projects.
If something is missing, ask me.

## Working with me

- I am learning Claude Code and must be able to explain every line in an interview.
- Plan before building. For any new section, propose the approach first and wait for my OK.
- Work one section at a time. After each change, tell me what you did and why in 3–5 lines,
  and point out anything worth me understanding (a hook, an animation technique, a CSS trick).
- Prefer simple, readable code over clever code. No abstractions "for later".
- Don't add a dependency without asking and saying why.

## Stack (keep to this)

- React + TypeScript (strict) + Vite
- Tailwind CSS for styling, CSS variables for design tokens
- Motion (`motion/react`, formerly Framer Motion) for animation
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

## Motion principles

- Motion explains or guides, never decorates for its own sake.
- Signature moments:
  1. SVG annotation lines and arrows that "draw" in as their section scrolls into view.
  2. CleanDeps: an animated terminal replaying the real CLI flow (detect package manager →
     remove node_modules → reinstall), replayable, with a copy-able install command.
  3. Job Tracker: an architecture diagram (React client ↔ shared Zod schemas ↔ Express API ↔
     PostgreSQL) whose connections draw in on scroll.
- Short, well-eased transitions (roughly 150–400ms). No bouncing, no endless loops, no
  scroll-jacking.
- Always respect `prefers-reduced-motion`: show the final state instantly.

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
