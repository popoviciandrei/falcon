import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { ChunkExtractorManager } from '@loadable/server';
import { HtmlHead } from '../../components';

const helmetContext = {};

/**
 * Application html renderer middleware.
 * @param {{ config }} params params
 * @param {object} params.config configuration
 * @returns {import('koa').Middleware} Koa middleware
 */
export default ({ config }) => async (ctx, next) => {
  const { chunkExtractor } = ctx.state;

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
