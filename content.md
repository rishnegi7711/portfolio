# Site content (source of truth)

Everything the site says comes from here. Edit this file to change the facts; don't let
Claude invent anything.

## Identity

- Name: Rishi Negi
- Role headline: Full-stack engineer, building with AI coding agents
- Hero mark (the pen loop): "AI coding agents"
- Location: London, UK
- Right to work: Graduate Visa, valid until September 2027
- Email: rishi@rishinegi.com
- GitHub: https://github.com/rishnegi7711
- LinkedIn: https://www.linkedin.com/in/rishi-negi-a9057a207/
- CV: /public/Rishi-Negi-CV.pdf, linked as "CV (PDF)"
- Photo: /public/rishi.jpg (to add)
- Phone number: never shown as text on the site. It may appear inside the downloadable
  CV PDF (Rishi's decision).

## Positioning / story

Production support engineer turned frontend developer, now a full-stack engineer who
builds with AI coding agents. Likes understanding how things actually work under the hood,
not just making them look like they do. Stepped outside the frontend comfort zone to
self-teach a Node/Express backend and ship a full-stack app end-to-end, then rebuilt and
extended that app with Claude Code to learn how to plan, steer and review an AI coding
agent. Learning and building, not claiming to be an AI engineer: Applyd has no AI
features yet, they are planned. Looking for a high-autonomy, technically deep team in
London. 4+ years in software engineering (Coforge 2019–2022, RapinnoTech 2022–2023).

Writing rules for site copy (from the Applyd brief): no em dashes, no filler words
("seamless", "robust", "leverage", "cutting-edge", "passionate"), short sentences,
British English. Never "AI engineer", "expert" or "production AI system".

Skills line: Building with AI coding agents: plan-first workflows, project memory,
enforced permissions, agent code review, and reviewing third-party skills before
trusting them.

## Featured projects

### 1. Applyd (job application tracker)

- Name: Applyd; descriptor "job application tracker"

- Links: repo https://github.com/rishnegi7711/job-tracker · live https://job-tracker-steel-ten.vercel.app
- Case study page: /work/applyd (on this site)
- Demo login: testUser@test.com / Password7711. The backend is on a free Render instance
  and can take up to a minute to wake up.
- Status: live, in active development
- One line: a job tracker I built by hand to learn full-stack development, then rebuilt
  and extended with Claude Code to learn how to plan, steer and review an AI coding agent.
- What: full-stack app to track job applications and interview rounds, replacing the
  spreadsheet most people use. Board view by status, per-application interview history,
  private multi-user accounts.
- Features today: board grouped by status (Applied, Interviewing, Rejected, Offer);
  interview rounds per application as a timeline (type, date, outcome); register, log in,
  log out, with every query scoped to the signed-in user; create and delete applications
  (deleting also deletes its rounds); light theme by default, a designed warm dark mode,
  and a Light / Dark / System toggle.
- Stack: React, TypeScript, Vite, TanStack Query, React Router, Tailwind, shadcn/ui,
  React Hook Form, Zod · Node.js, Express, TypeScript, Prisma, PostgreSQL (Neon), JWT, bcrypt ·
  Vitest, ESLint, Prettier, GitHub Actions, Bun workspaces · Vercel (frontend), Render
  (backend)
- Engineering story, phase 1 (built by hand, to learn every layer):
  - Built the Express backend from scratch alongside the React frontend: a deliberate push
    into unfamiliar territory. Monorepo with an Express API and a React client.
  - Postgres schema with Prisma on Neon.
  - JWT auth with bcrypt, plus middleware protecting every route.
  - CRUD routes with ownership checks (find, check owner, then act).
  - Three shared Zod schemas: React Hook Form and the API validate against the same ones,
    so there's no duplicate client/server validation.
  - Board and detail views with TanStack Query (server state, client-side caching) and
    React Hook Form.
  - Deployed to Vercel and Render, fixing the build and module errors that only appear in
    production. First server tests with Vitest.
- Engineering story, phase 2 (Claude Code writes, Rishi reviews; from 20 October 2026).
  The deliberate switch: the skill being built is planning, steering and judging changes
  rather than typing them. Rule: he must be able to explain every line that merges.
  - CI with GitHub Actions, proven by deliberately breaking a test and watching it go red,
    then reverting.
  - Logout that clears the query cache, so the next user never sees the previous user's data.
  - Runtime validation: every API response parsed with Zod at the boundary. It immediately
    found a database row with a `null` that a hand-checked sample had missed.
  - Delete with a database migration: deleting an application with interview rounds would
    fail (`ON DELETE RESTRICT`), so added `ON DELETE CASCADE`, and applied it safely to the
    only (production) database: create the migration without running it, read the SQL, then
    apply with a command that can never reset data.
  - Bun workspaces: one install for the monorepo. Proved the existing deploy commands
    still worked on the new layout before pushing, then changed the hosting settings.
  - The full "Paper" UI redesign (below).
- The redesign, a short case study. Goal: make it feel premium, with animation that means
  something.
  - Process: (1) researched design skills and chose a small, deliberate set instead of
    stacking them; (2) with no reference sites, used a prototyping skill to build three
    working login page directions side by side and picked by looking at them: "Paper"
    (warm, calm, Notion-like); (3) wrote the direction down before building: `PRODUCT.md`
    (who it's for, what it must never claim) and `DESIGN.md` (colour tokens for both themes
    with measured contrast, type, spacing, components, motion rules); (4) built in order:
    theme tokens and dark mode, login and register, the top bar with a theme toggle, the
    board, the detail page, the dialogs; (5) reviewed with a code review skill, triaged the
    findings, filed the rest as GitHub issues, merged through a pull request.
  - Light by default with a designed warm dark mode, not an inversion.
  - No flash of the wrong theme: a small script applies the saved theme before the page paints.
  - Motion means placement: cards settle into their columns on first load, the interview
    timeline draws itself in, a newly added round gets a brief highlight.
  - Everything respects the reduced motion setting.
  - WCAG AA as the accessibility target: contrast measured for every text colour,
    keyboard-friendly controls.
  - Iteration from looking at it in the browser: status dots too faint, so they got their
    own stronger colour tokens; count chips vanished in light mode because the contrast had
    been measured against the wrong background, so they went neutral and only the dot
    carries colour; dashed empty-state borders disappeared, so one shared empty-state
    component fixed it everywhere; login success animation shortened from 700ms to 300ms
    because the board's own animation already plays right after.
- How he works with Claude Code:
  - Plan mode first: nothing changes until the plan is approved; product decisions come
    back as questions.
  - Model routing: `opusplan` (Opus plans, Sonnet executes).
  - Project memory: `CLAUDE.md` with commands, conventions, known pitfalls, git rules and
    four working rules (think first, keep it simple, change only what's needed, define how
    success is checked).
  - A definition of done: builds and tests pass, plus his own browser check in both themes.
  - Enforced approvals: permission rules make Claude Code ask before every commit and push,
    even in auto mode. Learned that instructions guide but don't guarantee.
  - Context hygiene: clear the session between unrelated tasks.
  - Reviewing reviews: ran a code review skill, then verified each finding. Some were real,
    some were deliberate decisions the reviewer didn't know about, some line references
    were wrong.
  - Tracking work: follow-ups filed as GitHub issues with "done when" lists and triage labels.
  - Skills and plugins used: Matt Pocock's skills (`/prototype`, `/code-review`, the GitHub
    issue setup); Impeccable (`init` to write `PRODUCT.md`, `extract` to turn the chosen
    prototype into `DESIGN.md`); Taste (design direction, plus a headless Chrome inspector
    for desktop, tablet and mobile screenshots).
  - Third-party tools are treated like dependencies: read before installing (had Claude
    Code list every network call, file write and process in Taste's scripts, then checked
    the key claims himself); installed the minimum (one tool, only for Claude Code, no
    hooks, skill files kept out of git); audited what was installed and removed a plugin
    whose hooks added instructions to every prompt that conflicted with his own review rules.
