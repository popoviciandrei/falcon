import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ApolloProvider } from '@apollo/react-common';
import { getDataFromTree } from '@apollo/react-ssr';
import { ChunkExtractorManager } from '@loadable/server';
import { I18nProvider } from '@deity/falcon-i18n';
import { HtmlHead } from '../../components';

const helmetContext = {};

/**
 * Server Side Rendering middleware.
 * @param {object} params params
 * @param {{App: React.Component}} params.App React Component to render
 * @returns {import('koa').Middleware} Koa middleware
 */
export default ({ App }) => async (ctx, next) => {
  const { client, i18next, chunkExtractor, serverTiming } = ctx.state;
  const routerContext = {};

  const markup = (
    <ChunkExtractorManager extractor={chunkExtractor}>
      <ApolloProvider client={client}>
        <I18nProvider i18n={i18next}>
          <StaticRouter context={routerContext} location={ctx.url}>
            <HelmetProvider context={helmetContext}>
              <HtmlHead htmlLang={i18next.language} />
              <App />
            </HelmetProvider>
          </StaticRouter>
        </I18nProvider>
      </ApolloProvider>
    </ChunkExtractorManager>
  );

  await serverTiming.profile(async () => getDataFromTree(markup), 'getDataFromTree()');

  ctx.state.AppMarkup = markup;
  ctx.state.chunkExtractor = chunkExtractor;
  ctx.state.helmetContext = helmetContext.helmet;

  return routerContext.url ? ctx.redirect(routerContext.url) : next();
};
