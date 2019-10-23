import apolloClientProvider from './apolloClientProvider';
import ssr from './ssrMiddleware';
import appShell from './appShellMiddleware';
import appHtml from './appHtmlMiddleware';
import i18next from './i18nextMiddleware';
import assets from './assetsMiddleware';

/**
 * @typedef {object} RenderAppShell
 * @property {object} config App configuration
 * @property {object} webpackAssets webpack assets
 */

/**
 * Configure App Shell rendering middlewares
 * @param {RenderAppShell} params params
 * @returns {function(ctx: object, next: function)[]} Koa middlewares
 */
export function renderAppShell({ config, webpackAssets }) {
  const { apolloClient } = config;
  const configSchema = { data: { config } };

  return [
    assets({ webpackAssets }),
    apolloClientProvider({ config: apolloClient, clientStates: { configSchema } }),
    appShell(),
    appHtml({ config })
  ];
}

/**
 * @typedef {object} RenderApp
 * @property {Function} App React Component
 * @property {object} config App configuration
 * @property {object} clientApolloSchema Apollo State object
 * @property {object} webpackAssets webpack assets
 */

/**
 * Configure App rendering middlewares
 * @param {RenderApp} params params
 * @returns {function(ctx: object, next: function)[]} Koa middlewares
 */
export async function renderApp({ config, clientApolloSchema, App, webpackAssets }) {
  const { i18n, serverSideRendering, apolloClient } = config;
  const configSchema = { data: { config } };

  return [
    assets({ webpackAssets }),
    apolloClientProvider({
      config: apolloClient,
      clientStates: {
        configSchema,
        clientApolloSchema
      }
    }),
    await i18next({ ...i18n }),
    serverSideRendering ? ssr({ App }) : appShell(),
    appHtml({ config })
  ].filter(x => x);
}
