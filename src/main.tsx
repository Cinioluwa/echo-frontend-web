import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { enableMapSet } from 'immer'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './components/routes.tsx'

// Enable Immer MapSet plugin for Zustand stores using Set/Map
enableMapSet()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
