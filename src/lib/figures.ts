import { projects } from '../content'

// Figures are numbered across the whole page, in reading order. Each Work entry's first
// figure continues from the entries before it: its architecture diagram, screenshots
// and terminal each count as one. Then the About photo (Experience has none). The
// content is static, so this is worked out once.
const firstFigureNumbers: number[] = []
let figuresSoFar = 0
for (const project of projects) {
  firstFigureNumbers.push(figuresSoFar + 1)
  figuresSoFar +=
    (project.architecture ? 1 : 0) + (project.figures?.length ?? 0) + (project.terminal ? 1 : 0)
}
const aboutPhotoNumber = figuresSoFar + 1

export { aboutPhotoNumber, firstFigureNumbers }
