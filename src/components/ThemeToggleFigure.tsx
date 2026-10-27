import { useId, useState } from 'react'
import type { CompareImage, ThemeFigure } from '../content'

type Theme = 'light' | 'dark'

const THEMES: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

type ThemeToggleFigureProps = {
  figure: ThemeFigure
  /** the figure's number on the page */
  number: number
}

/** The redesign's board in its two themes, with a Light / Dark switch. The two images sit
 *  stacked and the switch crossfades them with a CSS transition (200ms; none with reduced
 *  motion), so there's no script-driven animation. The control is a native radio group, so
 *  the arrow keys move between the options and it is announced as a group of two. */
function ThemeToggleFigure({ figure, number }: ThemeToggleFigureProps) {
  const [theme, setTheme] = useState<Theme>('light')
  const name = useId() // radios need a shared name, unique per figure

  return (
    <figure>
      <fieldset className="mb-3 flex items-center gap-3">
        <legend className="sr-only">Theme shown</legend>
        <div className="flex gap-0.5 border border-ink/15 bg-paper-raised p-0.5 font-mono text-xs">
          {THEMES.map(({ value, label }) => (
            <label
              key={value}
              className={
                'cursor-pointer px-3 py-2 transition-colors duration-200 ' +
                'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 ' +
                'has-focus-visible:outline-accent ' +
                (theme === value ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink')
              }
            >
              <input
                type="radio"
                name={name}
                value={value}
                checked={theme === value}
                onChange={() => setTheme(value)}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="relative aspect-[33/38] overflow-hidden border border-ink/15 bg-paper-raised sm:aspect-[2/1]">
        <Layer image={figure.light} visible={theme === 'light'} />
        <Layer image={figure.dark} visible={theme === 'dark'} />
      </div>
      <figcaption className="mt-2 font-mono text-xs text-ink-muted">
        Fig. {number} — {figure.caption}
      </figcaption>
    </figure>
  )
}

/** One theme's image, filling the frame. Hidden by opacity, and from assistive technology,
 *  while the other theme is showing. */
function Layer({ image, visible }: { image: CompareImage; visible: boolean }) {
  return (
    <picture
      aria-hidden={!visible}
      className={
        'absolute inset-0 block transition-opacity duration-200 motion-reduce:transition-none ' +
        (visible ? 'opacity-100' : 'opacity-0')
      }
    >
      <source media="(max-width: 639px)" srcSet={image.mobileSrc} />
      <img
        src={image.src}
        width={1792}
        height={896}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </picture>
  )
}

export default ThemeToggleFigure
