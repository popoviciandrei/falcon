import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import Helmet from 'react-helmet';
import { ChunkExtractorManager } from '@loadable/server';
import { I18nProvider } from '@deity/falcon-i18n';
import HtmlHead from '../../components/HtmlHead';

/**
 * Server Side Rendering middleware.
 * @param {Object} params params
 * @param {{App: React.Component}} params.App React Component to render
 * @returns {import('koa').Middleware} Koa middleware
 */
export default ({ App }) => async (ctx, next) => {
  const { client, i18next, chunkExtractor, serverTiming } = ctx.state;
  const routerContext = {};

  const markup = (
    <ApolloProvider client={client}>
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
    </ApolloProvider>
  );

  await serverTiming.profile(async () => getDataFromTree(markup), 'getDataFromTree()');

  ctx.state.AppMarkup = markup;
  ctx.state.chunkExtractor = chunkExtractor;
  ctx.state.helmetContext = Helmet.renderStatic();

  return routerContext.url ? ctx.redirect(routerContext.url) : next();
};
