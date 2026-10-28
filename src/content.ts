// Typed content pulled from content.md — the working source of truth for on-site
// copy once this file exists (see CLAUDE.md). Edit content.md when a fact changes,
// edit this file when only the copy changes.

export type Identity = {
  name: string
  /** full role line, used outside the hero (e.g. a future About section) */
  roleHeadline: string
  /** short role line sized for the hero's large display type */
  heroRole: string
  /** the phrase inside heroRole that the pen loop circles; must appear in it verbatim */
  heroMark: string
  location: string
  /** shown after the city in the hero's fact line */
  heroFact: string
  email: string
  github: string
  linkedin: string
  /** null until a CV PDF is added to /public */
  cvUrl: string | null
  /** cropped, optimised copy of the original photo, used in About */
  photo: { src: string; width: number; height: number; alt: string; caption: string }
  /** first-person copy for the hero's signature margin annotation */
  heroAnnotation: string
}

export const identity: Identity = {
  name: 'Rishi Negi',
  roleHeadline: 'Full-stack engineer, building with AI coding agents',
  heroRole: 'Full-stack engineer, building with AI coding agents',
  heroMark: 'AI coding agents',
  location: 'London, UK',
  heroFact: '4+ years in software engineering',
  email: 'rishi@rishinegi.com',
  github: 'https://github.com/rishnegi7711',
  linkedin: 'https://www.linkedin.com/in/rishi-negi-a9057a207/',
  cvUrl: '/Rishi-Negi-CV.pdf',
  photo: {
    src: '/about/rishi.webp',
    width: 416,
    height: 520,
    alt: 'Rishi Negi, smiling, in glasses, a navy suit and tie against a plain white background.',
    /** shown after an auto-numbered "Fig. n —" */
    caption: 'the person who reads the error messages',
  },
  heroAnnotation:
    'Built Applyd by hand to learn every layer. Then rebuilt it directing Claude Code, ' +
    'and reviewed every change.',
}

/** What each page tells browsers, search engines and link previews about itself. The pages
 *  call usePageMeta with these. Home's are also written into index.html (crawlers that don't
 *  run JavaScript read that), and vite.config.ts checks the two agree. The case study's go
 *  into its own generated copy of index.html (dist/work/applyd/index.html) at build time,
 *  which is what lets Slack, LinkedIn and the like preview it. */
export const pageMeta = {
  home: {
    title: 'Rishi Negi, full-stack engineer in London',
    description:
      'Full-stack engineer in London, building with AI coding agents. Former production ' +
      'support engineer who likes understanding how things work.',
  },
  applyd: {
    path: '/work/applyd',
    title: 'Applyd case study | Rishi Negi',
    description:
      'How I built Applyd, a job application tracker, by hand and then with Claude Code.',
    /** the link-preview image, made by scripts/og-applyd.tsx */
    ogImage: '/og-applyd.png',
    ogImageAlt:
      'Applyd, a job application tracker. A case study: one job tracker, built by hand ' +
      'and then with Claude Code. Beside the title, a screenshot of its Paper redesign. ' +
      'rishinegi.com/work/applyd',
  },
}

/** Page sections, in order. The header nav and the page both render from this list,
 *  so a nav link can never point at a section that doesn't exist. */
export const sections = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

/** The Contact section's line. */
export const contact = {
  line: 'Hiring for a frontend or full-stack role? Email is the quickest way to reach me.',
}

/** Status messages for the copy buttons (Contact's email, CleanDeps' install command). */
export const clipboard = {
  copied: 'Copied',
  // Shown when the Clipboard API fails; the text is selected for the shortcut.
  copyFallback: 'Press Ctrl+C or Cmd+C to copy',
}

/** After each screenshot's caption: the figure opens full size. */
export const figureEnlargeHint = 'Tap or click to enlarge'

/** After the before/after slider's caption: how to move it. */
export const compareHint = 'Drag, or use the arrow keys'

