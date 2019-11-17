import util from 'util';
import _ from 'lodash';
import addSeconds from 'date-fns/add_seconds';
import { URLSearchParamsInit } from 'apollo-server-env';
import { ApiDataSource, BearerAuth, ContextRequestInit } from '@deity/falcon-server-env';
import { FalconError, AuthenticationError, codes } from '@deity/falcon-errors';
import { AuthScope, IntegrationAuthType, setAuthScope, OAuth1Auth } from './authorization';

export type CustomerToken = {
  /** authorization bearer */
  token: string;
  /** expiration date */
  expirationTime: Date;
};

/**
 * Base API features (configuration fetching, response parsing, token management etc.) required for communication
 * with Magento2. Extracted to separate class to keep final class clean (only resolvers-related logic should be there).
 */
export class Magento2ApiBase extends ApiDataSource {
  storeCode: string;

  storePrefix: string;

  cookie: any;

  magentoConfig: any;

  storeList: any[];

  storeConfigMap: any;

  itemUrlSuffix: string;

  oAuth: any;

  __adminToken: any;

  integrationScopeAuth: any;

  customerScopeAuth: any;

  /**
   * Create Magento api wrapper instance
   * @param {object} params configuration params
   */
  constructor(params) {
    super(params);
    this.storeCode = this.config.defaultStoreCode || 'default';
    this.cookie = null;
    this.magentoConfig = {};
    this.storeList = [];
    this.storeConfigMap = {};
    this.itemUrlSuffix = this.config.itemUrlSuffix || '.html';
  }

  /**
   * Create authorized GET request, for `customer` scope if customer logged in or `integration` otherwise
   * @param {string} path path
   * @param {URLSearchParamsInit} params object representation of query string
   * @param {ContextRequestInit} init options
   * @returns {Promise} response
   */
  async getAuth(path: string, params: URLSearchParamsInit = undefined, init: ContextRequestInit = {}) {
    return super.get(path, params, setAuthScope(init, !!this.session.customerToken));
  }

  /**
   * Create authorized POST request, for `customer` scope if customer logged in or `integration` otherwise
   * @param {string} path path
   * @param {object} body body
   * @param {ContextRequestInit} init options
   * @returns {Promise} response
   */
  async postAuth(path: string, body: any = undefined, init: ContextRequestInit = {}) {
    return super.post(path, body, setAuthScope(init, !!this.session.customerToken));
  }

  /**
   * Create authorized PATCH request, for `customer` scope if customer logged in or `integration` otherwise
   * @param {string} path path
   * @param {object} body body
   * @param {ContextRequestInit} init options
   * @returns {Promise} response
   */
  async patchAuth(path: string, body: any = undefined, init: ContextRequestInit = {}) {
    return super.patch(path, body, setAuthScope(init, !!this.session.customerToken));
  }

  /**
   * Create authorized PUT request, for `customer` scope if customer logged in or `integration` otherwise
   * @param {string} path path
   * @param {object} body body
   * @param {ContextRequestInit} init options
   * @returns {Promise} response
   */
  async putAuth(path: string, body: any = undefined, init: any = {}) {
    return super.put(path, body, setAuthScope(init, !!this.session.customerToken));
  }

  /**
   * Create authorized DELETE request, for `customer` scope if customer logged in or `integration` otherwise
   * @param {string} path path
   * @param {URLSearchParamsInit} params object representation of query string
   * @param {ContextRequestInit} init options
   * @returns {Promise} response
   */
  async deleteAuth(path: string, params: URLSearchParamsInit = undefined, init: ContextRequestInit = {}) {
    return super.delete(path, params, setAuthScope(init, !!this.session.customerToken));
  }

  /**
   * Create authorized GET request, for `integration` scope
   * @param {string} path path
   * @param {URLSearchParamsInit} params object representation of query string
   * @param {ContextRequestInit} init options
   * @returns {Promise} response
   */
  async getForIntegration(path: string, params: URLSearchParamsInit = undefined, init: ContextRequestInit = {}) {
    return super.get(path, params, setAuthScope(init, AuthScope.Integration));
  }

