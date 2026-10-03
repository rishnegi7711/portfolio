# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are recruiters and engineers evaluating Rishi Negi for junior frontend
(React + TypeScript) or full-stack roles in London. They arrive to screen him quickly and
to judge the site itself as a work sample, not just its content.

## Product Purpose

A personal portfolio whose success is measured in interview callbacks: a visitor who lands
on the site decides to reach out or move Rishi to interview. It works by presenting his
identity, story, projects and experience clearly, and by demonstrating engineering craft in
the build itself (code quality, accessibility, performance).

## Positioning

A production-support engineer turned frontend developer who stepped outside his comfort
zone to self-teach a Node/Express backend and ship a full-stack app end-to-end. The
differentiator is depth: he cares how things actually work under the hood, not just how
they look, and he is looking for a high-autonomy, technically deep team.

## Operating Context

- Single-page site with anchor navigation; no separate routed pages at this time (revisit
  only if case-study pages are explicitly requested later).
- Deployed on Vercel (`*.vercel.app` to start).
- All copy, facts and links are sourced from `content.md` in the project root — never
  invented. Missing facts must be asked about, not fabricated.

## Capabilities and Constraints

- Stack is fixed by the project owner, not open for framework debate: React + TypeScript
  (strict) + Vite, Tailwind CSS with CSS variables for design tokens, GSAP (`gsap` +
  `@gsap/react`) for animation, `react-icons/si` for tech logos. No new dependency without asking why.
- The user is learning Claude Code and must be able to explain every line; work proceeds
  one section at a time with the approach proposed and approved before building.
- Featured projects: Applyd, a job application tracker (full-stack, live), and CleanDeps CLI (npm
  package). Their signature motion moments (SVG annotation draw-ins, an animated CLI replay
  for CleanDeps, a scroll-driven architecture diagram for Applyd) are committed
  product facts, not open design choices.

## Brand Commitments

- Name: Rishi Negi. Role headline: "Frontend engineer (React + TypeScript), growing into
  full-stack." Location: London, UK. Right to work: Graduate Visa, valid until September
  2027 — recorded in `content.md` only; deliberately not shown anywhere on the site.
- Hero fact line: city plus coordinates ("London · 51.51° N, 0.13° W"), nothing else.
- Voice: understated, technically grounded, emphasizes understanding mechanisms over
  surface polish.
- Do not publish the phone number.

## Evidence on Hand

- Identity, positioning, project details, work history and toolkit are fully specified in
  `content.md` — treat as the single source of truth for all facts.
- CV PDF and a profile photo are referenced in `content.md` as "to add" — not yet available;
  do not fabricate placeholders that look like real content.
- Applyd (job application tracker): live at https://job-tracker-steel-ten.vercel.app, repo at
  https://github.com/rishnegi7711/job-tracker. Screenshots (board, detail, validation;
  WebP) are in `/public/job-tracker/`.
- CleanDeps CLI (v0.2.0): published at https://www.npmjs.com/package/cleandeps-cli; repo at
  https://github.com/rishnegi7711/cleandeps-cli.

## Product Principles

1. The site is itself a work sample — code and craft are judged alongside content.
2. Never invent facts, metrics, projects or assets; ask when something is missing.
3. Motion and visual devices must explain or guide (e.g. how a system works), never
   decorate for their own sake.
4. Depth over polish in the story: prefer showing how things work under the hood to
   generic self-promotion.
5. Build incrementally, one section at a time, with the user able to explain every line.