/** The footer colophon: what the site is built with, each linking to its site. */
export const colophon = [
  { label: 'React', url: 'https://react.dev' },
  { label: 'Tailwind', url: 'https://tailwindcss.com' },
  { label: 'GSAP', url: 'https://gsap.com' },
  { label: 'Claude Code', url: 'https://claude.com/claude-code' },
]

/** The About section's story, one string per paragraph. */
export const story = [
  "I've spent 4+ years in software engineering, starting in production support. " +
    'For three years I looked after a live British Airways system, and when something broke, my job was to find out why. That habit ' +
    'stayed with me: I want to know how a thing actually works, not just how it looks.',
  'In 2022 I moved into frontend work, building React apps used by field and sales ' +
    'agents. In 2023 I came to London for an MSc in Software Engineering and used the ' +
    'time to learn the backend: Node, Express and PostgreSQL. Applyd is what came out of that.',
  'These days I work with an AI coding agent. Claude Code writes the code; I plan the ' +
    'work, review every change and set the rules it works within. Knowing when its answer ' +
    "is wrong is the skill I'm building most deliberately.",
  "Now I'm looking for a junior frontend or full-stack role in London, on a team that " +
    'goes deep technically and gives people room to own their work.',
]

export type ProjectLink = {
  label: string
  url: string
}

export type Figure = {
  src: string
  width: number
  height: number
  alt: string
  /** shown after an auto-numbered "Fig. n —" */
  caption: string
  /** the uncropped screenshot, opened by clicking the figure */
  full: { src: string; width: number; height: number }
}

/** One side of the before/after slider: the same crop of the same screen, in two sizes. */
export type CompareImage = {
  /** header plus three columns, 2:1 (sm and up) */
  src: string
  /** header plus the first column, 33:38 (below sm, where three columns would be unreadable) */
  mobileSrc: string
  alt: string
}

export type Compare = {
  /** shown after an auto-numbered "Fig. n —" */
  caption: string
  /** the old design is on the left of the divider, the new one on the right */
  before: CompareImage
  after: CompareImage
}

/** A short muted video of the app, with a still for people who ask for reduced motion. */
export type MotionFigure = {
  /** shown after an auto-numbered "Fig. n —" */
  caption: string
  /** what the clip shows, for assistive technology */
  alt: string
  webm: string
  mp4: string
  /** the first frame: shown before the video plays, and instead of it with reduced motion */
  poster: string
  width: number
  height: number
}

/** A screenshot with numbered pen circles drawn over parts of it, and a note for each. */
export type AnnotatedFigure = {
  src: string
  width: number
  height: number
  alt: string
  /** shown after an auto-numbered "Fig. n —" */
  caption: string
  /** the same crop at twice the size, for the enlarged view (the pen circles are drawn over it too) */
  full: { src: string; width: number; height: number }
  /** the screenshot's size in CSS px (what the capture saw): marks are placed in these units */
  view: { width: number; height: number }
  marks: {
    /** the pen circle's bounding box */
    circle: { x: number; y: number; w: number; h: number }
    /** where the mark's number sits, centred on this point */
    number: { x: number; y: number }
    note: string
  }[]
}

/** The same screen in the redesign's two themes, switched by a Light / Dark control. */
export type ThemeFigure = {
  /** shown after an auto-numbered "Fig. n —" */
  caption: string
  light: CompareImage
  dark: CompareImage
}

export type ArchitectureNode = {
  label: string
  /** one per line */
  details: string[]
}

export type Architecture = {
  caption: string
  /** the diagram in words, for screen readers (the drawn lines and labels are hidden) */
  description: string
  /** the request path, in order: client, API, database */
  path: [ArchitectureNode, ArchitectureNode, ArchitectureNode]
  /** connector labels between path nodes: client ↔ API, API ↔ database */
  pathLinks: [string, string]
  /** code imported by the first two path nodes, drawn above them as the focal node */
  shared: ArchitectureNode
  /** labels on the dashed lines from the shared node to the client and to the API */
  sharedLinks: [string, string]
}

