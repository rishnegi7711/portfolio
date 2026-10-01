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
  rightToWork: string
  /** shown after the city in the hero's fact line */
  coordinates: string
  email: string
  github: string
  linkedin: string
  /** null until a CV PDF is added to /public */
  cvUrl: string | null
  photo: string
  /** first-person copy for the hero's signature margin annotation */
  heroAnnotation: string
}

export const identity: Identity = {
  name: 'Rishi Negi',
  roleHeadline: 'Frontend engineer (React + TypeScript), growing into full‑stack',
  heroRole: 'Frontend engineer, growing into full‑stack',
  location: 'London, UK',
  rightToWork: 'Right to work in the UK (Graduate Visa, to Sep 2027)',
  coordinates: '51.51° N, 0.13° W',
  email: 'rishnegi28@gmail.com',
  github: 'https://github.com/rishnegi7711',
  linkedin: 'https://www.linkedin.com/in/rishi-negi-a9057a207/',
  cvUrl: null,
  photo: '/Rishi.jpeg',
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

/** Placeholder line for sections that aren't built yet. */
export const sectionInProgress = 'In progress — being written up next.'

export const story =
  'Production support engineer turned frontend developer. Likes understanding how ' +
  'things actually work under the hood, not just making them look like they do. ' +
  'Stepped outside the frontend comfort zone to self-teach a Node/Express backend ' +
  'and ship a full‑stack app end-to-end. Looking for a high-autonomy, technically ' +
  'deep team in London.'

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
  /** real CLI output for the terminal replay, one line each, starting with the command */
  wrongFolderRun?: string[]
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
      'The flags are opt-in, so plain cleandeps behaves exactly as before.',
      "If node_modules doesn't exist, it skips the delete and just installs instead of crashing.",
      "Cross-platform: uses Node's fs and path modules instead of shell commands like " +
        'rm\u00A0‑rf, so it behaves the same on macOS, Linux and Windows.',
    ],
    links: [
      { label: 'npm', url: 'https://www.npmjs.com/package/cleandeps-cli' },
      { label: 'Repo', url: 'https://github.com/rishnegi7711/cleandeps-cli' },
    ],
    // Copied verbatim from bin/cleandeps.js (v0.2.0); keep in sync if the CLI changes.
    wrongFolderRun: [
      '$ cleandeps',
      '❌ CleanDeps: No package.json found in this folder',
      '➡️ Run this command inside a Node project (where package.json exists).',
    ],
  },
]

export type Role = {
  company: string
  title: string
  location: string
  dates: string
  highlights: string[]
  /** margin note — the standout metric, for the annotation-arrow motif */
  annotation?: string
}

export const roles: Role[] = [
  {
    company: 'RapinnoTech',
    title: 'Software Developer',
    location: 'Hyderabad',
    dates: 'May 2022 – Aug 2023',
    annotation: '1,000+ field agents · 50% faster quotes',
    highlights: [
      'Rebuilt the Employee Notifier UI in React; standardised reusable component ' +
        'patterns (Buttons, Modals, Tabs) adopted product-wide, reducing duplicate UI code.',
      'Redux-based authentication and session handling for a live app used by 1,000+ ' +
        'field agents, eliminating a recurring class of sign-in failures.',
      'Built the frontend for the HDFC Life Offline Quote application (live insurance ' +
        'quoting for sales agents), improving quote generation speed by 50%.',
      'Full UI overhaul that increased user engagement by 30%, working with PMs and ' +
        'designers in Agile sprints.',
    ],
  },
  {
    company: 'Coforge',
    title: 'Software Engineer',
    location: 'Greater Noida',
    dates: '2019 – 2022',
    annotation: '~350 incidents/yr · 90-min SLA',
    highlights: [
      'Supported a live production system for British Airways: ~350 incidents a year ' +
        'within a 90-minute SLA.',
      'Led migration of production servers from RHEL5 to RHEL7 on an unfamiliar legacy codebase.',
    ],
  },
]

/** 2023–2025 doesn't fit the Role shape: no single company, just one context line. */
export const timelineNote =
  'MSc in Software Engineering in London while working part-time and building the projects above.'

export type EducationEntry = {
  degree: string
  institution: string
  dates: string
  detail?: string
}

export const education: EducationEntry[] = [
  {
    degree: 'MSc Software Engineering',
    institution: 'University of West London',
    dates: 'Oct 2023 – Jul 2025',
    detail:
      'Dissertation: comparative evaluation of GraphQL and REST API integration approaches.',
  },
  {
    degree: 'BTech Computer Science',
    institution: 'DIT University',
    dates: '2014 – 2018',
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
