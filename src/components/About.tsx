import type { IconType } from 'react-icons'
import {
  SiCss,
  SiEslint,
  SiExpress,
  SiGit,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiLinux,
  SiNodedotjs,
  SiPostgresql,
  SiPrettier,
  SiPrisma,
  SiReact,
  SiReacthookform,
  SiReactquery,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
  SiVitest,
  SiZod,
} from 'react-icons/si'
import { identity, story, toolkit } from '../content'
import Container from './Container'

// Toolkit names → Simple Icons. Kept here, not in content.ts, because an icon is
// presentation, not a fact. A name with no entry (REST) just shows its label.
const ICONS: Record<string, IconType> = {
  React: SiReact,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  Redux: SiRedux,
  'Tailwind CSS': SiTailwindcss,
  HTML5: SiHtml5,
  CSS3: SiCss,
  'React Hook Form': SiReacthookform,
  GraphQL: SiGraphql,
  'TanStack Query': SiReactquery,
  Zod: SiZod,
  'Node.js': SiNodedotjs,
  Express: SiExpress,
  PostgreSQL: SiPostgresql,
  Prisma: SiPrisma,
  JWT: SiJsonwebtokens,
  Git: SiGit,
  Vite: SiVite,
  Vitest: SiVitest,
  ESLint: SiEslint,
  Prettier: SiPrettier,
  Linux: SiLinux,
  Vercel: SiVercel,
}

/** Who I am and why I work the way I do, then the toolkit. Deliberately static: the
 *  scroll-linked timeline just above is the page's last big moment. */
function About() {
  const { photo } = identity

  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-14 py-16">
      <Container>
        <h2 id="about-heading" className="font-display text-3xl text-ink sm:text-4xl">
          About
        </h2>

        {/* Photo first in the DOM, so on mobile it sits above the story; on md+ the grid
            moves it into the right-hand column. */}
        <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_13rem] md:gap-12">
          <img
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className="h-auto w-3/5 max-w-52 border border-ink/15 md:col-start-2 md:row-start-1 md:w-full md:max-w-none"
          />
          <div className="flex max-w-[65ch] flex-col gap-5 text-lg leading-relaxed text-ink md:col-start-1 md:row-start-1">
            {story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <h3 className="mt-16 font-display text-2xl text-ink">Toolkit</h3>
        <dl className="mt-4 grid gap-x-6 gap-y-4 font-mono text-sm sm:grid-cols-[10rem_1fr]">
          {toolkit.map((group) => (
            <div key={group.label} className="contents">
              <dt className="text-ink-muted sm:pt-0.5">{group.label}</dt>
              <dd className="mb-2 sm:mb-0">
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-ink">
                  {group.items.map((item) => {
                    const Icon = ICONS[item]
                    return (
                      <li key={item} className="flex items-center gap-2">
                        {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
                        {item}
                      </li>
                    )
                  })}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}

export default About
