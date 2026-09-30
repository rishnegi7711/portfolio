# Site content (source of truth)

Everything the site says comes from here. Edit this file to change the facts; don't let
Claude invent anything.

## Identity

- Name: Rishi Negi
- Role headline: Frontend engineer (React + TypeScript), growing into full-stack
- Location: London, UK
- Right to work: Graduate Visa, valid until September 2027
- Email: rishnegi28@gmail.com
- GitHub: https://github.com/rishnegi7711
- LinkedIn: https://www.linkedin.com/in/rishi-negi-a9057a207/
- CV: link to a PDF in /public (to add)
- Photo: /public/rishi.jpg (to add)
- DO NOT publish the phone number.

## Positioning / story

Production support engineer turned frontend developer. Likes understanding how things
actually work under the hood, not just making them look like they do. Stepped outside the
frontend comfort zone to self-teach a Node/Express backend and ship a full-stack app
end-to-end. Looking for a high-autonomy, technically deep team in London.

## Featured projects

### 1. Job Application Tracker

- Links: repo https://github.com/rishnegi7711/job-tracker · live https://job-tracker-steel-ten.vercel.app
- Status: live, small tweaks in progress
- What: full-stack app to track job applications and interview rounds, replacing the
  spreadsheet most people use. Board view by status, per-application interview history,
  private multi-user accounts.
- Stack: React, TypeScript, Vite, TanStack Query, React Router, Tailwind, shadcn/ui,
  React Hook Form, Zod · Node.js, Express, TypeScript, Prisma, PostgreSQL (Neon), JWT, bcrypt ·
  Vitest, ESLint, Prettier · Vercel (frontend), Render (backend)
- Engineering story (case-study angles):
  - Built the Express backend from scratch: a deliberate push into unfamiliar territory.
  - JWT auth with per-route access control; bcrypt password hashing.
  - Shared Zod schemas: React Hook Form and the API validate against one source of truth.
  - TanStack Query for server state and client-side caching.
- Assets: screenshots / short screen recording (to add)

### 2. CleanDeps CLI

- Links: npm https://www.npmjs.com/package/cleandeps-cli · repo https://github.com/rishnegi7711/cleandeps-cli
- What: one cross-platform command that safely wipes node_modules and reinstalls.
- Details: validates package.json is present; supports npm, yarn and bun.
- Stack: Node.js, npm
- Why: got tired of typing `rm -rf node_modules && npm i` several times a week, so made it
  one command — and used it as a reason to learn how Node CLIs work from scratch.
- Engineering story (case-study angles):
  - Detects the package manager from the lockfile: package-lock.json, bun.lock, bun.lockb,
    then yarn.lock; first match wins.
  - Package managers live in one array, so supporting a new one means adding one object.
  - Safety: refuses to run without a package.json, so it can't delete anything in the wrong
    folder.
  - If node_modules doesn't exist, it skips the delete and just installs instead of crashing.
  - Cross-platform: uses Node's fs and path modules instead of shell commands like rm -rf, so
    it behaves the same on macOS, Linux and Windows.
- Terminal replay (signature motion moment) should show two scenarios: a normal run, and a
  "wrong folder" run where it refuses because there's no package.json.

## Selected work (professional)

### RapinnoTech · Software Developer · Hyderabad · May 2022 – Aug 2023

- Rebuilt the Employee Notifier UI in React; standardised reusable component patterns
  (Buttons, Modals, Tabs) adopted product-wide, reducing duplicate UI code.
- Redux-based authentication and session handling for a live app used by 1,000+ field agents,
  eliminating a recurring class of sign-in failures.
- Built the frontend for the HDFC Life Offline Quote application (live insurance quoting for
  sales agents), improving quote generation speed by 50%.
- Full UI overhaul that increased user engagement by 30%, working with PMs and designers
  in Agile sprints.

### Coforge · Software Engineer · Greater Noida · 2019 – 2022

- Supported a live production system for British Airways: ~350 incidents a year within a
  90-minute SLA.
- Led migration of production servers from RHEL5 to RHEL7 on an unfamiliar legacy codebase.

### 2023 – 2025

- One line only: MSc in Software Engineering in London while working part-time and building
  the projects above. (Tesco role not listed separately on the site.)

## Education

- MSc Software Engineering, University of West London (Oct 2023 – Jul 2025). Dissertation:
  comparative evaluation of GraphQL and REST API integration approaches.
- BTech Computer Science, DIT University (2014 – 2018)

## Toolkit (icon section)

- Frontend: React, TypeScript, JavaScript, Redux, Tailwind CSS, HTML5, CSS3, React Hook Form
- APIs & data: REST, GraphQL, TanStack Query, Zod
- Backend: Node.js, Express, PostgreSQL, Prisma, JWT
- Tooling: Git, Vite, Vitest, ESLint, Prettier, Linux, Vercel
