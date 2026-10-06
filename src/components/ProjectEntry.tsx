import { useRef } from 'react'
import type { Figure, Project } from '../content'
import ArchitectureDiagram from './ArchitectureDiagram'
import MarginNote from './MarginNote'
import TerminalReplay from './TerminalReplay'

const linkStyle =
  'inline-block py-3 -my-3 underline decoration-accent-muted underline-offset-4 ' +
  'transition-colors hover:text-ink hover:decoration-accent focus-visible:outline ' +
  'focus-visible:outline-2 focus-visible:outline-accent'


/** One project as a notebook entry: what it is, the evidence (figures), then how it
 *  works, with a margin note glossing the mechanism. */
function ProjectEntry({ project }: { project: Project }) {
  const headingId = `${project.id}-heading`
  const figures = project.figures ?? []
  const lastFigure = figures.at(-1)
  // Anything drawn above the notes (screenshots or the terminal) for the margin note to point at.
  const hasFigureAbove = figures.length > 0 || project.terminal !== undefined

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

      {figures.length > 0 && (
        <div className="mt-8 flex flex-col gap-8">
          {figures.slice(0, -1).map((figure, i) => (
            <ProjectFigure key={figure.src} figure={figure} number={i + 1} />
          ))}
          {/* The last figure (Applyd's form) is narrow, so the note sits in the space beside
              it on md+, its arrow level with the form's first error message. Below md
              it drops under the figure and points up. */}
          {lastFigure && (
            <div className="flex flex-col gap-6 md:flex-row md:gap-14">
              <ProjectFigure figure={lastFigure} number={figures.length} />
              {/* 205px: the error sits 221px down the 384px-wide form; the arrow's head is
                  16px below the note's top. */}
              <div className="md:mt-[205px] md:max-w-52">
                <MarginNote text={project.annotation} pointsTo="left" />
              </div>
            </div>
          )}
        </div>
      )}

      {project.terminal && (
        <div className="mt-8">
          <TerminalReplay terminal={project.terminal} number={figures.length + 1} />
        </div>
      )}

      {/* Note first in the DOM so on mobile it lands right under the figure it points
          at; on md+ the grid lifts it into the right-hand margin column. */}
      <div
        className={
          'relative mt-6 flex flex-col gap-8 md:grid md:grid-cols-[minmax(0,1fr)_13rem] md:gap-x-12 ' +
          (hasFigureAbove ? '' : 'md:mt-10')
        }
      >
        {!lastFigure && (
          <div className="md:col-start-2 md:row-start-1">
            <MarginNote
              text={project.annotation}
              pointsTo={project.terminal ? 'upLeft' : 'left'}
              // Same text as TerminalReplay's figcaption, so the arrow lands at its end.
              captionLength={
                project.terminal &&
                `Fig. ${figures.length + 1} — ${project.terminal.caption}`.length
              }
            />
          </div>
        )}

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
          <ArchitectureDiagram
            architecture={project.architecture}
            number={figures.length + (project.terminal ? 2 : 1)}
          />
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

/** A screenshot that opens its uncropped original in a native modal <dialog>. The browser
 *  handles Esc, focus trapping, and returning focus to the button on close. */
function ProjectFigure({ figure, number }: { figure: Figure; number: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  // A portrait crop (the form) at full column width would be taller than the screen.
  const isPortrait = figure.height > figure.width

  return (
    <figure className={isPortrait ? 'w-full max-w-sm shrink-0' : undefined}>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className={
          'block w-full cursor-zoom-in border border-ink/15 transition-colors hover:border-ink/40 ' +
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
        }
      >
        <span className="sr-only">Enlarge: </span>
        <img
          src={figure.src}
          width={figure.width}
          height={figure.height}
          alt={figure.alt}
          loading="lazy"
          decoding="async"
          className="h-auto w-full"
        />
      </button>
      <figcaption className="mt-2 font-mono text-xs text-ink-muted">
        Fig. {number} — {figure.caption}
        <span aria-hidden="true"> · Click to enlarge</span>
      </figcaption>

      <dialog
        ref={dialogRef}
        aria-label={`Fig. ${number} — ${figure.caption}`}
        // A click on the dialog element itself (not its content) is a click on the backdrop.
        onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
        className="figure-dialog m-auto max-w-[min(94vw,1440px)] bg-paper p-3 backdrop:bg-ink/70 sm:p-4"
      >
        <form method="dialog" className="mb-3 flex justify-end">
          <button
            className={
              'py-2 font-mono text-xs text-ink underline decoration-accent-muted underline-offset-4 ' +
              'hover:decoration-accent focus-visible:outline-2 focus-visible:outline-accent'
            }
          >
            Close
          </button>
        </form>
        {/* Lazy inside a closed dialog: the full image only downloads on first open. */}
        <img
          src={figure.full.src}
          width={figure.full.width}
          height={figure.full.height}
          alt={figure.alt}
          loading="lazy"
          decoding="async"
          className="h-auto max-h-[80vh] w-auto max-w-full border border-ink/15"
        />
      </dialog>
    </figure>
  )
}

export default ProjectEntry
