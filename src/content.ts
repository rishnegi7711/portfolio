// Typed content pulled from content.md — the working source of truth for on-site
// copy once this file exists (see CLAUDE.md). Edit content.md when a fact changes,
// edit this file when only the copy changes.

export type Identity = {
  name: string
  /** full role line, used outside the hero (e.g. a future About section) */
  roleHeadline: string
  /** short role line sized for the hero's large display type */
  heroRole: string
  location: string
  /** shown after the city in the hero's fact line */
  coordinates: string
  email: string
  github: string
  linkedin: string
  /** null until a CV PDF is added to /public */
  cvUrl: string | null
  /** cropped, optimised copy of the original photo, used in About */
  photo: { src: string; width: number; height: number; alt: string }
  /** first-person copy for the hero's signature margin annotation */
  heroAnnotation: string
}

export const identity: Identity = {
  name: 'Rishi Negi',
  roleHeadline: 'Frontend engineer (React + TypeScript), growing into full‑stack',
  heroRole: 'Frontend engineer, growing into full‑stack',
  location: 'London, UK',
  coordinates: '51.51° N, 0.13° W',
  email: 'rishnegi28@gmail.com',
  github: 'https://github.com/rishnegi7711',
  linkedin: 'https://www.linkedin.com/in/rishi-negi-a9057a207/',
  cvUrl: '/Rishi-Negi-CV.pdf',
  photo: {
    src: '/about/rishi.webp',
    width: 400,
    height: 500,
    alt: 'Rishi Negi, smiling, in a brown puffer jacket in front of a grey louvred wall.',
  },
  heroAnnotation:
    'Taught myself Node + Express to see the other side of the API, then shipped an ' +
    'app with it, end to end.',
}

/** Page sections, in order. The header nav and the page both render from this list,
 *  so a nav link can never point at a section that doesn't exist. */
export const sections = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

/** The Contact section's line and the email copy button's status messages. */
export const contact = {
  line: 'Hiring for a frontend or full‑stack role? Email is the quickest way to reach me.',
  copied: 'Copied',
  // Shown when the Clipboard API fails; the address is selected for the shortcut.
  copyFallback: 'Press Ctrl+C or ⌘C to copy',
}

/** The footer colophon: what the site is built with, each linking to its site. */
export const colophon = [
  { label: 'React', url: 'https://react.dev' },
  { label: 'Tailwind', url: 'https://tailwindcss.com' },
  { label: 'GSAP', url: 'https://gsap.com' },
  { label: 'Claude Code', url: 'https://claude.com/claude-code' },
]

