# rishinegi.com

My portfolio site. I'm a full-stack engineer in London, working in React, TypeScript and Node, and building with AI coding agents.

**Live:** [rishinegi.com](https://www.rishinegi.com)

The site is styled like an engineer's notebook: warm paper, ink, one teal pen, and margin notes that point at things. The idea is that every project shows how it works, not just what it looks like.

## What's on the page

- **Hero:** a short animated intro. A pen circles "AI coding agents" and a margin note writes itself in.
- **Work:** two projects.
  - **Applyd**, a full-stack job tracker I built by hand and then rebuilt with Claude Code. The entry is compact: a before/after slider of the old dark board against the redesign (it sweeps once when it scrolls into view, then it's yours to drag), the two phases in four bullets, the live demo with its login, and an architecture diagram that draws itself as you scroll.
  - **CleanDeps**, a CLI I published on npm. A terminal replays its real output, including the run where it refuses to delete anything because there's no `package.json`.
- **Applyd case study** (`/work/applyd`): the longer story. It covers the hand-built phase, the Claude Code phase, the redesign and how I work with Claude Code, plus five decisions where the obvious answer was wrong and a roadmap that is clearly marked as planned. Along the way:
  - the old form and detail screens, which open full size;
  - the new board in light and dark, switched by a control;
  - a short muted video of Applyd's own animations, which plays only while it's on screen and has a pause button;
  - the board with three details circled in pen and numbered, which also opens larger, circles included.
- **Experience:** a timeline where a pen line draws down the page as you read. It swerves at the point where I moved from production support to frontend work.
- **About** and **Contact**, with a copyable email and my CV.

## Tech stack

- React 19 and TypeScript (strict)
- Vite, with bun as the package manager
- Tailwind CSS v4, with the colours set up as CSS variables
- GSAP for animation: `useGSAP`, ScrollTrigger, DrawSVG, SplitText and MotionPath
- Self-hosted fonts through Fontsource: Newsreader, Source Sans 3 and Fragment Mono
- `react-icons` (Simple Icons) for the tech logos
- React Router, for the one extra page (`/work/applyd`). `vercel.json` sends every path to `index.html`, so a link straight to the case study loads. A small Vite plugin also writes a copy of `index.html` for that page at build time, with its own title, description and preview image, so a shared link previews as the case study (see below).
- Hosted on Vercel at [rishinegi.com](https://www.rishinegi.com)

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

**The pen loop popped in instead of drawing.** The loop around "AI coding agents" draws by animating `stroke-dashoffset` from 1 to 0. GSAP rounds pixel values to whole numbers by default, so it jumped straight from 1 to 0. Setting `autoRound: false` fixed it.

**Keeping the CleanDeps replay honest.** The terminal replay only shows output the CLI really prints. The normal run has the path anonymised and the package list visibly shortened, and nothing is made up. When I noticed the CLI's error messages had typos, I fixed them in CleanDeps itself and published a new version, rather than tidying the text only on the website.

**Link previews showed the wrong page.** Slack, LinkedIn and X build a preview from the raw HTML and don't run JavaScript. Every address on the site returns the same `index.html`, so a shared link to the case study previewed as the home page, with the home page's title, image and canonical. Setting the tags from React fixed the browser tab and Google, but not those scrapers. The fix is a small Vite plugin (in `vite.config.ts`) that, at the end of `vite build`, writes `dist/work/applyd/index.html`: the same file with ten tags swapped. Vercel serves a real file before it applies the catch-all rewrite, so that file answers for `/work/applyd` and everything else is unchanged. It is not a prerender: the page body is still empty until JavaScript runs, and the plugin fails the build if a tag goes missing or the home page's tags drift from `src/content.ts`. When I first rendered the preview image, the screenshot in it looked choppy, because it was a small WebP scaled down. The script now crops the full-resolution capture and renders the card at 2x before downscaling.

**iCloud and git.** The project started on my Desktop, which iCloud was syncing. iCloud started making duplicate files inside `node_modules`, and later renamed git's branch file, so git said the repository had no commits at all. The history was fine. I renamed the file back and moved my projects to `~/Developer`, where nothing syncs them.

## Accessibility and performance

- Every animation is built inside a `prefers-reduced-motion` check. With reduced motion turned on, you see the finished page with nothing moving.
- Content is never hidden in the HTML. Anything an animation hides is hidden from JavaScript, with a timeout fallback, so if a script fails the page is still readable.
- Keyboard: a skip link, visible focus rings, and a native `<dialog>` for the enlarged screenshots.
- The before/after slider is a native range input laid invisibly over the image, so the arrow keys, Home, End and Page Up and Down work, and it is announced with its value. The Light and Dark control is a native radio group.
- The case study's video plays only while it's on screen, has a pause button that stays paused, and with reduced motion isn't loaded at all: you get a still instead.
- Screen readers get text versions of the diagram, the terminal and the margin notes.
- Tap targets are at least 44px, and nothing scrolls sideways down to 320px wide.
- Lighthouse, mobile preset, run against the deployed site (median of three runs):

  | Page | Performance | Accessibility | Best practices | SEO |
  | --- | --- | --- | --- | --- |
  | `/` | 95 | 100 | 100 | 100 |
  | `/work/applyd` | 96 | 100 | 100 | 100 |

  These are lab numbers. An occasional run lands around 90, usually on a cold first load, so treat them as a range of about 90 to 97.

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
- `src/pages/` has the home page, the Applyd case study and the 404, and `src/router.tsx` says which address shows which.
- `src/components/` has one file per section, plus shared pieces like `PenMark`, `MarginNote`, `BeforeAfter` and `MotionLoop`.
- `src/lib/gsap.ts` registers the GSAP plugins and has the `playOnceInView` helper that most animations use.
- `vite.config.ts` has the page-previews plugin described above. `pageMeta` in `src/content.ts` holds each page's title and description.
- `scripts/` is for development only, and needs Google Chrome. `cdp.ts` measures the live page. `capture-applyd.ts` screenshots Applyd's live demo (read-only, through its public demo login) and exports the images, and `record-applyd.ts` films the loop from it; both use `lib/applyd-demo.ts`. `og-image.tsx` and `og-applyd.tsx` render the two link-preview images in `public/` (they share `lib/render-card.ts`, and re-run them when the text they show changes), and `linkedin-banner.tsx` renders the LinkedIn banner.
- `CLAUDE.md` and `PRODUCT.md` are the briefs the site was built from.

The code is here to read. Please don't reuse the content or the photos.