  /**
   * Create authorized POST request, for `integration` scope
   * @param {string} path path
   * @param {object} body object representation of query string
   * @param {ContextRequestInit} init options
   * @returns {Promise} response
   */
  async postForIntegration(path: string, body: any = undefined, init: ContextRequestInit = {}) {
    return super.post(path, body, setAuthScope(init, AuthScope.Integration));
  }

  /**
   * Create authorized PATCH request, for `integration` scope
   * @param {string} path path
   * @param {object} body object representation of query string
   * @param {ContextRequestInit} init options
   * @returns {Promise} response
   */
  async patchForIntegration(path: string, body: any = undefined, init: ContextRequestInit = {}) {
    return super.patch(path, body, setAuthScope(init, AuthScope.Integration));
  }

  /**
   * Create authorized PUT request, for `integration` scope
   * @param {string} path path
   * @param {object} body object representation of query string
   * @param {ContextRequestInit} init options
   * @returns {Promise} response
   */
  async putForIntegration(path: string, body: any = undefined, init: ContextRequestInit = {}) {
    return super.put(path, body, setAuthScope(init, AuthScope.Integration));
  }

  /**
   * Create authorized DELETE request, for `integration` scope
   * @param {string} path path
   * @param {URLSearchParamsInit} params object representation of query string
   * @param {ContextRequestInit} init options
   * @returns {Promise} response
   */
  async deleteForIntegration(path: string, params: URLSearchParamsInit = undefined, init: ContextRequestInit = {}) {
    return super.delete(path, params, setAuthScope(init, AuthScope.Integration));
  }

  /**
   * Create authorized GET request, for `customer` scope
   * @param {string} path path
   * @param {URLSearchParamsInit} params object representation of query string
   * @param {ContextRequestInit} init options
   * @returns {Promise} response
   */
  async getForCustomer(path: string, params: URLSearchParamsInit = undefined, init: ContextRequestInit = {}) {
    return super.get(path, params, setAuthScope(init, AuthScope.Customer));
  }

  /**
   * Create authorized POST request, for `customer` scope
   * @param {string} path path
   * @param {object} body object representation of query string
   * @param {ContextRequestInit} init options
   * @returns {Promise} response
   */
  async postForCustomer(path: string, body: any = undefined, init: ContextRequestInit = {}) {
    return super.post(path, body, setAuthScope(init, AuthScope.Customer));
  }

  /**
   * Create authorized PATCH request, for `customer` scope
   * @param {string} path path
   * @param {object} body object representation of query string
   * @param {ContextRequestInit} init options
   * @returns {Promise} response
   */
  async patchForCustomer(path: string, body: any = undefined, init: ContextRequestInit = {}) {
    return super.patch(path, body, setAuthScope(init, AuthScope.Customer));
  }

  /**
   * Create authorized PUT request, for `customer` scope
   * @param {string} path path
   * @param {object} body object representation of query string
   * @param {ContextRequestInit} init options
   * @returns {Promise} response
   */
  async putForCustomer(path: string, body: any = undefined, init: ContextRequestInit = {}) {
    return super.put(path, body, setAuthScope(init, AuthScope.Customer));
  }

  /**
   * Create authorized DELETE request, for `customer` scope
   * @param {string} path path
   * @param {URLSearchParamsInit} params object representation of query string
   * @param {ContextRequestInit} init options
   * @returns {Promise} response
   */
  async deleteForCustomer(path: string, params: URLSearchParamsInit = undefined, init: ContextRequestInit = {}) {
    return super.delete(path, params, setAuthScope(init, AuthScope.Customer));
  }

  getStoreCode() {
    return this.session.storeCode || this.storeCode;
  }

