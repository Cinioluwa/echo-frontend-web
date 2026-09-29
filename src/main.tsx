import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { enableMapSet } from 'immer'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './components/routes.tsx'
import AppErrorBoundary from './components/shared/AppErrorBoundary.tsx'
import { tryAutoReloadForChunkError } from './utils/chunkRetry.ts'

// Enable Immer MapSet plugin for Zustand stores using Set/Map
enableMapSet()

// Auto-recover from Vite dynamic import failures (e.g. after fresh deployments)
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  tryAutoReloadForChunkError(event);
});

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

// Remove splash screen smoothly
const splash = document.getElementById('echo-splash');
if (splash) {
  setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.remove();
    }, 500);
  }, 500);
}
