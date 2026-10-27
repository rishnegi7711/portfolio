import { useRef } from 'react'
import { figureEnlargeHint, type Figure } from '../content'

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
        <span aria-hidden="true"> · {figureEnlargeHint}</span>
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

export default ProjectFigure
