global.__SERVER__ = true; // eslint-disable-line no-underscore-dangle

const nock = require('nock');
const { Cache, InMemoryLRUCache, BearerAuth } = require('@deity/falcon-server-env');
const { codes } = require('@deity/falcon-errors');
const { BaseSchema } = require('@deity/falcon-server');
const { Schema } = require('@deity/falcon-shop-extension');
const { makeExecutableSchema } = require('graphql-tools');
const { EventEmitter2 } = require('eventemitter2');
const addSeconds = require('date-fns/add_seconds');
const { Headers } = require('apollo-server-env');
const { Magento2ApiBase } = require('./Magento2ApiBase');
const magentoResponses = require('./__mocks__/apiResponses');
const { AuthScope, IntegrationAuthType } = require('./authorization');

const URL = 'http://example.com';
const ee = new EventEmitter2();
const apiConfig = {
  config: {
    host: 'example.com',
    protocol: 'http',
    auth: {
      type: 'admin-token'
    }
  },
  name: 'api-magento2',
  eventEmitter: ee,
  gqlServerConfig: {
    schema: makeExecutableSchema({
      typeDefs: [BaseSchema, Schema],
      resolvers: {
        PlaceOrderResult: {
          // passing empty type resolver to avoid warnings on the console
          __resolveType: () => ''
        }
      }
    })
  }
};
const createMagentoUrl = path => `/rest/default/V1${path}`;
const inMemoryCache = new Cache(new InMemoryLRUCache());