export type Project = {
  id: string
  name: string
  /** what kind of thing it is, shown under the name */
  descriptor: string
  status: string
  summary: string
  /** margin note under the project's figure (the slider or the terminal), with its arrow */
  annotation: string
  /** the details list under the project; Applyd's lives on its case study page */
  stack?: ToolkitGroup[]
  /** heading above engineeringStory */
  storyHeading: string
  engineeringStory: string[]
  links: ProjectLink[]
  /** a link to the project's own page on this site (a router link, not an external one) */
  caseStudy?: { label: string; to: string }
  /** a line under the links, e.g. how to try the live demo */
  demoNote?: string
  /** old design and new, as a draggable before/after slider */
  compare?: Compare
  architecture?: Architecture
  /** real CLI output for the terminal replay, one scenario per run */
  terminal?: {
    /** shown after an auto-numbered "Fig. n —" */
    caption: string
    /** the copy-able install command under the replay */
    install: string
    normalRun: TerminalLine[]
    wrongFolderRun: TerminalLine[]
  }
}

export type TerminalLine = {
  text: string
  /** output from the package manager, not the CLI itself; rendered dimmed */
  dim?: boolean
}

export const projects: Project[] = [
  {
    id: 'job-tracker',
    name: 'Applyd',
    descriptor: 'Job application tracker',
    status: 'Live, in active development',
    summary: 'A job application tracker: board view, interview timelines, and light and dark themes.',
    annotation: 'The same board before and after the redesign.',
    demoNote:
      'Demo login: testUser@test.com / Password7711. The server is on a free plan and can ' +
      'take up to a minute to wake up.',
    storyHeading: 'How it was built',
    engineeringStory: [
      'Built by hand first: an Express API and a React client, Postgres through Prisma, ' +
        'JWT auth, and Zod schemas shared by both sides.',
      'Then switched to Claude Code. It writes, I plan and review, and I must be able to ' +
        'explain every line that merges.',
      'Since then: CI with GitHub Actions, Zod checks on every API response, and a safe ' +
        'migration on the production database.',
      'A full redesign, "Paper", with a written design system and a designed warm dark mode.',
    ],
    links: [
      { label: 'Live', url: 'https://job-tracker-steel-ten.vercel.app' },
      { label: 'Repo', url: 'https://github.com/rishnegi7711/job-tracker' },
    ],
    caseStudy: { label: 'Read the case study', to: '/work/applyd' },
    // The same crop of the same screen, old and new; see scripts/capture-applyd.ts.
    compare: {
      caption: "Applyd's board, old design and new design",
      before: {
        src: '/job-tracker/board-before.webp',
        mobileSrc: '/job-tracker/board-before-mobile.webp',
        alt:
          "The original dark design of Applyd's board: a black page with Applied, " +
          'Interviewing and Rejected columns of plain company cards.',
      },
      after: {
        src: '/job-tracker/board-paper-light.webp',
        mobileSrc: '/job-tracker/board-paper-light-mobile.webp',
        alt:
          'The Paper redesign of the same board: a warm off-white page with a serif ' +
          'Applications heading, and coloured status dots and count chips on each column.',
      },
    },
    architecture: {
      caption: 'Architecture: the request path, with Zod schemas imported by client and API',
      description:
        'The React client talks to the Express API over HTTP / JSON, and the API reaches ' +
        'PostgreSQL through Prisma. Both the client and the API import the same shared Zod ' +
        'schemas: the client to validate forms, the API to validate requests.',
      path: [
        { label: 'React client', details: ['React Hook Form', 'TanStack Query'] },
        { label: 'Express API', details: ['JWT auth', 'bcrypt'] },
        { label: 'PostgreSQL', details: ['hosted on Neon'] },
      ],
      pathLinks: ['HTTP / JSON', 'Prisma'],
      shared: { label: 'Shared Zod schemas', details: ['imported by both'] },
      sharedLinks: ['validates forms', 'validates requests'],
    },
  },
  {
    id: 'cleandeps',
    name: 'CleanDeps CLI',
    descriptor: 'npm package',
    status: 'Published, v0.2.0',
    summary:
      'One cross-platform command that safely wipes node_modules and reinstalls. ' +
      'Supports npm, yarn and bun. Opt-in flags also delete the lockfile (--lock), ' +
      'clear the cache (--cache) or run a script afterwards (--run\u00A0dev).',
    // "rm\u00A0-rf": the non-breaking space and noBreakHyphens keep the command on one line.
    annotation:
      'Got tired of typing rm\u00A0-rf node_modules && npm i several times a week, so made ' +
      'it one command — and used it as a reason to learn how Node CLIs work from scratch.',
    stack: [{ label: 'Built with', items: ['Node.js', 'npm'] }],
    storyHeading: 'How it works',
    engineeringStory: [
      'Detects the package manager from the lockfile: package-lock.json, bun.lock, ' +
        'bun.lockb, then yarn.lock; first match wins. With no lockfile it stops instead of guessing.',
      'Package managers live in one array, so supporting a new one means adding one object.',
      'Checks before deleting: package.json exists and is valid JSON, a lockfile exists, ' +
        'and the --run script is defined. If any check fails, nothing is touched.',
      'Flags are opt-in; plain cleandeps does the same clean reinstall.',
      "If node_modules doesn't exist, it skips the delete and just installs instead of crashing.",
      "Cross-platform: uses Node's fs and path modules instead of shell commands like " +
        'rm\u00A0-rf, so it behaves the same on macOS, Linux and Windows.',
    ],
    links: [
      { label: 'npm', url: 'https://www.npmjs.com/package/cleandeps-cli' },
      { label: 'Repo', url: 'https://github.com/rishnegi7711/cleandeps-cli' },
    ],
    // Captured from real runs of v0.2.0; keep in sync if the CLI changes. The normal
    // run's path is anonymised and its package list cut, with a visible "… 14 more".
    terminal: {
      caption: 'Replay of real output from v0.2.0: a normal run and a wrong-folder run',
      install: 'npm install -g cleandeps-cli',
      normalRun: [
        { text: '$ cleandeps' },
        { text: '✅ Found package.json' },
        { text: '📁 Project: ~/projects/my-app' },
        { text: '🗑️ Removing node_modules...' },
        { text: '✅ node_modules removed' },
        { text: '📦 Installing dependencies...' },
        { text: 'bun install v1.3.9', dim: true },
        { text: '+ react@19.2.3', dim: true },
        { text: '+ react-dom@19.2.3', dim: true },
        { text: '+ typescript@5.9.3', dim: true },
        { text: '+ tailwindcss@4.2.1', dim: true },
        { text: '  … 14 more', dim: true },
        { text: '665 packages installed [837.00ms]', dim: true },
        { text: '✅ Dependencies installed' },
      ],
      wrongFolderRun: [
        { text: '$ cleandeps' },
        { text: '❌ CleanDeps: No package.json found in this folder' },
        { text: '➡️ Run this command inside a Node project (where package.json exists).' },
      ],
    },
  },
]

