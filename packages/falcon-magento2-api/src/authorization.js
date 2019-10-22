const deepMerge = require('deepmerge');
const OAuth = require('oauth');

/**
 * Request authorization scope
 */
const AuthScope = {
  /** Authorize request using Integration credentials (integration-token or admin-token) */
  Integration: 'integration',

  /** Authorize request using Customer credentials (the customer's username and password) */
  Customer: 'customer'
};

/**
 * Integration request authorization type
 */
const IntegrationAuthType = {
  /** Integration Token (oAuth) */
  integrationToken: 'integration-token',

  /** Admin Token (the admin's username and password) */
  adminToken: 'admin-token'
};

/** Sets authorization info onto the request
 * @param {{ context: any }} requestOptions request options
 * @param {string|boolean} param desired authorization scope or if true then `customer` scope otherwise `integration`
 * @returns {string} authorization scope
 */
function setAuthScope(requestOptions, param) {
  const authContext =
    typeof param === 'string'
      ? { isAuthRequired: true, auth: param }
      : { isAuthRequired: true, auth: param ? AuthScope.Customer : AuthScope.Integration };

  return deepMerge(requestOptions, { context: authContext });
}

/**
 * oAuth 1 based request authorization
 */
class OAuth1Auth {
  /**
   * @param {Object} config configuration
   * @param {string} config.consumerKey consumer key
   * @param {string} config.consumerSecret consumer secret
   * @param {string} config.accessToken access token
   * @param {string} config.accessTokenSecret access token secret
   * @param {string} config.requestTokenUrl request token URL
   * @param {string} config.accessTokenUrl access token URL
   * @param {Object} options options
   * @param {Function} options.resolveURL Apollo `RESTDataSource.resolverURL`
   */
  constructor(config, options) {
    this.config = config;
    this.options = options || {};
  }

  initialize() {
    this.oAuthClient = new OAuth.OAuth(
      this.config.requestTokenUrl,
      this.config.accessTokenUrl,
      this.config.consumerKey,
      this.config.consumerSecret,
      '1',
      null,
      'HMAC-SHA1'
    );

    // TODO: make full handshake
  }

  async authorize(request) {
    const url = this.options.resolveURL ? await this.options.resolveURL(request) : request.path;
    request.params.forEach((value, key) => url.searchParams.append(key, value));

    const authorizationHeader = this.oAuthClient.authHeader(
      url.toString(),
      this.config.accessToken,
      this.config.accessTokenSecret,
      request.method
    );
    request.headers.append('Authorization', authorizationHeader);

    return request;
  }
}

module.exports = {
  AuthScope,
  IntegrationAuthType,
  setAuthScope,
  OAuth1Auth
};
