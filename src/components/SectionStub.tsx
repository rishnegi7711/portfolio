import { sectionInProgress } from '../content'
import Container from './Container'

type SectionStubProps = {
  id: string
  label: string
}

/** A real, linkable section with an honest placeholder line, so nav links never dead-end
 *  while the section itself is still being built. Replaced one by one by real sections. */
function SectionStub({ id, label }: SectionStubProps) {
  const headingId = `${id}-heading`
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-14 py-16">
      <Container>
        <h2 id={headingId} className="font-display text-3xl text-ink sm:text-4xl">
          {label}
        </h2>
        <p className="mt-3 font-mono text-sm text-ink-muted">{sectionInProgress}</p>
      </Container>
    </section>
  )
}

export default SectionStub