/** The About section's story, one string per paragraph. */
export const story = [
  'I started in production support. For three years I looked after a live British ' +
    'Airways system, and when something broke, my job was to find out why. That habit ' +
    'stayed with me: I want to know how a thing actually works, not just how it looks.',
  'In 2022 I moved into frontend work, building React apps used by field and sales ' +
    'agents. In 2023 I came to London for an MSc in Software Engineering and used the ' +
    'time to learn the backend: Node, Express and PostgreSQL. Applyd is what came out of that.',
  "Now I'm looking for a junior frontend or full‑stack role in London, on a team that " +
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
  /** margin note, for the annotation-arrow motif */
  annotation: string
  stack: ToolkitGroup[]
  engineeringStory: string[]
  links: ProjectLink[]
  figures?: Figure[]
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
    status: 'Live, small tweaks in progress',
    summary:
      'Full-stack app to track job applications and interview rounds, replacing the ' +
      'spreadsheet most people use. Board view by status, per-application interview ' +
      'history, private multi-user accounts.',
    annotation:
      'These errors come from the same Zod schema the API validates against.',
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
      { label: 'Testing & tooling', items: ['Vitest', 'ESLint', 'Prettier'] },
      { label: 'Hosting', items: ['Vercel (frontend)', 'Render (backend)'] },
    ],
    engineeringStory: [
      'Built the Express backend from scratch: a deliberate push into unfamiliar territory.',
      'JWT auth with per-route access control; bcrypt password hashing.',
      'Shared Zod schemas: React Hook Form and the API validate against one source of truth.',
      'TanStack Query for server state and client-side caching.',
    ],
    links: [
      { label: 'Repo', url: 'https://github.com/rishnegi7711/job-tracker' },
      { label: 'Live', url: 'https://job-tracker-steel-ten.vercel.app' },
    ],
    figures: [
      {
        src: '/job-tracker/board.webp',
        width: 1440,
        height: 417,
        alt:
          'Applyd board with four status columns (Applied, Interviewing, Rejected, Offer), ' +
          'each holding application cards with company, role and date.',
        caption: 'Board view by status',
      },
      {
        src: '/job-tracker/detail.webp',
        width: 1440,
        height: 781,
        alt:
          'Application detail for Fernleaf Studio: a timeline of four interview rounds, ' +
          'three passed and the final round pending.',
        caption: 'Per-application interview history',
      },
      {
        src: '/job-tracker/validation.webp',
        width: 1440,
        height: 780,
        alt:
          'Add Application form with inline errors: "Company name is required", ' +
          '"Please select a status" and "Please select a date".',
        caption: 'Form validation from the shared Zod schema',
      },
    ],
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
    // Flags use non-breaking hyphens (‑) so "‑‑lock" can't break across lines.
    summary:
      'One cross-platform command that safely wipes node_modules and reinstalls. ' +
      'Supports npm, yarn and bun. Opt-in flags also delete the lockfile (‑‑lock), ' +
      'clear the cache (‑‑cache) or run a script afterwards (‑‑run\u00A0dev).',
    // "rm\u00A0‑rf": a non-breaking space and a non-breaking hyphen keep the command on one line.
    annotation:
      'Got tired of typing rm\u00A0‑rf node_modules && npm i several times a week, so made ' +
      'it one command — and used it as a reason to learn how Node CLIs work from scratch.',
    stack: [{ label: 'Built with', items: ['Node.js', 'npm'] }],
    engineeringStory: [
      'Detects the package manager from the lockfile: package-lock.json, bun.lock, ' +
        'bun.lockb, then yarn.lock; first match wins. With no lockfile it stops instead of guessing.',
      'Package managers live in one array, so supporting a new one means adding one object.',
      'Checks before deleting: package.json exists and is valid JSON, a lockfile exists, ' +
        'and the ‑‑run script is defined. If any check fails, nothing is touched.',
      'Flags are opt-in; plain cleandeps does the same clean reinstall.',
      "If node_modules doesn't exist, it skips the delete and just installs instead of crashing.",
      "Cross-platform: uses Node's fs and path modules instead of shell commands like " +
        'rm\u00A0‑rf, so it behaves the same on macOS, Linux and Windows.',
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
      'Rebuilt the Employee Notifier UI in React; standardised reusable component ' +
        'patterns (Buttons, Modals, Tabs) adopted product-wide, reducing duplicate UI code.',
      [
        'Redux-based authentication and session handling for a live app used by ',
        '1,000+ field agents',
        ', eliminating a recurring class of sign-in failures.',
      ],
      [
        'Built the frontend for the HDFC Life Offline Quote application (live insurance ' +
          'quoting for sales agents), improving quote generation speed by ',
        '50%',
        '.',
      ],
      [
        'Full UI overhaul that increased user engagement by ',
        '30%',
        ', working with PMs and designers in Agile sprints.',
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
      [
        'Supported a live production system for British Airways: ',
        '~350 incidents a year',
        ' within a 90-minute SLA.',
      ],
      'Led migration of production servers from RHEL5 to RHEL7 on an unfamiliar legacy codebase.',
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
    items: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'JWT'],
  },
  {
    label: 'Tooling',
    items: ['Git', 'Vite', 'Vitest', 'ESLint', 'Prettier', 'Linux', 'Vercel'],
  },
]
