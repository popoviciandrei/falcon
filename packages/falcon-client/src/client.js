import 'core-js';
import 'regenerator-runtime/runtime';
import 'app-webmanifest';

import React from 'react';
import { hydrate, render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-common';
import { loadableReady } from '@loadable/component';
import { I18nProvider } from '@deity/falcon-i18n';
import { getClientConfig } from '@deity/falcon-front-kit';
import { HelmetProvider } from 'react-helmet-async';
import { apolloClientWeb } from './service';
import { HtmlHead } from './components';
import App, { clientApolloSchema } from './clientApp';
import i18nFactory from './i18n/i18nClientFactory';

// eslint-disable-next-line no-underscore-dangle
const initialState = window.__APOLLO_STATE__ || {};
const clientConfig = getClientConfig(initialState) || {};

const { language } = window.I18NEXT_STATE || {};
const i18nConfig = { ...clientConfig.i18n, lng: language };
const renderApp = clientConfig.serverSideRendering ? hydrate : render;

loadableReady()
  .then(() => apolloClientWeb({ initialState, clientApolloSchema, apolloClientConfig: clientConfig.apolloClient }))
  .then(apolloClient => i18nFactory(i18nConfig).then(i18next => ({ apolloClient, i18next })))
  .then(({ apolloClient, i18next }) => {
    const markup = (
      <ApolloProvider client={apolloClient}>
        <I18nProvider i18n={i18next}>
          <BrowserRouter>
            <HelmetProvider>
              <HtmlHead htmlLang={i18nConfig.lng} />
              <App />
            </HelmetProvider>
          </BrowserRouter>
        </I18nProvider>
      </ApolloProvider>
    );

    renderApp(markup, document.getElementById('root'));
  });

if (module.hot) {
  module.hot.accept();
}