  /**
   * Makes sure that context required for http calls exists
   * Gets basic store configuration from Magento
   * @returns {object} Magento config
   */
  async fetchBackendConfig() {
    const getCachedValue = async url =>
      this.cache.get([this.name, this.getStoreCode(), url].join(':'), {
        fetchData: async () => this.getForIntegration(url),
        options: {
          ttl: 10 * 60 // 10 min
        }
      });

    const [storeConfigs, storeViews, storeGroups, storeWebsites] = await Promise.all([
      getCachedValue('/store/storeConfigs'),
      getCachedValue('/store/storeViews'),
      getCachedValue('/store/storeGroups'),
      getCachedValue('/store/websites')
    ]);

    // Processing "active" items only
    const activeStoreViews = storeViews.filter(x => x.extension_attributes.is_active && x.website_id);
    const activeStoreWebsites = storeWebsites.filter(storeWebsite => storeWebsite.id);
    const activeStoreGroups = storeGroups.filter(storeGroup => storeGroup.id);

    const activeStoreConfigs = storeConfigs.map(storeConfig => ({
      ..._.pick(storeConfig, [
        'id',
        'code',
        'website_id',
        'base_currency_code',
        'default_display_currency_code',
        'timezone',
        'weight_unit'
      ]),
      locale: storeConfig.locale.replace('_', '-'),
      ..._.pick(_.find(activeStoreViews, { id: storeConfig.id }), ['store_group_id', 'name'])
    }));
    this.storeConfigMap = _.keyBy(activeStoreConfigs, 'code');
    this.magentoConfig.locales = _.uniq(activeStoreConfigs.map(x => x.locale));

    activeStoreWebsites.forEach(storeWebsite => {
      const groups = [];
      let defaultGroup = null;
      let defaultStore = null;

      activeStoreGroups.forEach(storeGroup => {
        if (storeGroup.website_id === storeWebsite.id) {
          storeGroup.stores = [];
          activeStoreConfigs.forEach(storeConfig => {
            if (storeConfig.store_group_id === storeGroup.id) {
              storeGroup.stores.push(storeConfig);

              if (storeConfig.id === storeGroup.default_store_id) {
                defaultStore = storeConfig;
              }
            }
          });

          groups.push(storeGroup);
          if (storeGroup.id === storeWebsite.default_group_id) {
            defaultGroup = storeGroup;
          }
        }
      });

      this.storeList.push({
        ...storeWebsite,
        groups,
        defaultGroup,
        defaultStore
      });
    });

    await this.ensureStoreCode();

    return this.magentoConfig;
  }

  async setShopStore(obj, { storeCode }) {
    const storeConfig = this.findStoreConfig(storeCode);
    if (storeConfig) {
      this.session.storeCode = storeCode;
      this.session.currency = storeConfig.default_display_currency_code;
      this.session.baseCurrency = storeConfig.base_currency_code;
      this.session.timezone = storeConfig.timezone;
      this.session.weightUnit = storeConfig.weight_unit;
      this.context.session.locale = storeConfig.locale;
    }

    return this.magentoConfig;
  }

  async setShopCurrency(obj, { currency }) {
    const currentStoreConfig = this.getActiveStoreConfig();
    _.forEach(this.storeConfigMap, storeConfig => {
      if (currentStoreConfig.store_group_id === storeConfig.store_group_id) {
        if (storeConfig.default_display_currency_code === currency) {
          this.setShopStore({}, { storeCode: storeConfig.code });
        }
      }
    });
    return this.magentoConfig;
  }

  getActiveStoreConfig() {
    return this.findStoreConfig(this.session.storeCode);
  }

  findStoreConfig(code) {
    return this.storeConfigMap[code];
  }

  initialize(config) {
    super.initialize(config);

    this.integrationScopeAuth = this.setupIntegrationScopeAuth(this.config.auth);
    this.customerScopeAuth = this.setupCustomerScopeAuth(this.session);

    if (this.isCustomerSessionExpired(this.session)) {
      this.session = {};
      this.context.session.save();
    }
  }

  /**
   * Setting up authorization handler for Integration requests
   * @param {object} authConfig configuration
   * @returns {IAuthorizeRequest} authorization handler
   */
  setupIntegrationScopeAuth(authConfig) {
    const { type, ...restAuthConfig } = authConfig || { type: undefined };

    if (type === IntegrationAuthType.adminToken) {
      return new BearerAuth(async () => this.getAdminToken());
    }

    if (type === IntegrationAuthType.integrationToken) {
      const oAuth1Auth = new OAuth1Auth(
        {
          requestTokenUrl: this.baseURL.concat('/oauth/token/request'),
          accessTokenUrl: this.baseURL.concat('/oauth/token/access'),
          ...restAuthConfig
        },
        { resolveURL: x => this.resolveURL(x) }
      );
      oAuth1Auth.initialize();

      return oAuth1Auth;
    }

    throw new Error(`Unsupported integration authorization type ('auth.type': '${type}')!`);
  }

