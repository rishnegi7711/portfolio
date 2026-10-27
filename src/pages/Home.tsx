import About from '../components/About'
import Contact from '../components/Contact'
import Experience from '../components/Experience'
import Hero from '../components/Hero'
import Work from '../components/Work'

/** The single-page home: every section, reached by anchor links. */
function Home() {
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
