// eslint-disable-next-line import/no-extraneous-dependencies
import 'jest-extended';
import React from 'react';
import Helmet from 'react-helmet';
import loadable from '@loadable/component';
import { Route, Switch } from 'react-router-dom';
import Koa from 'koa';
import supertest from 'supertest';
import { BaseSchema } from '@deity/falcon-server';
import { T } from '@deity/falcon-i18n';
import { Server } from './server';
import DynamicRoute from './components/DynamicRoute';
import defaultConfiguration from './clientApp/defaultConfiguration';

describe('Server', () => {
  const fakeI18nConfig = {
    __typename: 'I18nConfig',
    lng: 'en',
    resources: {
      __typename: 'I18nResources',
      en: {
        __typename: 'I18nResourcesData',
        translations: {
          __typename: 'I18nTranslations',
          key: 'foo bar baz'
        }
      }
    }
  };

  it('Should properly call eventHandlers', async () => {
    const onServerCreatedMock = jest.fn();
    const onServerInitializedMock = jest.fn();
    const onServerStartedMock = jest.fn();
    const onRouterCreatedMock = jest.fn();
    const onRouterInitializedMock = jest.fn();

    jest.mock('./middlewares/routes/i18nextMiddleware', () => {});

    const config = defaultConfiguration({
      serverSideRendering: true,
      logLevel: 'error',
      i18n: { ...fakeI18nConfig }
    });
    const bootstrap = {
      config,
      onServerCreated: onServerCreatedMock,
      onServerInitialized: onServerInitializedMock,
      onServerStarted: onServerStartedMock,
      onRouterCreated: onRouterCreatedMock,
      onRouterInitialized: onRouterInitializedMock
    };

    const server = await Server({
      App: () => <div />,
      bootstrap,
      clientApolloSchema: {
        data: {}
      },
      webpackAssets: {
        publicPath: '',
        assets: [],
        namedChunkGroups: {
          client: {
            chunks: [],
            assets: [],
            children: {},
            childAssets: {}
          }
        }
      }
    });
    server.started();

    expect(server.instance).toBeInstanceOf(Koa);
    expect(onServerCreatedMock).toBeCalledWith(server.instance);

    expect(onServerInitializedMock).toBeCalledWith(server.instance);
    expect(onServerInitializedMock).toHaveBeenCalledAfter(onServerCreatedMock);

    expect(onServerStartedMock).toBeCalledWith(server.instance);
    expect(onServerStartedMock).toHaveBeenCalledAfter(onServerInitializedMock);

    expect(onRouterCreatedMock).toBeCalled();
    expect(onRouterCreatedMock).toHaveBeenCalledAfter(onServerCreatedMock);
    expect(onRouterCreatedMock).toHaveBeenCalledBefore(onRouterInitializedMock);

    expect(onRouterInitializedMock).toBeCalled();
    expect(onRouterInitializedMock).toHaveBeenCalledBefore(onServerStartedMock);
  });

  it('Should render Home page (SSR)', async () => {
    Helmet.canUseDOM = false;
    const Home = () => (
      <div>
        <h2>Foo</h2>
        <p>
          <T id="key" />
        </p>
      </div>
    );

    const App = () => (
      <Switch>
        <Route exact path="/" component={Home} />
        <DynamicRoute
          components={{
            shop: loadable(() => import('./__mocks__/pages/Shop')),
            post: loadable(() => import('./__mocks__/pages/Post'))
          }}
        />
      </Switch>
    );

    const config = defaultConfiguration({
      logLevel: 'error',
      serverSideRendering: true,
      googleTagManager: { __typename: 'GTMConfig', id: null },
      i18n: { ...fakeI18nConfig },
      apolloClient: {
        httpLink: {
          typeDefs: [BaseSchema]
        }
      }
    });

    const bootstrap = {
      config,
      onServerCreated: () => {},
      onServerInitialized: () => {}
    };
    const clientApolloSchema = {
      data: {
        backendConfig: {
          __typename: 'BackendConfig',
          locales: ['en-US'],
          activeLocale: 'en-US'
        }
      }
    };

    const server = await Server({
      App,
      bootstrap,
      clientApolloSchema,
      webpackAssets: {
        publicPath: '',
        assets: [],
        namedChunkGroups: {
          client: {
            chunks: [],
            assets: [],
            children: {},
            childAssets: {}
          }
        }
      }
    });
    const serverHandler = server.callback();

    const response = await supertest(serverHandler).get('/');

    expect(response.status).toBe(200);
    expect(response.headers).toContainKey('server-timing');
    expect(response.text).toEqual(expect.stringContaining('<h2>Foo</h2>'));
    expect(response.text).toEqual(expect.stringContaining('<p>foo bar baz</p>'));
  });
});
