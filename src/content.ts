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
  email: 'rishnegi28@gmail.com',
  github: 'https://github.com/rishnegi7711',
  linkedin: 'https://www.linkedin.com/in/rishi-negi-a9057a207/',
  cvUrl: null,
  photo: '/Rishi.jpeg',
  heroAnnotation:
    'Taught myself Node + Express to see the other side of the API, then shipped a ' +
    'full‑stack app with it.',
}

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

export type Project = {
  id: string
  name: string
  status: string
  summary: string
  /** the motivation behind building it, not just what it does */
  why?: string
  stack: string[]
  engineeringStory: string[]
  links: ProjectLink[]
}

export const projects: Project[] = [
  {
    id: 'job-tracker',
    name: 'Job Application Tracker',
    status: 'Live, small tweaks in progress',
    summary:
      'Full-stack app to track job applications and interview rounds, replacing the ' +
      'spreadsheet most people use. Board view by status, per-application interview ' +
      'history, private multi-user accounts.',
    stack: [
      'React',
      'TypeScript',
      'Vite',
      'TanStack Query',
      'React Router',
      'Tailwind',
      'shadcn/ui',
      'React Hook Form',
      'Zod',
      'Node.js',
      'Express',
      'Prisma',
      'PostgreSQL (Neon)',
      'JWT',
      'bcrypt',
      'Vitest',
      'ESLint',
      'Prettier',
      'Vercel',
      'Render',
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
  },
  {
    id: 'cleandeps',
    name: 'CleanDeps CLI',
    status: 'Published',
    summary:
      'One cross-platform command that safely wipes node_modules and reinstalls. ' +
      'Validates package.json is present; supports npm, yarn and bun.',
    why:
      'Got tired of typing rm -rf node_modules && npm i several times a week, so made ' +
      'it one command — and used it as a reason to learn how Node CLIs work from scratch.',
    stack: ['Node.js', 'npm'],
    engineeringStory: [
      'Detects the package manager from the lockfile: package-lock.json, bun.lock, ' +
        'bun.lockb, then yarn.lock; first match wins.',
      'Package managers live in one array, so supporting a new one means adding one object.',
      "Safety: refuses to run without a package.json, so it can't delete anything in the wrong folder.",
      "If node_modules doesn't exist, it skips the delete and just installs instead of crashing.",
      "Cross-platform: uses Node's fs and path modules instead of shell commands like " +
        'rm -rf, so it behaves the same on macOS, Linux and Windows.',
    ],
    links: [
      { label: 'npm', url: 'https://www.npmjs.com/package/cleandeps-cli' },
      { label: 'Repo', url: 'https://github.com/rishnegi7711/cleandeps-cli' },
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
