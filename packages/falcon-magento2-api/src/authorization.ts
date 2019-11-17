import deepMerge from 'deepmerge';
import { OAuth } from 'oauth';
import { ContextRequestInit } from '@deity/falcon-server-env';

/**
 * Request authorization scope
 */
export const AuthScope = {
  /** Authorize request using Integration credentials (integration-token or admin-token) */
  Integration: 'integration',

  /** Authorize request using Customer credentials (the customer's username and password) */
  Customer: 'customer'
};

/**
 * Integration request authorization type
 */
export const IntegrationAuthType = {
  /** Integration Token (oAuth) */
  integrationToken: 'integration-token',

  /** Admin Token (the admin's username and password) */
  adminToken: 'admin-token'
};

/* eslint-disable import/export */
/** Sets default authorization info onto the request
 * @param {ContextRequestInit} requestOptions request options
 * @param {boolean} isCustomerLoggedIn if true then `customer` scope otherwise `integration`
 */
export function setAuthScope(requestOptions: ContextRequestInit, isCustomerLoggedIn: boolean);
/** Sets authorization info onto the request
 * @param {object} requestOptions request options
 * @param {string} scope desired authorization scope
 */
export function setAuthScope(requestOptions: ContextRequestInit, scope: string);
export function setAuthScope(requestOptions: ContextRequestInit, param: string | boolean) {
  const authContext =
    typeof param === 'string'
      ? { isAuthRequired: true, auth: param }
      : { isAuthRequired: true, auth: param ? AuthScope.Customer : AuthScope.Integration };

  return deepMerge(requestOptions, { context: authContext });
}
/* eslint-enable import/export */

/**
 * oAuth 1 based request authorization
 */
export class OAuth1Auth {
  config: any;

  options: any;

  oAuthClient: any;

  /**
   * @param {object} config configuration
   * @param {string} config.consumerKey consumer key
   * @param {string} config.consumerSecret consumer secret
   * @param {string} config.accessToken access token
   * @param {string} config.accessTokenSecret access token secret
   * @param {string} config.requestTokenUrl request token URL
   * @param {string} config.accessTokenUrl access token URL
   * @param {object} options options
   * @param {Function} options.resolveURL Apollo `RESTDataSource.resolverURL`
   */
  constructor(config, options) {
    this.config = config;
    this.options = options || {};
  }

  initialize() {
    this.oAuthClient = new OAuth(
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
