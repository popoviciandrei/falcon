import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import compress from 'koa-compress';
import error500 from './middlewares/error500Middleware';
import serverTiming from './middlewares/serverTimingMiddleware';
import graphqlProxy from './middlewares/graphqlProxyMiddleware';
import { renderAppShell, renderApp } from './middlewares/routes';

/**
 * Creates an instance of Falcon web server
 * @param {ServerAppConfig} props Application parameters
 * @returns {WebServer} Falcon web server
 */
export async function Server({ App, clientApolloSchema, bootstrap, webpackAssets }) {
  const { config } = bootstrap;
  const instance = new Koa();
  if (bootstrap.onServerCreated) {
    await bootstrap.onServerCreated(instance);
  }

  const router = new Router();
  if (bootstrap.onRouterCreated) {
    await bootstrap.onRouterCreated(router);
  }

  if (config.graphqlUrl) {
    const { apolloClient } = config;
    const graphqlUri = (apolloClient && apolloClient.httpLink && apolloClient.httpLink.uri) || '/graphql';
    router.all(graphqlUri, graphqlProxy(config.graphqlUrl));
  }

  const nodeEnv = process.env.NODE_ENV;
  const publicDir = process.env.PUBLIC_DIR;
  const swDir = process.env.SW_DIR;

  router.get('/sw.js', serve(swDir, { maxage: 0 }));
  router.get('/static/*', serve(publicDir, { maxage: nodeEnv === 'production' ? 31536000000 : 0 }));
  router.get('/*', serve(publicDir));
  router.get('/app-shell', ...renderAppShell({ config, webpackAssets }));
  router.get('/*', ...(await renderApp({ App, clientApolloSchema, config, webpackAssets })));
  if (bootstrap.onRouterInitialized) {
    await bootstrap.onRouterInitialized(router);
  }

  instance
    .use(helmet())
    .use(error500())
    .use(serverTiming())
    .use(compress())
    .use(router.routes())
    .use(router.allowedMethods());

  if (bootstrap.onServerInitialized) {
    await bootstrap.onServerInitialized(instance);
  }

  return {
    instance,
    port: config.port,
    callback: () => instance.callback(),
    started: () => bootstrap.onServerStarted(instance)
  };
}

/**
 * @typedef {object} ServerAppConfig
 * @property {function} App Root application component
 * @property {{config, onServerCreated, onServerInitialized, onServerStarted }} bootstrap Initial configuration
 * @property {object} clientApolloSchema Apollo State object
 * @property {object} webpackAssets webpack assets
 */

/**
 * @typedef {object} WebServer
 * @property {Koa} instance Server instance
 * @property {function} callback Initial configuration
 * @property {number} port Desired PORT to run at
 * @property {object} clientApolloSchema Apollo State object
 */