/** The Applyd case study page (/work/applyd). Written from notes/applyd-portfolio-brief.md. */
export const applydCaseStudy = {
  title: 'Applyd',
  subtitle: 'A case study: one job tracker, built by hand and then with Claude Code',
  intro:
    'I built the first version of Applyd by hand to learn every layer of a full-stack app: ' +
    'the API, auth, database and deployment. Once I understood all of it, I switched to ' +
    'directing Claude Code. It writes the code; I plan, review every change, and set the ' +
    "rules it works within. Since then I've added CI, runtime validation, a safe production " +
    'migration, and a full redesign with a written design system and a designed dark mode.',

  phaseOne: {
    heading: 'Phase 1: built by hand',
    lead: 'Written line by line, to learn every layer.',
    points: [
      'A monorepo with an Express API and a React client.',
      'A Postgres schema with Prisma, hosted on Neon.',
      'Auth with bcrypt and JWT, plus middleware protecting every route.',
      'CRUD routes with ownership checks: find the record, check the owner, then act.',
      'Zod schemas shared between client and server.',
      'Board and detail views with TanStack Query and React Hook Form.',
      'Deployed to Vercel and Render, fixing the build and module errors that only appear in production.',
      'First server tests with Vitest.',
    ],
    screensLead: 'How the hand-built version looked, before the redesign:',
  },

  phaseTwo: {
    heading: 'Phase 2: Claude Code writes, I review',
    lead:
      'From 20 October 2026 I stopped typing the code and started directing it. The skill ' +
      'I wanted to build was planning, steering and judging changes. The rule: I must be ' +
      'able to explain every line that merges.',
    points: [
      'CI with GitHub Actions. I proved it by deliberately breaking a test, watching it ' +
        'go red, then reverting.',
      'Logout that clears the query cache, so the next user never sees the previous ' +
        "user's data.",
      'Runtime validation: every API response is parsed with Zod at the boundary. It ' +
        'immediately found a database row with a null that a hand-checked sample had missed.',
      'Delete with a database migration. Deleting an application with interview rounds ' +
        'would have failed (ON DELETE RESTRICT), so I added ON DELETE CASCADE. It had to ' +
        'go onto the only database, which is production, so I created the migration ' +
        'without running it, read the SQL, then applied it with a command that can never ' +
        'reset data.',
      'Bun workspaces: one install for the whole monorepo. I proved the existing deploy ' +
        'commands still worked on the new layout before pushing, then changed the hosting ' +
        'settings.',
      'The full "Paper" redesign, next.',
    ],
  },

  redesign: {
    heading: 'The redesign',
    goal: 'The goal: make it feel premium, with animation that means something.',
    // Same crop and sizes as the before/after slider; see scripts/capture-applyd.ts.
    themes: {
      caption: 'The Paper board in its light and dark themes',
      light: {
        src: '/job-tracker/board-paper-light.webp',
        mobileSrc: '/job-tracker/board-paper-light-mobile.webp',
        alt:
          'The Paper board in its light theme: a warm off-white page, white cards on a ' +
          'slightly darker panel, near-black text, and a coloured dot beside each status.',
      },
      dark: {
        src: '/job-tracker/board-paper-dark.webp',
        mobileSrc: '/job-tracker/board-paper-dark-mobile.webp',
        alt:
          'The same board in its dark theme: a warm charcoal page, slightly lighter cards, ' +
          'cream text, and the same status dots in lighter tints.',
      },
    } satisfies ThemeFigure,
    processHeading: 'How it went',
    process: [
      'I researched design skills and chose a small, deliberate set instead of stacking them.',
      'With no reference sites, I used a prototyping skill to build three working login ' +
        'page directions side by side, and picked by looking at them: "Paper", warm, calm ' +
        'and Notion-like.',
      'I wrote the direction down before building. PRODUCT.md says who it is for and what ' +
        'it must never claim. DESIGN.md holds colour tokens for both themes with measured ' +
        'contrast, type, spacing, components and motion rules.',
      'I built in order: theme tokens and dark mode first, then login and register, the ' +
        'top bar with a theme toggle, the board, the detail page and the dialogs.',
      'I reviewed it with a code review skill, triaged the findings, filed the rest as ' +
        'GitHub issues, and merged through a pull request.',
    ],
    decisionsHeading: 'Design decisions worth showing',
    decisions: [
      'Light by default, with a designed warm dark mode rather than an inversion.',
      'No flash of the wrong theme: a small script applies the saved theme before the ' +
        'page paints.',
      'Motion means placement. Cards settle into their columns on first load, the ' +
        'interview timeline draws itself in, and a newly added round gets a brief highlight.',
      'Everything respects the reduced motion setting.',
      'WCAG AA as the accessibility target: contrast measured for every text colour, and ' +
        'keyboard-friendly controls.',
    ],
    // Filmed from the live demo by scripts/record-applyd.ts: about 7s, muted, looping.
    motion: {
      caption: 'Applyd\'s own animations: cards settling in, a timeline drawing itself, the theme switch',
      alt:
        'A short loop of Applyd. The board loads and its cards settle into their columns. ' +
        'An application opens and its interview timeline draws itself in. The theme switches ' +
        'to dark and back to light.',
      webm: '/job-tracker/applyd-motion.webm',
      mp4: '/job-tracker/applyd-motion.mp4',
      poster: '/job-tracker/applyd-motion-poster.webp',
      width: 1000,
      height: 540,
    } satisfies MotionFigure,
    iterationHeading: 'Looking at it in the browser',
    iterationLead:
      'The first pass got some things wrong, and I only saw them by looking. The board ' +
      'below marks two of them, and the theme toggle.',
    // Positions are CSS px in the capture's 1437×776 viewport, minus the crop's x offset of
    // 80 (scripts/capture-applyd.ts prints the measured boxes). The circles are those boxes
    // plus 8-12px of padding.
    annotated: {
      src: '/job-tracker/board-paper-light-annotated.webp',
      width: 1792,
      height: 593,
      full: { src: '/job-tracker/board-paper-light-annotated-full.webp', width: 2540, height: 840 },
      view: { width: 1270, height: 420 },
      alt:
        'The Paper board in its light theme, with three parts circled in pen and numbered: ' +
        '1, the coloured status dot beside the Applied column heading; 2, its count chip; ' +
        '3, the Light, Dark and System toggle in the top bar.',
      caption: 'Three details on the Paper board',
      marks: [
        {
          circle: { x: 30, y: 194, w: 83, h: 33 },
          number: { x: 13, y: 210 },
          note:
            'Each status has its own colour token. A dot is a marker, and the column ' +
            'heading already names the status, so the dot only needs to be seen.',
        },
        {
          circle: { x: 291, y: 194, w: 40, h: 32 },
          number: { x: 311, y: 178 },
          note:
            'Count chips are neutral. Their contrast had been measured against the wrong ' +
            'background and they vanished in light mode. Now only the dot carries colour.',
        },
        {
          circle: { x: 929, y: 6, w: 118, h: 52 },
          number: { x: 914, y: 32 },
          note:
            'Light, Dark or System. The saved theme is applied before the page paints, so ' +
            'there is no flash of the wrong one.',
        },
      ],
    } satisfies AnnotatedFigure,
    iterationMore: 'Two more changes came out of looking:',
    iteration: [
      'The dashed empty-state borders disappeared. One shared empty-state component fixed ' +
        'it everywhere.',
      "The login success animation went from 700ms to 300ms, because the board's own " +
        'animation plays right after it.',
    ],
  },

  practice: {
    heading: 'How I work with Claude Code',
    rows: [
      {
        label: 'Plan mode first',
        text: 'Nothing changes until the plan is approved. Product decisions come back as questions.',
      },
      { label: 'Model routing', text: 'opusplan: Opus plans, Sonnet executes.' },
      {
        label: 'Project memory',
        text:
          'CLAUDE.md holds the commands, conventions, known pitfalls, git rules and four ' +
          'working rules: think first, keep it simple, change only what is needed, and ' +
          'define how success is checked.',
      },
      {
        label: 'A definition of done',
        text: 'Builds and tests pass, plus my own browser check in both themes.',
      },
      {
        label: 'Enforced approvals',
        text:
          'Permission rules make Claude Code ask before every commit and push, even in ' +
          'auto mode. I learned that instructions guide but do not guarantee.',
      },
      { label: 'Context hygiene', text: 'Clear the session between unrelated tasks.' },
      {
        label: 'Reviewing reviews',
        text:
          'I ran a code review skill, then verified each finding. Some were real, some ' +
          'were deliberate decisions the reviewer did not know about, and some line ' +
          'references were wrong.',
      },
      {
        label: 'Tracking work',
        text: 'Follow-ups are filed as GitHub issues with "done when" lists and triage labels.',
      },
    ],
    skillsHeading: 'Skills and plugins used',
    skills: [
      "Matt Pocock's skills: /prototype for the three login directions, /code-review for " +
        'the redesign pull request, and the GitHub issue setup.',
      'Impeccable: init to write PRODUCT.md, and extract to turn the chosen prototype into DESIGN.md.',
      'Taste: design direction, plus a headless Chrome inspector for desktop, tablet and ' +
        'mobile screenshots.',
    ],
    dependenciesHeading: 'Third-party tools are dependencies too',
    dependencies: [
      "Read before installing. Before using Taste's scripts, I had Claude Code list every " +
        'network call, file write and process, then checked the key claims myself.',
      'Install the minimum: one tool, only for Claude Code, without hooks, with its skill ' +
        'files kept out of git.',
      'Audit what is installed. I removed a plugin whose hooks added instructions to every ' +
        'prompt that conflicted with my own review rules.',
    ],
  },

  judgement: {
    heading: 'Where the obvious answer was wrong',
    lead: 'Five decisions from the work, each one a place where I had to say no.',
    moments: [
      {
        title: '"Consistent" is not always correct',
        text:
          'The agent made the register form clear its error when the password was edited, ' +
          'to match login. I reverted it. "Email already in use" is only about the email, ' +
          'while login\'s "Invalid credentials" is deliberately vague.',
      },
      {
        title: 'Sorting needs a field and a tie-breaker',
        text:
          'The API had no ordering, so the client sorts a copy (sorting the cached data ' +
          'in place would corrupt it) by date, then by id.',
      },
      {
        title: "Reset what the user can't see",
        text:
          'Resetting a form when its dialog closed blanked the fields during the ' +
          'fade-out. I remounted the form after the close animation finished instead, ' +
          'which also removed code.',
      },
      {
        title: 'Check the cheap causes first',
        text:
          '"The page isn\'t responsive" turned out to be browser zoom remembered for the ' +
          'site. Earlier "bugs" were network throttling and a view-source: prefix.',
      },
      {
        title: 'Fix the cause, not the symptom',
        text:
          'Compiled test files were shipping in the server build. I fixed where they were ' +
          'created, not where they were noticed.',
      },
    ],
  },

  next: {
    heading: 'What is next',
    label: 'Planned',
    lead: 'None of this is built yet. Applyd has no AI features today.',
    items: [
      'Edit applications in the UI (status and notes).',
      'Status history with dates, so the time between stages can be measured.',
      'A metrics dashboard built from my own real job search: applications per week, ' +
        'where applications drop off, and how long responses take.',
      'CV and job posting match: a fit score with strengths and gaps as structured output ' +
        'validated by Zod, plus an evaluation set to check that the scores make sense.',
      'An assistant with tools: server-side tool use (add a round, change a status), ' +
        'scoped to the signed-in user and confirmed before any write, then an MCP integration.',
    ],
  },

  stack: [
    {
      label: 'Client',
      items: [
        'React',
        'TypeScript',
        'Vite',
        'TanStack Query',
        'React Router',
        'Tailwind',
        'shadcn/ui',
        'React Hook Form',
        'Zod',
      ],
    },
    {
      label: 'Server',
      items: ['Node.js', 'Express', 'TypeScript', 'Prisma', 'PostgreSQL (Neon)', 'JWT', 'bcrypt'],
    },
    {
      label: 'Testing & tooling',
      items: ['Vitest', 'ESLint', 'Prettier', 'GitHub Actions', 'Bun workspaces'],
    },
    { label: 'Hosting', items: ['Vercel (frontend)', 'Render (backend)'] },
  ] satisfies ToolkitGroup[],
  /** the old dark design's screens, from the hand-built phase */
  detail: {
    src: '/job-tracker/detail.webp',
    width: 872,
    height: 389,
    alt:
      'Application detail for Fernleaf Studio: a timeline of four interview rounds, ' +
      'three passed and the final round pending.',
    caption: 'Per-application interview history',
    full: { src: '/job-tracker/detail-full.webp', width: 2872, height: 1558 },
  } satisfies Figure,
  validation: {
    src: '/job-tracker/validation.webp',
    width: 768,
    height: 1296,
    alt:
      'Add Application form with inline errors: "Company name is required", ' +
      '"Please select a status" and "Please select a date".',
    caption: 'Form validation from the shared Zod schema',
    full: { src: '/job-tracker/validation-full.webp', width: 2874, height: 1556 },
  } satisfies Figure,
  validationNote: 'These errors come from the same Zod schema the API validates against.',
}

