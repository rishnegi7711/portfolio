import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/source-sans-3'
import '@fontsource/fragment-mono'
import './index.css'
import { router } from './router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
