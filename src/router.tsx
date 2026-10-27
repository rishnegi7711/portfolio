import { createBrowserRouter } from 'react-router'
import App from './App'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

/** Two pages and a catch-all. The case study loads on demand, so the home page's bundle
 *  doesn't carry it. vercel.json sends every path to index.html, so a deep link works. */
export const router = createBrowserRouter([
  {
    element: <App />,
    // Shown only while a deep link's lazy page is still loading: the paper background is
    // already on, so nothing flashes.
    hydrateFallbackElement: <></>,
    children: [
      { path: '/', element: <Home /> },
      {
        path: '/work/applyd',
        lazy: async () => ({ Component: (await import('./pages/ApplydCaseStudy')).default }),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
