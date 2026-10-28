import type { ReactNode } from 'react'
import AnnotatedScreenshot from '../components/AnnotatedScreenshot'
import Container from '../components/Container'
import MarginNote from '../components/MarginNote'
import MotionLoop from '../components/MotionLoop'
import ProjectFigure from '../components/ProjectFigure'
import ThemeToggleFigure from '../components/ThemeToggleFigure'
import { applydCaseStudy as cs, pageMeta, projects } from '../content'
import { noBreakHyphens } from '../lib/noBreakHyphens'
import { usePageMeta } from '../lib/usePageMeta'

const linkStyle =
  'inline-block py-3 -my-3 underline decoration-accent-muted underline-offset-4 ' +
  'transition-colors hover:text-ink hover:decoration-accent focus-visible:outline ' +
  'focus-visible:outline-2 focus-visible:outline-accent'

const listStyle = 'mt-3 flex flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-accent-muted'

/** A plain or numbered list of sentences. */
function Bullets({ items, ordered = false }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <Tag className={`${listStyle} ${ordered ? 'list-decimal' : 'list-disc'}`}>
      {items.map((item) => (
        <li key={item}>{noBreakHyphens(item)}</li>
      ))}
    </Tag>
  )
}

/** One part of the story: a labelled section, separated from the next by a thin rule. */
function Section({ id, heading, children }: { id: string; heading: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-14 py-12">
      <h2 id={`${id}-heading`} className="font-display text-3xl text-ink sm:text-4xl">
        {heading}
      </h2>
      {children}
    </section>
  )
}

function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="mt-10 font-display text-xl text-ink">{children}</h3>
}

/** A larger opening paragraph for a section. */
function Lead({ children }: { children: string }) {
  return (
    <p className="mt-4 max-w-[65ch] text-lg leading-relaxed text-ink">{noBreakHyphens(children)}</p>
  )
}

/** The Applyd case study: the same job tracker built two ways, what changed, and how the
 *  second way works. Copy lives in content.ts (applydCaseStudy). */