describe('Magento2ApiBase', () => {
  let api;
  let cache;

  beforeAll(async () => {
    nock(URL)
      .persist(true)
      .post(createMagentoUrl('/integration/admin/token'))
      .reply(200, magentoResponses.adminToken);

    nock(URL)
      .persist(true)
      .get(createMagentoUrl('/store/storeConfigs'))
      .reply(200, [
        {
          locale: 'en-US',
          extension_attributes: {},
          code: 'default'
        }
      ]);

    nock(URL)
      .persist(true)
      .get(createMagentoUrl('/store/storeViews'))
      .reply(200, [
        {
          website_id: 1,
          code: 'default',
          store_group_id: 'bar',
          extension_attributes: {
            is_active: true
          }
        }
      ]);

    nock(URL)
      .persist(true)
      .get(createMagentoUrl('/store/storeGroups'))
      .reply(200, [
        {
          id: 'bar',
          website_id: 'oof'
        }
      ]);

    nock(URL)
      .persist(true)
      .get(createMagentoUrl('/store/websites'))
      .reply(200, [
        {
          id: 'oof'
        }
      ]);
  });

  afterAll(() => {
    nock.restore();
  });

  beforeEach(() => {
    cache = inMemoryCache;
    api = new Magento2ApiBase(apiConfig);
    api.initialize({ context: {}, cache });
    api.context = {
      session: jest.fn(() => {})
    };
  });

  describe('initialize', () => {
    it('Should throw an error if auth type is not supported', async () => {
      api = new Magento2ApiBase({
        ...apiConfig,
        config: {
          auth: {
            type: 'not-supported'
          }
        }
      });

      try {
        await api.initialize({
          context: { session: { 'api-magento2': {} } },
          cache: inMemoryCache
        });
      } catch (error) {
        expect(error.message).toBe(`Unsupported integration authorization type ('auth.type': 'not-supported')!`);
      }
    });

    it('Should setup customer auth and integration scope auth of chose', async () => {
      api = new Magento2ApiBase({
        ...apiConfig,
        config: {
          auth: {
            type: IntegrationAuthType.adminToken
          }
        }
      });

      await api.initialize({
        context: { session: { 'api-magento2': {} } },
        cache: inMemoryCache
      });

      expect(api.integrationScopeAuth instanceof BearerAuth).toBe(true);
      expect(api.customerScopeAuth instanceof BearerAuth).toBe(true);
    });
  });

  it('Should correctly fetch admin token', async () => {
    const result = await api.fetchAdminToken({});
    expect(result.value).toEqual(magentoResponses.adminToken);
  });

  it('Should correctly handle request error without token', async () => {
    nock(URL)
      .get(uri => uri.indexOf(createMagentoUrl('/products') > 0))
      .reply(401, {
        message: 'Customer unauthorized.',
        parameters: {
          resources: 'Magento_Catalog::categories'
        }
      });

    try {
      await api.getForCustomer(createMagentoUrl('/products'));
    } catch (error) {
      expect(error.extensions.code).toBe(codes.UNAUTHENTICATED);
      expect(error.message).toBe('Customer unauthorized.');
      expect(error.statusCode).toBe(401);
    }
  });

  describe('authorizeRequest', () => {
    beforeEach(() => {
      api.initialize({ context: {}, cache: inMemoryCache });
    });

    it('Should throw error if authorization scope is no defined', async () => {
      const request = {
        headers: new Headers(),
        context: { auth: undefined }
      };

      try {
        await api.authorizeRequest(request);
      } catch (error) {
        expect(error.message).toBe('Cannot authorize request because authorization scope is no defined!');
      }
    });

    it('Should throw error if authorization scope is not supported', async () => {
      const authScope = 'not-yet-supported';
      const request = {
        headers: new Headers(),
        context: { auth: authScope }
      };

      try {
        await api.authorizeRequest(request);
      } catch (error) {
        expect(error.message).toBe(`Attempted to authenticate the request using an unsupported scope: "${authScope}"!`);
      }
    });

    it('Should authorize request within the scope of chose', async () => {
      const authScope = 'authScope';
      const request = {
        headers: new Headers(),
        context: { auth: authScope }
      };
      api[`${authScope}ScopeAuth`] = { authorize: jest.fn(() => Promise.resolve(true)) };

      await api.authorizeRequest(request);
      expect(api[`${authScope}ScopeAuth`].authorize).toHaveBeenCalledTimes(1);
      expect(api[`${authScope}ScopeAuth`].authorize).toHaveBeenCalledWith(request);
    });
  });

  describe('customer authorization', () => {
    beforeEach(() => {
      api.initialize({ context: {}, cache: inMemoryCache });
    });

    it('Should throw error if there is no Customer token', async () => {
      const request = {
        headers: new Headers(),
        context: { auth: AuthScope.Customer }
      };

      api.initialize({
        context: { session: { 'api-magento2': {} } },
        cache: inMemoryCache
      });

      try {
        await api.authorizeRequest(request);
      } catch (error) {
        expect(error.extensions.code).toBe(codes.UNAUTHENTICATED);
        expect(error.message).toBe('Customer unauthorized.');
        expect(error.statusCode).toBe(401);
      }
    });

    it('Should throw error if Customer token expires', async () => {
      const request = {
        headers: new Headers(),
        context: { auth: AuthScope.Customer }
      };

      api.isCustomerSessionExpired = jest.fn(() => false);
      api.initialize({
        context: {
          session: {
            'api-magento2': {
              customerToken: {
                token: 'token#1234567890',
                expirationTime: addSeconds(Date.now(), -1)
              }
            }
          }
        },
        cache: inMemoryCache
      });

      try {
        await api.authorizeRequest(request);
      } catch (error) {
        expect(error.extensions.code).toBe(codes.CUSTOMER_TOKEN_EXPIRED);
        expect(error.message).toBe('Customer token has expired.');
        expect(error.statusCode).toBe(401);
      }
    });

    it('Should authorize request within the Customer scope', async () => {
      const request = {
        headers: new Headers(),
        context: { auth: AuthScope.Customer }
      };

      api.initialize({
        context: {
          session: {
            'api-magento2': {
              customerToken: {
                token: 'token#1234567890',
                expirationTime: addSeconds(Date.now(), 60)
              }
            }
          }
        },
        cache: inMemoryCache
      });

      const result = await api.authorizeRequest(request);
      expect(result.headers.get('Authorization')).toEqual('Bearer token#1234567890');
    });
  });
});