/** A bullet; a tuple marks its key metric, which gets a pen underline. */
export type Point = string | [before: string, metric: string, after: string]

export type ExperienceEntry = {
  id: string
  /** company or university */
  org: string
  /** job title or degree */
  role: string
  place?: string
  dates: string
  points: Point[]
  /** margin note, pointing back at the timeline line */
  note?: string
}

/** Jobs and education as one timeline, newest first. */
export const experience: ExperienceEntry[] = [
  {
    id: 'msc',
    org: 'University of West London',
    role: 'MSc Software Engineering',
    place: 'London',
    dates: 'Oct 2023 – Jul 2025',
    points: [
      'Studied while working part-time and building the projects above.',
      'Dissertation: comparative evaluation of GraphQL and REST API integration approaches.',
    ],
  },
  {
    id: 'rapinnotech',
    org: 'RapinnoTech',
    role: 'Software Developer',
    place: 'Hyderabad',
    dates: 'May 2022 – Aug 2023',
    note: 'switched to frontend here',
    points: [
      [
        "Developed features for HDFC Life's offline quote tool in React and added new " +
          'products to it with product managers over Agile sprints, so insurance sales ' +
          'agents could quote in the field. Quote generation became ',
        '50% faster',
        '.',
      ],
      'Helped redesign the app as a single page when management asked to fold a 2–3 ' +
        'page flow into one screen, and walked senior product management through the ' +
        'codebase on planning calls.',
      'Worked directly with the other developers to extract the core state logic from ' +
        'Redux and rebuild it for the single-page version, and fixed the bugs and blockers ' +
        'they hit along the way.',
      'Handled sign-in and session logic in Redux, including REST API calls and token ' +
        'handling, and fixed the sign-in failures field agents kept reporting.',
      "Used Jenkins CI/CD pipelines as part of the team's build and release workflow.",
      'Rebuilt the Employee Notifier UI in React and wrote shared Button, Modal and Tab ' +
        'components that the rest of the product team adopted.',
      [
        "Built responsive screens from the designers' Figma files and redesigned the main " +
          'screens, raising user engagement by ',
        '20%',
        '.',
      ],
    ],
  },
  {
    id: 'coforge',
    org: 'Coforge',
    role: 'Software Engineer',
    place: 'Greater Noida',
    dates: '2019 – 2022',
    points: [
      'Automated recurring operational reports with shell scripts, cutting manual ' +
        'reporting time for 5–6 business teams.',
      [
        'Supported a live production system for British Airways, resolving ',
        '~350 incidents per year',
        ' within SLA.',
      ],
      'Led the migration of production servers from RHEL5 to RHEL7 for business-critical ' +
        'workloads.',
    ],
  },
  {
    id: 'btech',
    org: 'DIT University',
    role: 'BTech Computer Science',
    dates: '2014 – 2018',
    points: [],
  },
]

export type ToolkitGroup = {
  label: string
  items: string[]
}

export const toolkit: ToolkitGroup[] = [
  {
    label: 'Frontend',
    items: [
      'React',
      'TypeScript',
      'JavaScript',
      'Redux',
      'Tailwind CSS',
      'HTML5',
      'CSS3',
      'React Hook Form',
    ],
  },
  {
    label: 'APIs & data',
    items: ['REST', 'GraphQL', 'TanStack Query', 'Zod'],
  },
  {
    label: 'Backend',
    items: ['Node.js', 'Express', 'PostgreSQL', 'SQL', 'Prisma', 'JWT'],
  },
  {
    label: 'Tooling',
    items: [
      'Git',
      'Vite',
      'Vitest',
      'ESLint',
      'Prettier',
      'Linux',
      'Shell scripting',
      'Jenkins',
      'Figma',
      'Claude Code',
      'Vercel',
    ],
  },
]
