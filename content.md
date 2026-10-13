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
- CV: /public/Rishi-Negi-CV.pdf, linked as "CV (PDF)"
- Photo: /public/rishi.jpg (to add)
- Phone number: never shown as text on the site. It may appear inside the downloadable
  CV PDF (Rishi's decision).

## Positioning / story

Production support engineer turned frontend developer. Likes understanding how things
actually work under the hood, not just making them look like they do. Stepped outside the
frontend comfort zone to self-teach a Node/Express backend and ship a full-stack app
end-to-end. Looking for a high-autonomy, technically deep team in London.
4+ years in software engineering (Coforge 2019–2022, RapinnoTech 2022–2023).

## Featured projects

### 1. Applyd (job application tracker)

- Name: Applyd; descriptor "job application tracker"

- Links: repo https://github.com/rishnegi7711/job-tracker · live https://job-tracker-steel-ten.vercel.app
- Status: live, in active development
- What: full-stack app to track job applications and interview rounds, replacing the
  spreadsheet most people use. Board view by status, per-application interview history,
  private multi-user accounts.
- Stack: React, TypeScript, Vite, TanStack Query, React Router, Tailwind, shadcn/ui,
  React Hook Form, Zod · Node.js, Express, TypeScript, Prisma, PostgreSQL (Neon), JWT, bcrypt ·
  Vitest, ESLint, Prettier · Vercel (frontend), Render (backend)
- Engineering story (case-study angles):
  - Built the Express backend from scratch alongside the React frontend: a deliberate push
    into unfamiliar territory.
  - JWT auth with per-route access control; bcrypt password hashing.
  - Full CRUD across applications, statuses and user accounts.
  - Three shared Zod schemas: React Hook Form and the API validate against the same ones,
    so there's no duplicate client/server validation.
  - TanStack Query for server state and client-side caching.
- Assets: screenshots in /public/job-tracker/ (board, detail, validation; WebP)

### 2. CleanDeps CLI

- Links: npm https://www.npmjs.com/package/cleandeps-cli · repo https://github.com/rishnegi7711/cleandeps-cli
- Version: 0.2.0 · requires Node 18.3 or later
- Install: `npm install -g cleandeps-cli` (or run once with `npx cleandeps-cli`)
- What: one cross-platform command that safely wipes node_modules and reinstalls.
- Details: validates package.json is present; supports npm, yarn and bun.
- Options (all opt-in):
  - `-l, --lock`: also deletes the lockfile, so versions are resolved again (they may change).
  - `-c, --cache`: clears the package manager's cache before installing
    (`npm cache clean --force`, `bun pm cache rm` or `yarn cache clean`).
  - `-r, --run <script>`: runs a package.json script once the install finishes, e.g. `--run dev`.
  - `-v, --version`, `-h, --help`.
  - Full reset example: `cleandeps --lock --cache --run dev`
- Stack: Node.js, npm
- Why: got tired of typing `rm -rf node_modules && npm i` several times a week, so made it
  one command — and used it as a reason to learn how Node CLIs work from scratch.
- Engineering story (case-study angles):
  - Detects the package manager from the lockfile: package-lock.json, bun.lock, bun.lockb,
    then yarn.lock; first match wins. With no lockfile it stops instead of guessing.
  - Package managers live in one array, so supporting a new one means adding one object.
  - Checks before deleting: package.json exists and is valid JSON, a lockfile exists, and
    the `--run` script is defined. If any check fails, nothing is touched.
  - Flags are opt-in; plain `cleandeps` does the same clean reinstall.
  - If node_modules doesn't exist, it skips the delete and just installs instead of crashing.
  - Cross-platform: uses Node's fs and path modules instead of shell commands like rm -rf, so
    it behaves the same on macOS, Linux and Windows.
- Terminal replay (signature motion moment) should show two scenarios: a normal run, and a
  "wrong folder" run where it refuses because there's no package.json. Use the real output
  strings from `bin/cleandeps.js`. Wrong-folder transcript (v0.2.0):

  ```
  $ cleandeps
  ❌ CleanDeps: No package.json found in this folder
  ➡️ Run this command inside a Node project (where package.json exists).
  ```

## Selected work (professional)

### RapinnoTech · Software Developer · Hyderabad · May 2022 – Aug 2023

- Built the React frontend for HDFC Life's offline quote tool, so sales agents could generate
  quotes in the field. Quote generation became 50% faster.
- Helped redesign the app as a single page when management asked to fold a 2–3 page flow
  into one screen: walked senior product management through the codebase, and worked with
  the other developers to rebuild the core Redux state logic for it.
- Handled sign-in and session logic in Redux, including REST API calls and token handling,
  and fixed the sign-in failures field agents kept reporting.
- Rebuilt the Employee Notifier UI in React and wrote shared Button, Modal and Tab components
  that the rest of the product team adopted.
- Added new products with product managers over Agile sprints and redesigned the main
  screens, raising user engagement by 20%.

### Coforge · Software Engineer · Greater Noida · 2019 – 2022

- Automated recurring operational reports with shell scripts, cutting manual reporting time
  for 5–6 business teams.
- Supported a live production system for British Airways, resolving ~350 incidents per year
  within SLA.
- Led the migration of production servers from RHEL5 to RHEL7 for business-critical workloads.

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
