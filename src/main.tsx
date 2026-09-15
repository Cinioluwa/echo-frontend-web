import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { enableMapSet } from 'immer'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './components/routes.tsx'
import AppErrorBoundary from './components/shared/AppErrorBoundary.tsx'

// Enable Immer MapSet plugin for Zustand stores using Set/Map
enableMapSet()

// ── Dev-only API mocks ──────────────────────────────────────────────────────
// When running `npm run dev`, answer every API call from in-memory fixtures so
// the app renders with seeded content — no backend or database required.
// For production builds Vite statically replaces `import.meta.env.DEV` with
// `false`, so this branch (and the mock code) is dropped from the bundle.
if (import.meta.env.DEV) {
  await import("./api/mocks/setupMock")
}

// Register Service Worker for Web Push notifications
// Must be at /service-worker.js (root scope) so Vite can serve it unmodified.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((err) => {
      console.warn('[SW] Registration failed:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <RouterProvider router={router}></RouterProvider>
    </AppErrorBoundary>
  </StrictMode>,
)