  /**
   * Setting up authorization handler for Customer requests
   * @param {object} session session
   * @param {CustomerToken} session.customerToken customer token
   * @returns {IAuthorizeRequest} authorization handler
   */
  setupCustomerScopeAuth(session) {
    return new BearerAuth(() => {
      const { customerToken } = session;

      if (this.isCustomerTokenValid(customerToken)) {
        return customerToken.token;
      }

      if (!customerToken) {
        const unauthorizedError = new AuthenticationError(`Customer unauthorized.`);
        unauthorizedError.statusCode = 401;

        throw unauthorizedError;
      }

      const sessionExpiredError = new AuthenticationError(`Customer token has expired.`, codes.CUSTOMER_TOKEN_EXPIRED);
      sessionExpiredError.statusCode = 401;

      throw sessionExpiredError;
    });
  }

  /**
   * Determines if Customer's session is expired (Customer needs to be signed out)
   * @param {object} session the session
   * @param {CustomerToken} session.customerToken the Customer token
   * @returns {boolean} `true` if the session is expired, `false` otherwise
   */
  isCustomerSessionExpired(session) {
    const { customerToken } = session;
    return customerToken && !this.isCustomerTokenValid(customerToken);
  }

  /**
   * Helper method to recursively change key naming from underscore (snake case) to camelCase
   * @param {object} data argument to process
   * @returns {object} converted object
   */
  convertKeys(data) {
    // handle simple types
    if (!_.isPlainObject(data) && !Array.isArray(data)) {
      return data;
    }

    if (_.isPlainObject(data) && !_.isEmpty(data)) {
      const keysToConvert = _.keys(data);
      keysToConvert.forEach(key => {
        data[_.camelCase(key)] = this.convertKeys(data[key]);

        // remove snake_case key
        if (_.camelCase(key) !== key) {
          delete data[key];
        }
      });
    }

    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        data[index] = this.convertKeys(item);
      });
    }

    return data;
  }

  /**
   * Resolves url based on passed parameters
   * @param {RequestOptions} req request params
   * @returns {Promise<URL>} resolved url object
   */
  async resolveURL(req) {
    return super.resolveURL({ ...req, path: this.getPathWithPrefix(req.path) });
  }

  getPathWithPrefix(path) {
    const { storeCode = this.storeCode } = this.session;
    return `/rest/${storeCode}/V1${path}`;
  }

  /**
   * Hook that is going to be executed for every REST request before calling `resolveURL` method
   * @param {ContextRequestOptions} request request
   * @returns {Promise<void>} promise
   */
  async willSendRequest(request) {
    request.headers.set('Cookie', this.cookie);

    return super.willSendRequest(request);
  }

  /**
   * Hook that is going to be executed for every REST request if authorization is required
   * @param {ContextRequestOptions} request request
   * @returns {Promise<void>} promise
   */
  async authorizeRequest(request) {
    const { auth: authScope } = request.context;

    if (!authScope) {
      throw new Error(`Cannot authorize request because authorization scope is no defined!`);
    }

    const authHandlerName = `${authScope}ScopeAuth`;
    if (this[authHandlerName]) {
      return this[authHandlerName].authorize(request);
    }

    throw new Error(`Attempted to authenticate the request using an unsupported scope: "${authScope}"!`);
  }

  /**
   * Determines if Customer is Logged In via checking if its token exists
   * @returns {boolean} - true if token exists
   */
  isCustomerLoggedIn() {
    const { customerToken } = this.session;

    return customerToken && customerToken.token;
  }

  /**
   * Check if Customer authentication token is valid
   * @param {object} authToken authentication token
   * @param {string} authToken.token value
   * @param {Date} authToken.expirationTime expiration time
   * @returns {boolean} true if token is valid
   */
  isCustomerTokenValid(authToken) {
    if (!authToken || !authToken.token || !authToken.expirationTime) {
      return false;
    }

    return authToken.expirationTime > Date.now();
  }

  /**
   * Retrieves admin token
   * @param {{Object}} credentials admin credentials
   * @param {{string}} credentials.username username
   * @param {{string}} credentials.password password
   * @returns {{ value: string, options: { ttl: number } }} Result
   */
  async fetchAdminToken({ username, password }) {
    this.logger.info(`Retrieving admin token.`);

    const dataNow = Date.now();
    const token = await this.post('/integration/admin/token', { username, password });
    if (token === undefined) {
      const noTokenError = new FalconError(
        'Magento Admin token not found. Did you install the latest version of the falcon-magento2-module on magento?',
        codes.CUSTOMER_TOKEN_NOT_FOUND
      );
      noTokenError.statusCode = 501;
      throw noTokenError;
    }

    this.logger.info(`Admin token found.`);

    // FIXME: bellow code does not make sense anymore !!!
    // according to https://github.com/deity-io/falcon-magento2-development/issues/32
    // admin_token_ttl is returned via `/store/storeConfigs`, so if we want to cache adminToken
    // we need to do it right after fetching `storeConfig`. Be aware that adminToken is required to fetch storeConfig :)
    const validTime = 1;
    const ttl = (validTime * 60 - 5) * 60;
    this.logger.debug(`Admin token valid for ${validTime} hours, till ${addSeconds(dataNow, ttl)}`);

    return {
      value: token,
      options: { ttl }
    };
  }

  /**
   * Get Magento API authorized admin token or perform request to create it.
   * "reqToken" property is being used for parallel calls
   * @returns {Promise<string>} token value
   */
  async getAdminToken() {
    /* eslint-disable */
    if (!this.__adminToken) {
      this.__adminToken = this.cache.get([this.name, 'admin_token'].join(':'), {
        fetchData: async () => this.fetchAdminToken(this.config.auth)
      });
    }
    return this.__adminToken;
    /* eslint-enable */
  }

  /**
   * Process received response data
   * @param {Response} response received response from the api
   * @param {Request} request request
   * @returns {object} processed response data
   */
  async didReceiveResponse(response, request) {
    const cookies = (response.headers.get('set-cookie') || '').split('; ');
    const data = await super.didReceiveResponse(response, request);
    const { pagination: paginationInput } = response.context;

    if (cookies.length) {
      // For "customer/token" API call - we don't get PHPSESSID cookie
      cookies.forEach(cookieString => {
        if (cookieString.match(/PHPSESSID=(\w+\d+)/)) {
          this.cookie = cookieString.match(/PHPSESSID=(\w+\d+)/)[0];
        }
      });
    }

    // no pagination data requested - skip computation of pagination
    if (!paginationInput) {
      return data;
    }

    const { page, perPage } = paginationInput;
    const { total_count: total } = data;

    // process search criteria
    const pagination = this.processPagination(total, page, perPage);
    return { items: data.items, filters: data.filters || [], pagination };
  }

  /**
   * Handle error occurred during http response
   * @param {Error} error Error to process
   * @param {object} req Request object
   */
  didEncounterError(error, req) {
    const { extensions = {} } = error;
    const { response } = extensions;

    // Re-formatting error message using provided response data from Magento
    if (response) {
      const { body = {} } = response;
      const { message, parameters } = body;

      if (Array.isArray(parameters)) {
        error.message = util.format(message.replace(/(%\d)/g, '%s'), ...parameters);
      } else if (typeof parameters === 'object') {
        error.message = util.format(message.replace(/(%\w+\b)/g, '%s'), ...Object.values(parameters));
      } else {
        error.message = message;
      }
    }

    super.didEncounterError(error, req);
  }

  /**
   * Ensuring that user gets storeCode in the session with the first hit.
   */
  async ensureStoreCode() {
    const { storeCode } = this.session;

    // Checking if current storeCode is valid
    if (this.getActiveStoreConfig()) {
      return;
    }

    // Fixing invalid storeCode
    this.logger.debug(`${storeCode ? 'is invalid' : 'store code is missing'}, removing cart data`);
    delete this.session.storeCode;
    delete this.session.cart;
    await this.setShopStore({}, { storeCode: this.storeCode });
  }
}
