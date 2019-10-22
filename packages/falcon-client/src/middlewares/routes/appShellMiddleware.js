import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { ChunkExtractorManager } from '@loadable/server';
import { APP_INIT } from '../../graphql/config.gql';
import HtmlHead from '../../components/HtmlHead';

/**
 * App shell rendering middleware.
 * @returns {import('koa').Middleware} Koa middleware
 */
export default () => async (ctx, next) => {
  const { client, chunkExtractor } = ctx.state;
  const { config } = client.readQuery({ query: APP_INIT });

  const markup = (
    <ChunkExtractorManager extractor={chunkExtractor}>
      <HtmlHead htmlLang={config.i18n.lng} />
    </ChunkExtractorManager>
  );

  renderToString(markup);

  ctx.state.helmetContext = Helmet.renderStatic();

  return next();
};
