import { Outlet, ScrollRestoration } from 'react-router'
import Footer from './components/Footer'
import Header from './components/Header'

/** The shell every page shares: the header, the page itself, the footer. Which page is
 *  decided in router.tsx. ScrollRestoration puts the home page back where you were when
 *  you return from the case study with the browser's Back button. */
function App() {
  return (
    <>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  )
}

export default App
