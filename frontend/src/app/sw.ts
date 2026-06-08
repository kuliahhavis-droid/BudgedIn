import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist, NetworkOnly } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher({ url }) {
        // Exclude all backend API requests and local api routes from PWA caching
        return (
          url.pathname.startsWith('/api/') || 
          url.hostname.includes('railway.app') ||
          (url.hostname === 'localhost' && url.port === '4000')
        );
      },
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: '/',
        matcher({ request }) {
          return request.mode === 'navigate';
        },
      },
    ],
  },
});

serwist.addEventListeners();
