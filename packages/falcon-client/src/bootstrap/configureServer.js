import url from 'url';
import Logger from '@deity/falcon-logger';
import fetch from 'node-fetch';
import { ProxyRequest } from '../service/ProxyRequest';

/**
 * @typedef {object} PaymentRedirectMap
 * @param {string} success Success page
 * @param {string} failure Failure page
 * @param {string} cancel Cancel page
 */

/**
 * @param {koa-router} router KoaRouter object
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
        const proxyResult = await ProxyRequest(url.resolve(serverUrl, ctx.originalUrl), ctx);
        const { status } = proxyResult;

        if (status === 404) {
          // Hiding "not found" page output from the backend
          ctx.message = proxyResult.statusText;
          ctx.status = status;
          return;
        }

        const { type, result } = await proxyResult.json();
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
