import About from '../components/About'
import Contact from '../components/Contact'
import Experience from '../components/Experience'
import Hero from '../components/Hero'
import Work from '../components/Work'
import { pageMeta } from '../content'
import { usePageMeta } from '../lib/usePageMeta'

/** The single-page home: every section, reached by anchor links. */
function Home() {
  // index.html already carries these, but setting them here too means leaving the case study
  // for home in the browser always puts home's back, whichever page the visit began on.
  usePageMeta(pageMeta.home.title, pageMeta.home.description, '/')

  return (
    <>
      <Hero />
      <Work />
      <Experience />
      <About />
      <Contact />
    </>
  )
}

export default Home
