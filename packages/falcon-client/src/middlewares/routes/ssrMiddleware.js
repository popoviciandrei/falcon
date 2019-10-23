import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-common';
import { getDataFromTree } from '@apollo/react-ssr';
import { HelmetProvider } from 'react-helmet-async';
import { ChunkExtractorManager } from '@loadable/server';
import { I18nProvider } from '@deity/falcon-i18n';
import HtmlHead from '../../components/HtmlHead';

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
    <ApolloProvider client={client}>
      <HelmetProvider context={helmetContext}>
        <ChunkExtractorManager extractor={chunkExtractor}>
          <I18nProvider i18n={i18next}>
            <StaticRouter context={routerContext} location={ctx.url}>
              <React.Fragment>
                <HtmlHead htmlLang={i18next.language} />
                <App />
              </React.Fragment>
            </StaticRouter>
          </I18nProvider>
        </ChunkExtractorManager>
      </HelmetProvider>
    </ApolloProvider>
  );

  await serverTiming.profile(async () => getDataFromTree(markup), 'getDataFromTree()');

  ctx.state.AppMarkup = markup;
  ctx.state.chunkExtractor = chunkExtractor;
  ctx.state.helmetContext = helmetContext.helmet;

  return routerContext.url ? ctx.redirect(routerContext.url) : next();
};
