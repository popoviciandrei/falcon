import React from 'react';
import { renderToString } from 'react-dom/server';
import { extractI18nextState } from '../../i18n/i18nServerFactory';
import Html from '../../components/Html';

/**
 * Application html renderer middleware.
 * @param {Object} params params
 * @param {Object} params.config configuration
 * @returns {import('koa').Middleware} Koa middleware
 */
export default ({ config }) => async ctx => {
  const { AppMarkup, client, i18next, assets, chunkExtractor, helmetContext, serverTiming } = ctx.state;
  const { webmanifest } = assets;

  const renderTimer = serverTiming.start('HTML renderToString()');

  const htmlDocument = renderToString(
    <Html
      assets={{ webmanifest }}
      chunkExtractor={chunkExtractor}
      helmetContext={helmetContext}
      state={client.extract()}
      i18nextState={extractI18nextState(i18next)}
      googleTagManager={config.googleTagManager}
    >
      {AppMarkup}
    </Html>
  );

  serverTiming.stop(renderTimer);

  ctx.status = 200;
  ctx.body = `<!doctype html>${htmlDocument}`;
};
