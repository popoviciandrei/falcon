import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { ChunkExtractorManager } from '@loadable/server';
import { APP_INIT } from '../../graphql/config.gql';
import HtmlHead from '../../components/HtmlHead';

const helmetContext = {};

/**
 * App shell rendering middleware.
 * @returns {import('koa').Middleware} Koa middleware
 */
export default () => async (ctx, next) => {
  const { client, chunkExtractor } = ctx.state;
  const { config } = client.readQuery({ query: APP_INIT });

  const markup = (
    <ChunkExtractorManager extractor={chunkExtractor}>
      <HelmetProvider context={helmetContext}>
        <HtmlHead htmlLang={config.i18n.lng} />
      </HelmetProvider>
    </ChunkExtractorManager>
  );

  renderToString(markup);

  ctx.state.helmetContext = helmetContext.helmet;

  return next();
};