- Judgement moments (each one a decision where the obvious answer was wrong):
  1. "Consistent" isn't always correct. The agent made the register form clear its error
     on password edits to match login. Reverted: "Email already in use" is only about the
     email, while login's "Invalid credentials" is deliberately vague.
  2. Sorting needs a field and a tie-breaker. The API had no ordering, so the client sorts
     a copy (sorting the cached data in place would corrupt it) by date, then by id.
  3. Reset what the user can't see. Resetting a form when its dialog closed blanked the
     fields during the fade-out. Fixed by remounting the form after the close animation
     finished, which also removed code.
  4. Check cheap causes first. "The page isn't responsive" turned out to be browser zoom
     remembered for the site. Earlier "bugs" were network throttling and a `view-source:`
     prefix.
  5. A missing import, not a missing feature. Dialog animations had never run, because the
     animation library was never imported.
  6. Prove it fails. CI only counted once it had been seen going red.
  7. Fix the cause, not the symptom. Compiled test files were shipping in the server
     build; fixed where they were created, not where they were noticed.
- Planned (not built, and the site must label it "Planned"):
  1. Edit applications in the UI (status and notes).
  2. Status history with dates, so the time between stages can be measured.
  3. A metrics dashboard built from his own real job search: applications per week, where
     applications drop off, how long responses take.
  4. CV and job posting match: a fit score with strengths and gaps as structured output
     validated by Zod, plus an evaluation set to check the scores make sense.
  5. An assistant with tools: server-side tool use (add a round, change a status), scoped
     to the signed-in user, confirmed before any write, then an MCP integration.
- Assets: old dark-UI screenshots in /public/job-tracker/ (board, detail, validation; WebP),
  kept as the "before". New Paper UI screenshots (light and dark) to be captured from the
  live demo.

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

- Developed features for HDFC Life's offline quote tool in React and added new products to it
  with product managers over Agile sprints, so insurance sales agents could quote in the
  field. Quote generation became 50% faster.
- Helped redesign the app as a single page when management asked to fold a 2–3 page flow
  into one screen, and walked senior product management through the codebase on planning
  calls.
- Worked directly with the other developers to extract the core state logic from Redux and
  rebuild it for the single-page version, and fixed the bugs and blockers they hit along the
  way.
- Handled sign-in and session logic in Redux, including REST API calls and token handling,
  and fixed the sign-in failures field agents kept reporting.
- Used Jenkins CI/CD pipelines as part of the team's build and release workflow.
- Rebuilt the Employee Notifier UI in React and wrote shared Button, Modal and Tab components
  that the rest of the product team adopted.
- Built responsive screens from the designers' Figma files and redesigned the main screens,
  raising user engagement by 20%.

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
- Backend: Node.js, Express, PostgreSQL, SQL, Prisma, JWT
- Tooling: Git, Vite, Vitest, ESLint, Prettier, Linux, Shell scripting, Jenkins, Figma, Claude Code, Vercel