function ApplydCaseStudy() {
  usePageMeta(pageMeta.applyd.title, pageMeta.applyd.description, pageMeta.applyd.path)
  const project = projects.find((p) => p.id === 'job-tracker')!

  return (
    <article className="pt-12 pb-8">
      <Container>
        <a href="/#work" className={`${linkStyle} font-mono text-sm text-ink-muted`}>
          Back to work
        </a>

        <header className="mt-8">
          <h1 className="font-display text-4xl text-ink sm:text-5xl">{cs.title}</h1>
          <p className="mt-2 text-lg text-ink-muted">{noBreakHyphens(cs.subtitle)}</p>
          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-ink-muted">
            <span>{project.status}</span>
            {project.links.map((link) => (
              <a key={link.url} href={link.url} className={linkStyle}>
                {link.label}
              </a>
            ))}
          </p>
          <p className="mt-4 max-w-[65ch] font-mono text-xs leading-relaxed text-ink-muted">
            {project.demoNote}
          </p>
          <Lead>{cs.intro}</Lead>
        </header>

        <div className="mt-6 divide-y divide-accent-muted/40">
          <Section id="phase-one" heading={cs.phaseOne.heading}>
            <Lead>{cs.phaseOne.lead}</Lead>
            <Bullets items={cs.phaseOne.points} />

            <p className="mt-10 max-w-[65ch] text-lg leading-relaxed text-ink">
              {cs.phaseOne.screensLead}
            </p>
            {/* The form is narrow, so the note sits in the space beside it on md+, its arrow
                level with the form's first error message. Below md it drops under the figure
                and points up. 205px: the error sits 221px down the 384px-wide form; the
                arrow's head is 16px below the note's top. Measured from the error text's
                position in validation.png: re-measure if that screenshot or its crop changes. */}
            <div className="mt-6 flex flex-col gap-6 md:flex-row md:gap-14">
              <ProjectFigure figure={cs.validation} number={1} />
              <div className="md:mt-[205px] md:max-w-52">
                <MarginNote text={cs.validationNote} pointsTo="left" />
              </div>
            </div>
            <div className="mt-10">
              <ProjectFigure figure={cs.detail} number={2} />
            </div>

            <SubHeading>Stack</SubHeading>
            <dl className="mt-3 grid gap-x-6 gap-y-2 font-mono text-sm sm:grid-cols-[10rem_1fr]">
              {cs.stack.map((group) => (
                <div key={group.label} className="contents">
                  <dt className="text-ink-muted">{group.label}</dt>
                  <dd className="mb-2 text-ink sm:mb-0">{group.items.join(' · ')}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section id="phase-two" heading={cs.phaseTwo.heading}>
            <Lead>{cs.phaseTwo.lead}</Lead>
            <Bullets items={cs.phaseTwo.points} />
          </Section>

          <Section id="redesign" heading={cs.redesign.heading}>
            <Lead>{cs.redesign.goal}</Lead>
            <SubHeading>{cs.redesign.processHeading}</SubHeading>
            <Bullets items={cs.redesign.process} ordered />
            <SubHeading>{cs.redesign.decisionsHeading}</SubHeading>
            <Bullets items={cs.redesign.decisions} />
            <div className="mt-10">
              <ThemeToggleFigure figure={cs.redesign.themes} number={3} />
            </div>
            <div className="mt-10">
              <MotionLoop motion={cs.redesign.motion} number={4} />
            </div>
            <SubHeading>{cs.redesign.iterationHeading}</SubHeading>
            <p className="mt-3 max-w-[65ch] leading-relaxed text-ink">{cs.redesign.iterationLead}</p>
            <div className="mt-8">
              <AnnotatedScreenshot figure={cs.redesign.annotated} number={5} />
            </div>
            <p className="mt-10 max-w-[65ch] leading-relaxed text-ink">{cs.redesign.iterationMore}</p>
            <Bullets items={cs.redesign.iteration} />
          </Section>

          <Section id="practice" heading={cs.practice.heading}>
            <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-[13rem_1fr]">
              {cs.practice.rows.map((row) => (
                <div key={row.label} className="contents">
                  <dt className="font-mono text-sm text-ink-muted">{row.label}</dt>
                  <dd className="max-w-[65ch] leading-relaxed text-ink sm:-mt-0.5">
                    {noBreakHyphens(row.text)}
                  </dd>
                </div>
              ))}
            </dl>
            <SubHeading>{cs.practice.skillsHeading}</SubHeading>
            <Bullets items={cs.practice.skills} />
            <SubHeading>{cs.practice.dependenciesHeading}</SubHeading>
            <Bullets items={cs.practice.dependencies} />
          </Section>

          <Section id="judgement" heading={cs.judgement.heading}>
            <Lead>{cs.judgement.lead}</Lead>
            <ol className="mt-6 flex flex-col gap-6">
              {cs.judgement.moments.map((moment, i) => (
                <li key={moment.title} className="grid gap-1 sm:grid-cols-[3rem_1fr]">
                  <span aria-hidden="true" className="font-mono text-sm text-accent sm:pt-1.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-ink">{noBreakHyphens(moment.title)}</h3>
                    <p className="mt-1 max-w-[65ch] leading-relaxed text-ink">
                      {noBreakHyphens(moment.text)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section
            id="next"
            heading={
              <>
                {cs.next.heading}{' '}
                <span className="ml-2 align-middle font-mono text-xs tracking-wide text-ink-muted uppercase">
                  {cs.next.label}
                </span>
              </>
            }
          >
            <Lead>{cs.next.lead}</Lead>
            <ol className="mt-6 flex flex-col gap-4">
              {cs.next.items.map((item) => (
                <li key={item} className="grid gap-1 sm:grid-cols-[6rem_1fr]">
                  <span className="font-mono text-xs tracking-wide text-ink-muted uppercase sm:pt-1.5">
                    {cs.next.label}
                  </span>
                  <p className="max-w-[65ch] leading-relaxed text-ink">{noBreakHyphens(item)}</p>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        <a href="/#work" className={`${linkStyle} mt-4 font-mono text-sm text-ink-muted`}>
          Back to work
        </a>
      </Container>
    </article>
  )
}

export default ApplydCaseStudy
