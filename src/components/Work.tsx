import { projects } from '../content'
import Container from './Container'
import ProjectEntry from './ProjectEntry'

// Figures are numbered across the whole page, so each entry's first figure continues
// from the entries before it: its architecture diagram, screenshots and terminal each
// count as one. The project list is static, so this is worked out once.
const firstFigureNumbers: number[] = []
let figuresSoFar = 0
for (const project of projects) {
  firstFigureNumbers.push(figuresSoFar + 1)
  figuresSoFar +=
    (project.architecture ? 1 : 0) + (project.figures?.length ?? 0) + (project.terminal ? 1 : 0)
}

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
