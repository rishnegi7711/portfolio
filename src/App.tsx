import About from './components/About'
import Experience from './components/Experience'
import Header from './components/Header'
import Hero from './components/Hero'
import SectionStub from './components/SectionStub'
import Work from './components/Work'
import { sections } from './content'

function App() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Work />
        <Experience />
        <About />
        {sections
          .filter((section) => !['work', 'experience', 'about'].includes(section.id))
          .map((section) => (
            <SectionStub key={section.id} id={section.id} label={section.label} />
          ))}
      </main>
    </>
  )
}

export default App
