# rishi-negi.vercel.app

My portfolio site. I'm a frontend engineer in London, working in React and TypeScript and growing into full-stack.

**Live:** [rishi-negi.vercel.app](https://rishi-negi.vercel.app)

The site is styled like an engineer's notebook: warm paper, ink, one teal pen, and margin notes that point at things. The idea is that every project shows how it works, not just what it looks like.

## What's on the page

- **Hero:** a short animated intro. A pen circles "full-stack" and a margin note writes itself in.
- **Work:** two projects.
  - **Applyd**, a full-stack job tracker. It has an architecture diagram that draws itself as you scroll, and screenshots you can open full size.
  - **CleanDeps**, a CLI I published on npm. A terminal replays its real output, including the run where it refuses to delete anything because there's no `package.json`.
- **Experience:** a timeline where a pen line draws down the page as you read. It swerves at the point where I moved from production support to frontend work.
- **About** and **Contact**, with a copyable email and my CV.

## Tech stack

- React 19 and TypeScript (strict)
- Vite, with bun as the package manager
- Tailwind CSS v4, with the colours set up as CSS variables
- GSAP for animation: `useGSAP`, ScrollTrigger, DrawSVG, SplitText and MotionPath
- Self-hosted fonts through Fontsource: Newsreader, Source Sans 3 and Fragment Mono
- `react-icons` (Simple Icons) for the tech logos
- Hosted on Vercel

## How I built this

I built it with Claude Code. I wanted to learn how to work with an AI coding tool properly, not just ask it for a website and accept what came back. This is how I worked:

- **A written brief first.** `CLAUDE.md` holds the design direction, the motion rules, the stack and a list of things to avoid. `content.md` holds every fact about me. Claude reads both at the start of every session, so it can't invent details.
- **Plan before code.** Every section started in plan mode. I read the plan, pushed back on anything I didn't agree with, and only then let it build.
- **One section at a time,** with a commit after each piece that worked.
- **Reviewing every change.** Early on I approved each edit by hand. Once a plan was agreed, I let it build and then went through the diff.
- **Design reviews.** I used the [Impeccable](https://impeccable.style) plugin to critique each section and catch generic, template-looking patterns. I fixed the serious findings and skipped some on purpose.
- **Measuring instead of guessing.** When something looked wrong, I had it reproduce the problem in a headless browser and show numbers before and after the fix. That script is in `scripts/cdp.ts`.

## Things that went wrong, and decisions I changed

**The fonts.** The first plan suggested Space Grotesk and Inter. They're fine fonts, but they're on half the templates on the internet. I asked for alternatives, had Claude build a temporary specimen page, and compared four pairings and three accent colours side by side. I picked Newsreader, Source Sans 3 and Fragment Mono with a deep teal.

**The architecture diagram was wrong.** The first version showed requests going from the React client through Zod to the Express API, as if Zod were a layer in between. It isn't. It's shared code that both sides import. I had it redrawn: the real request path runs along the bottom (client, API, database), and the Zod schemas sit above it with dashed lines into both ends. It's a more honest picture, and it makes the "one source of truth" point better.

**Animations firing late.** Some scroll animations started after their content was already on screen, which looked like a flicker. The cause was web fonts. ScrollTrigger saved each trigger's position when the page loaded, then the fonts arrived, the text reflowed and pushed everything down by 20 to 100px. The fix was to refresh ScrollTrigger once the fonts and images have loaded. I checked it by measuring every trigger before and after.

**The pen loop popped in instead of drawing.** The loop around "full-stack" draws by animating `stroke-dashoffset` from 1 to 0. GSAP rounds pixel values to whole numbers by default, so it jumped straight from 1 to 0. Setting `autoRound: false` fixed it.

**Keeping the CleanDeps replay honest.** The terminal replay only shows output the CLI really prints. The normal run has the path anonymised and the package list visibly shortened, and nothing is made up. When I noticed the CLI's error messages had typos, I fixed them in CleanDeps itself and published a new version, rather than tidying the text only on the website.

**iCloud and git.** The project started on my Desktop, which iCloud was syncing. iCloud started making duplicate files inside `node_modules`, and later renamed git's branch file, so git said the repository had no commits at all. The history was fine. I renamed the file back and moved my projects to `~/Developer`, where nothing syncs them.

## Accessibility and performance

- Every animation is built inside a `prefers-reduced-motion` check. With reduced motion turned on, you see the finished page with nothing moving.
- Content is never hidden in the HTML. Anything an animation hides is hidden from JavaScript, with a timeout fallback, so if a script fails the page is still readable.
- Keyboard: a skip link, visible focus rings, and a native `<dialog>` for the enlarged screenshots.
- Screen readers get text versions of the diagram, the terminal and the margin notes.
- Tap targets are at least 44px, and nothing scrolls sideways down to 320px wide.
- Lighthouse on mobile (PageSpeed Insights): 92 performance, 100 accessibility, 100 best practices, 100 SEO.

## Running locally

You need [bun](https://bun.sh).

```bash
bun install
bun run dev
```

Other scripts:

```bash
bun run build   # type-check and build
bun run lint
```

## Where things live

- `src/content.ts` has all the copy and facts. Components read from it, so text isn't scattered through the JSX.
- `src/components/` has one file per section, plus shared pieces like `PenMark` and `MarginNote`.
- `src/lib/gsap.ts` registers the GSAP plugins and has the `playOnceInView` helper that most animations use.
- `scripts/` has the headless Chrome measuring script and the script that renders the social preview images.
- `CLAUDE.md` and `PRODUCT.md` are the briefs the site was built from.

The code is here to read. Please don't reuse the content or the photos.
