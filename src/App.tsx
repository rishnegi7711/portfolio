import Header from './components/Header'
import Hero from './components/Hero'
import SectionStub from './components/SectionStub'
import { sections } from './content'

function App() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        {sections.map((section) => (
          <SectionStub key={section.id} id={section.id} label={section.label} />
        ))}
      </main>
    </>
  )
}

export default App
