import { useRef, useState } from 'react'
import { contact, identity } from '../content'
import { noBreakHyphens } from '../lib/noBreakHyphens'
import Container from './Container'
import PenMark from './PenMark'

const linkStyle =
  'inline-block py-3 -my-3 underline decoration-accent-muted underline-offset-4 ' +
  'transition-colors hover:text-ink hover:decoration-accent focus-visible:outline ' +
  'focus-visible:outline-2 focus-visible:outline-accent'

const buttonStyle =
  'cursor-pointer border border-ink/25 px-3 py-1.5 font-mono text-xs text-ink transition-colors ' +
  'hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-accent'

/** The page's close: one line, then the email set large, underlined by a pen stroke
 *  that draws once on scroll-in, with a copy button. Then GitHub, LinkedIn and the CV. */
function Contact() {
  const emailRef = useRef<HTMLSpanElement>(null)
  const [copyStatus, setCopyStatus] = useState('')

  // Same pattern as TerminalReplay's install command.
  async function copyEmail() {
    try {
      // Throws if the API is missing (non-HTTPS) or permission is denied.
      await navigator.clipboard.writeText(identity.email)
      setCopyStatus(contact.copied)
      // Clear it, so copying again changes the text and is announced again.
      window.setTimeout(() => setCopyStatus(''), 2000)
    } catch {
      // Select the address so the keyboard shortcut copies it.
      window.getSelection()?.selectAllChildren(emailRef.current!)
      setCopyStatus(contact.copyFallback)
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-14 py-16">
      <Container>
        <h2 id="contact-heading" className="font-display text-3xl text-ink sm:text-4xl">
          Contact
        </h2>
        <p className="mt-4 max-w-[65ch] text-lg leading-relaxed text-ink">
          {noBreakHyphens(contact.line)}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
          {/* The pen stroke is this link's underline, so it's never colour-only; on hover
              it darkens from accent-muted to accent. */}
          <a
            href={`mailto:${identity.email}`}
            className={
              'group font-display text-2xl text-ink sm:text-4xl focus-visible:outline ' +
              'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
            }
          >
            <span ref={emailRef}>
              <PenMark className="text-accent-muted transition-colors group-hover:text-accent">
                {identity.email}
              </PenMark>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <button type="button" onClick={copyEmail} className={buttonStyle}>
              Copy
            </button>
            {/* role="status" is a polite live region: screen readers announce its text when
                it changes. It's in the DOM from the start, or the first change is missed. */}
            <span role="status" className="font-mono text-xs text-accent">
              {copyStatus}
            </span>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm text-ink-muted">
          <a href={identity.github} className={linkStyle}>
            GitHub
          </a>
          <a href={identity.linkedin} className={linkStyle}>
            LinkedIn
          </a>
          {/* A new tab, so the browser's PDF viewer (which has its own download button)
              doesn't replace the page. */}
          {identity.cvUrl && (
            <a href={identity.cvUrl} target="_blank" rel="noopener" className={linkStyle}>
              CV (PDF)
            </a>
          )}
        </div>
      </Container>
    </section>
  )
}

export default Contact
