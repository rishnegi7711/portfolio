import { projects } from '../content'
import { firstFigureNumbers } from '../lib/figures'
import Container from './Container'
import ProjectEntry from './ProjectEntry'

function Work() {
  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-14 py-16">
      <Container>
        <h2 id="work-heading" className="font-display text-3xl text-ink sm:text-4xl">
          Work
        </h2>
        <div className="divide-y divide-accent-muted/40">
          {projects.map((project, i) => (
            <ProjectEntry
              key={project.id}
              project={project}
              firstFigureNumber={firstFigureNumbers[i]}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Work
