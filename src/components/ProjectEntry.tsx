import type { Figure, Project } from '../content'
import ArchitectureDiagram from './ArchitectureDiagram'
import MarginNote from './MarginNote'

const linkStyle =
  'inline-block py-3 -my-3 underline decoration-accent-muted underline-offset-4 ' +
  'transition-colors hover:text-ink hover:decoration-accent focus-visible:outline ' +
  'focus-visible:outline-2 focus-visible:outline-accent'


/** One project as a notebook entry: what it is, the evidence (figures), then how it
 *  works, with a margin note glossing the mechanism. */
function ProjectEntry({ project }: { project: Project }) {
  const headingId = `${project.id}-heading`
  const figures = project.figures ?? []
  const [leadFigure, ...restFigures] = figures

  return (
    <article aria-labelledby={headingId} className="py-14 first:pt-10">
      <header>
        <h3 id={headingId} className="font-display text-3xl text-ink sm:text-4xl">
          {project.name}
        </h3>
        <p className="mt-1 text-lg text-ink-muted">{project.descriptor}</p>
        <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-ink-muted">
          <span>{project.status}</span>
          {project.links.map((link) => (
            <a key={link.url} href={link.url} className={linkStyle}>
              {link.label}
            </a>
          ))}
        </p>
        <p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-ink">{project.summary}</p>
      </header>

      {leadFigure && (
        <div className="mt-8 flex flex-col gap-6">
          <ProjectFigure figure={leadFigure} number={1} />
          {restFigures.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {restFigures.map((figure, i) => (
                <ProjectFigure key={figure.src} figure={figure} number={i + 2} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Note first in the DOM so on mobile it lands right under the figure it points
          at; on md+ the grid lifts it into the right-hand margin column. */}
      <div
        className={
          'mt-6 flex flex-col gap-8 md:grid md:grid-cols-[minmax(0,1fr)_13rem] md:gap-x-12 ' +
          (figures.length > 0 ? '' : 'md:mt-10')
        }
      >
        <div className="md:col-start-2 md:row-start-1">
          <MarginNote text={project.annotation} pointsTo={figures.length > 0 ? 'up' : 'left'} />
        </div>

        <div className="md:col-start-1 md:row-start-1">
          <h4 className="font-display text-xl text-ink">How it works</h4>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-accent-muted">
            {project.engineeringStory.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>

      {project.architecture && (
        <div className="mt-12">
          <ArchitectureDiagram architecture={project.architecture} number={figures.length + 1} />
        </div>
      )}

      <h4 className="mt-12 font-display text-xl text-ink">Stack</h4>
      <dl className="mt-3 grid gap-x-6 gap-y-2 font-mono text-sm sm:grid-cols-[10rem_1fr]">
        {project.stack.map((group) => (
          <div key={group.label} className="contents">
            <dt className="text-ink-muted">{group.label}</dt>
            <dd className="mb-2 text-ink sm:mb-0">{group.items.join(' · ')}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}

function ProjectFigure({ figure, number }: { figure: Figure; number: number }) {
  return (
    <figure>
      <img
        src={figure.src}
        width={figure.width}
        height={figure.height}
        alt={figure.alt}
        loading="lazy"
        decoding="async"
        className="h-auto w-full border border-ink/15"
      />
      <figcaption className="mt-2 font-mono text-xs text-ink-muted">
        Fig. {number} — {figure.caption}
      </figcaption>
    </figure>
  )
}

export default ProjectEntry
