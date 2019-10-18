import url from 'url';
import Logger from '@deity/falcon-logger';
import fetch from 'node-fetch';
import { proxyRequest } from '../service/proxyRequest';

/**
 * @typedef {object} PaymentRedirectMap
 * @param {string} success Success page
 * @param {string} failure Failure page
 * @param {string} cancel Cancel page
 */

/**
 * @param {import('koa-router')} router KoaRouter object
 * @param {string} serverUrl Falcon-Server URL
 * @param {string[]} endpoints list of endpoints to be proxied to {serverUrl}
 * @param {object} redirects Map of redirects
 * @param {PaymentRedirectMap} redirects.payment Payment redirects
 * @returns {undefined}
 */
export const configureProxy = async (router, serverUrl, endpoints, redirects) => {
  if (!router) {
    Logger.error('"router" must be passed for "configureProxy" call in your "bootstrap.js" file');
    return;
  }
  if (!serverUrl) {
    Logger.error('"serverUrl" must be passed for "configureProxy" call in your "bootstrap.js" file.');
    return;
  }

  if (!endpoints || !endpoints.length) {
    return;
  }

  try {
    endpoints.forEach(endpoint => {
      // using "endpoint" value as a proxied route name
      router.all(endpoint, async ctx => {
        const response = await proxyRequest(url.resolve(serverUrl, ctx.originalUrl), ctx);

        response.headers.forEach((value, name) => ctx.set(name, value));
        /**
         * node-fetch returns `set-cookie` headers concatenated with `, ` (which is invalid)
         * for this reason we manually fill `set-cookie` with `raw` headers
         * @see https://github.com/bitinn/node-fetch/blob/master/src/headers.js#L120
         */
        ctx.set('set-cookie', response.headers.raw()['set-cookie'] || []);

        if (response.status === 404) {
          // Hiding "not found" page output from the backend
          ctx.message = response.statusText;
          ctx.status = response.status;
          return;
        }

        const { type, result } = await response.json();
        const { [type]: redirectMap = {} } = redirects;
        const { [result]: redirectLocation = '/' } = redirectMap;

        // Result redirection
        ctx.status = 302;
        ctx.redirect(redirectLocation);
      });
    });
    Logger.info('Endpoints configured');
  } catch (error) {
    Logger.error(`Failed to handle remote endpoints: ${error.message}`);
  }
};

/**
 * Fetches a config from Falcon-Server
 * @param {string} serverUrl Falcon-Server URL
 * @returns {object} Remote server config
 */
export const fetchRemoteConfig = async serverUrl => {
  if (!serverUrl) {
    Logger.error('"serverUrl" is required for "fetchConfig" call in your "bootstrap.js" file.');
    return;
  }

  const endpointsConfigUrl = url.resolve(serverUrl, '/config');
  try {
    const remoteConfigResult = await fetch(endpointsConfigUrl);
    if (!remoteConfigResult.ok) {
      throw new Error(`${remoteConfigResult.url} - ${remoteConfigResult.status} ${remoteConfigResult.statusText}`);
    }
    return await remoteConfigResult.json();
  } catch (error) {
    Logger.error(`Failed to process remote config from Falcon-Server: ${error.message}`);
  }
  return {};
};
