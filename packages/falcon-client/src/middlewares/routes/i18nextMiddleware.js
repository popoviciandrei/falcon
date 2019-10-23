import { GET_BACKEND_CONFIG } from '@deity/falcon-data';
import i18nFactory from '../../i18n/i18nServerFactory';

/**
 * @typedef {object} Options
 * @property {string} lng language
 * @property {string[]} ns namespaces to load
 * @property {string} fallbackLng fallback language
 * @property {string[]} whitelist languages whitelist
 * @property {object} resources Initial internationalization resources
 */

/**
 * i18next instance server side factory
 * @param {Options} options options
 * @returns {Promise<import('koa').Middleware>} Koa middleware
 */
export default async options => {
  const i18next = await i18nFactory({ ...options });

  return async (ctx, next) => {
    const { client } = ctx.state;

    const { data } = await client.query({ query: GET_BACKEND_CONFIG });
    await i18next.changeLanguage(data.backendConfig.activeLocale);
    if (process.env.NODE_ENV === 'development') {
      // because of SSR and HMR of translation files
      await i18next.reloadResources();
    }

    ctx.state.i18next = i18next;

    return next();
  };
};
