import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

export async function initMocks() {
  if (typeof window === 'undefined') return

  try {
    await worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
      quiet: false,
    } as any)
    console.log('[MSW] Mock Service Worker iniciado com suporte a persistência no localStorage.')
  } catch (error) {
    console.warn('[MSW] Falha ao inicializar o Service Worker:', error)
  }
}
