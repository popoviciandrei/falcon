/* eslint no-restricted-globals: 0 */

import { setCacheNameDetails, cacheNames } from 'workbox-core';
import { Router, NavigationRoute } from 'workbox-routing';
import { precacheAndRoute, getCacheKeyForURL } from 'workbox-precaching';

/**
 * @typedef {object} FalconSWBuildConfig
 * @property {boolean} precache if Workbox precache
 */
/** @type {FalconSWBuildConfig} */
const CONFIG = {};

const ENTRIES = [];

/**
 * `message` event handler
 * @param {Event} event event
 */
function onMessage(event) {
  const { data } = event;

  if (data && data.type) {
    switch (data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;

      default:
        break;
    }
  }
}

self.addEventListener('message', onMessage);

setCacheNameDetails({ prefix: '@deity' });
if (CONFIG.precache) {
  precacheAndRoute(ENTRIES, {});
}

const router = new Router();
self.addEventListener('fetch', event => {
  const responsePromise = router.handleRequest(event);
  if (responsePromise) {
    // if response is redirected, we should clone the response before sending it
    // see https://stackoverflow.com/a/45440505/412319
    event.respondWith(responsePromise.then(res => (res.redirected ? res.clone() : res)));
  }
});

/**
 * Check if Service Worker is waiting for activation, but there is only one client
 * @returns {boolean} boolean
 */
async function isWaitingWithOneClient() {
  const clients = await self.clients.matchAll();

  return self.registration.waiting && clients.length <= 1;
}

async function getFromCacheOrNetwork(request) {
  try {
    const response = await caches.match(request, { cacheName: cacheNames.precache });

    if (response) {
      return response;
    }

    // This shouldn't normally happen, but there are edge cases: https://github.com/GoogleChrome/workbox/issues/1441
    throw new Error(`The cache ${cacheNames.precache} did not have an entry for ${request}.`);
  } catch (error) {
    // If there's either a cache miss, or the caches.match() call threw
    // an exception, then attempt to fulfill the navigation request with
    // a response from the network rather than leaving the user with a
    // failed navigation.
    console.log(`Unable to respond to navigation request with cached response. Falling back to network.`, error);

    // This might still fail if the browser is offline...
    return fetch(request);
  }
}

router.registerRoute(
  new NavigationRoute(
    async ({ url }) => {
      if (await isWaitingWithOneClient()) {
        self.registration.waiting.postMessage({ type: 'SKIP_WAITING', payload: undefined });

        return new Response('', { headers: { Refresh: '0' } }); // refresh the tab by returning a blank response
      }

      if (!CONFIG.precache) {
        return fetch(url.href);
      }

      const cachedUrlKey = getCacheKeyForURL('app-shell');
      if (!cachedUrlKey) {
        return fetch(url.href);
      }

      return getFromCacheOrNetwork(cachedUrlKey);
    },
    {
      blacklist: CONFIG.blacklistRoutes.map(route => new RegExp(route))
    }
  )
);
