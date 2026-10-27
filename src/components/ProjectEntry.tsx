import { Link } from 'react-router'
import { compareHint, type Project } from '../content'
import { noBreakHyphens } from '../lib/noBreakHyphens'
import ArchitectureDiagram from './ArchitectureDiagram'
import BeforeAfter from './BeforeAfter'
import MarginNote from './MarginNote'
import TerminalReplay from './TerminalReplay'

const linkStyle =
  'inline-block py-3 -my-3 underline decoration-accent-muted underline-offset-4 ' +
  'transition-colors hover:text-ink hover:decoration-accent focus-visible:outline ' +
  'focus-visible:outline-2 focus-visible:outline-accent'

/** One project as a notebook entry: what it is, then its main figure (Applyd's slider or
 *  CleanDeps' terminal) with a margin note pointing at it, how it works, and any diagram. */
type ProjectEntryProps = {
  project: Project
  /** Figures are numbered across the whole page, so this entry's first one continues
   *  from the entries before it. */
  firstFigureNumber: number
}

function ProjectEntry({ project, firstFigureNumber }: ProjectEntryProps) {
  const headingId = `${project.id}-heading`
  // Figures are numbered in reading order, continuing from the entries before this one.
  let figureCount = firstFigureNumber - 1
  const compareNumber = project.compare ? ++figureCount : 0
  const terminalNumber = project.terminal ? ++figureCount : 0
  const architectureNumber = figureCount + 1 // last in reading order, so no need to count on

  // The note's arrow points up at the end of its figure's caption, which is monospace, so
  // its length in characters says where that end is. This has to match the visible caption.
  const captionLength = project.compare
    ? `Fig. ${compareNumber} — ${project.compare.caption} · ${compareHint}`.length
    : project.terminal
      ? `Fig. ${terminalNumber} — ${project.terminal.caption}`.length
      : undefined

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
          {project.caseStudy && (
            <Link to={project.caseStudy.to} className={linkStyle}>
              {project.caseStudy.label}
            </Link>
          )}
        </p>
        {project.demoNote && (
          <p className="mt-4 max-w-[65ch] font-mono text-xs leading-relaxed text-ink-muted">
            {project.demoNote}
          </p>
        )}
        <p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-ink">
          {noBreakHyphens(project.summary)}
        </p>
      </header>

      {project.compare && (
        <div className="mt-8">
          <BeforeAfter compare={project.compare} number={compareNumber} />
        </div>
      )}

      {project.terminal && (
        <div className="mt-8">
          <TerminalReplay terminal={project.terminal} number={terminalNumber} />
        </div>
      )}

      {/* Note first in the DOM so on mobile it lands right under the figure it points at; on
          md+ the grid lifts it into the right-hand margin column. The upLeft arrow rises a
          fixed 102px from the note's top to the figure's caption: below the terminal that is
          the caption (24px), the install row (54px) and this margin (24px). The slider has
          no install row, so the margin is 32px and the note moves down the remaining 46px. */}
      <div
        className={
          'relative flex flex-col gap-8 md:grid md:grid-cols-[minmax(0,1fr)_13rem] md:gap-x-12 ' +
          (project.compare ? 'mt-8' : 'mt-6')
        }
      >
        <div
          className={
            'md:col-start-2 md:row-start-1' + (project.compare ? ' md:mt-[46px]' : '')
          }
        >
          <MarginNote
            text={project.annotation}
            pointsTo={captionLength ? 'upLeft' : 'left'}
            captionLength={captionLength}
          />
        </div>

        <div className="md:col-start-1 md:row-start-1">
          <h4 className="font-display text-xl text-ink">{project.storyHeading}</h4>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-accent-muted">
            {project.engineeringStory.map((point) => (
              <li key={point}>{noBreakHyphens(point)}</li>
            ))}
          </ul>
        </div>
      </div>

      {project.architecture && (
        <div className="mt-12">
          <ArchitectureDiagram architecture={project.architecture} number={architectureNumber} />
        </div>
      )}

      {project.stack && (
        <>
          <h4 className="mt-12 font-display text-xl text-ink">Stack</h4>
          <dl className="mt-3 grid gap-x-6 gap-y-2 font-mono text-sm sm:grid-cols-[10rem_1fr]">
            {project.stack.map((group) => (
              <div key={group.label} className="contents">
                <dt className="text-ink-muted">{group.label}</dt>
                <dd className="mb-2 text-ink sm:mb-0">{group.items.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </article>
  )
}

export default ProjectEntry
