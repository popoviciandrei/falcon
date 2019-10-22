require('source-map-support').install();

const { readFileSync } = require('fs');
const { resolve: resolvePath } = require('path');
const { codes } = require('@deity/falcon-errors');
const { Events, Cache, InMemoryLRUCache } = require('@deity/falcon-server-env');
const Logger = require('@deity/falcon-logger');
const { ApolloServer } = require('apollo-server-koa');
const { EventEmitter2 } = require('eventemitter2');
const GraphQLJSON = require('graphql-type-json');
const cors = require('@koa/cors');
const Cookies = require('cookies');
const Koa = require('koa');
const compress = require('koa-compress');
const Router = require('koa-router');
const session = require('koa-session');
const SessionContext = require('koa-session/lib/context');
const body = require('koa-body');
const get = require('lodash/get');
const capitalize = require('lodash/capitalize');
const ApiContainer = require('./containers/ApiContainer');
const ComponentContainer = require('./containers/ComponentContainer');
const ExtensionContainer = require('./containers/ExtensionContainer');
const EndpointContainer = require('./containers/EndpointContainer');
const DynamicRouteResolver = require('./resolvers/DynamicRouteResolver');
const cacheInvalidatorMiddleware = require('./middlewares/cacheInvalidatorMiddleware');
const schemaDirectives = require('./schemaDirectives');

const BaseSchema = readFileSync(resolvePath(__dirname, './schema.graphql'), 'utf8');
const isProduction = process.env.NODE_ENV === 'production';

class FalconServer {
  constructor(config) {
    this.loggableErrorCodes = [codes.INTERNAL_SERVER_ERROR, codes.GRAPHQL_PARSE_FAILED];
    this.config = config;
    this.server = null;
    this.httpServer = null;
    this.cache = null;
    this.backendConfig = {};
    this.components = {};
    const { maxListeners = 20, verboseEvents = false } = this.config;
    if (config.logLevel) {
      Logger.setLogLevel(config.logLevel);
    }
    if (config.appName) {
      Logger.setApp(config.appName);
    }

    this.logger = Logger;
    this.eventEmitter = new EventEmitter2({
      maxListeners,
      wildcard: true,
      verboseMemoryLeak: false
    });

    this.eventEmitter.on(Events.ERROR, async error => {
      this.logger.error(error);
    });

    if (verboseEvents) {
      this.eventEmitter.onAny(event => {
        this.logger.debug(`Triggering "${event}" event...`);
      });
    }
  }

  async initialize() {
    await this.eventEmitter.emitAsync(Events.BEFORE_INITIALIZED, this);
    this.cache = new Cache(this.getCacheProvider());
    await this.initializeComponents();
    await this.initializeServerApp();
    await this.initializeContainers();
    await this.initializeApolloServer();
    await this.registerEndpoints();
    await this.eventEmitter.emitAsync(Events.AFTER_INITIALIZED, this);
  }

  async getApolloServerConfig() {
    this.apolloServerConfig = await this.extensionContainer.createGraphQLConfig(this.getInitialGraphQLConfig());

    /* eslint-disable no-underscore-dangle */
    // Removing "placeholder" (_) fields from the Type definitions
    delete this.apolloServerConfig.schema._subscriptionType._fields._;

    // If there were no other fields defined for Type by any other extension
    // - we need to remove it completely in order to comply with GraphQL specification
    if (!Object.keys(this.apolloServerConfig.schema._subscriptionType._fields).length) {
      this.apolloServerConfig.schema._subscriptionType = undefined;
      delete this.apolloServerConfig.schema._typeMap.Subscription;
    }
    /* eslint-enable no-underscore-dangle */

    return this.apolloServerConfig;
  }

  getInitialGraphQLConfig() {
    return {
      schemas: [BaseSchema],
      dataSources: () => {
        this.logger.debug('Instantiating GraphQL DataSources');
        const dataSources = {};
        this.apiContainer.dataSources.forEach((value, key) => {
          dataSources[key] = value(this.apolloServerConfig);
        });
        return dataSources;
      },
      schemaDirectives: this.getDefaultSchemaDirectives(),
      formatError: error => this.formatGraphqlError(error),
      // inject session and headers into GraphQL context
      context: ({ ctx, connection }) => {
        const context = {
          cache: this.cache,
          config: this.config,
          components: this.componentContainer.components
        };

        // Subscription request
        if (connection) {
          return {
            ...context,
            ...connection.context
          };
        }

        // Query/Mutation request
        return {
          ...context,
          headers: ctx.req.headers,
          session: ctx.req.session
        };
      },
      cache: this.cache,
      resolvers: {
        Query: {
          url: async (...params) => this.dynamicRouteResolver.fetchUrl(...params),
          backendConfig: async (...params) => this.fetchBackendConfig(...params)
        },
        Mutation: {
          setLocale: (...params) => this.setLocale(...params)
        },
        BackendConfig: {
          activeLocale: (_, __, { session: _session }) => _session.locale
        },
        JSON: GraphQLJSON
      },
      subscriptions: this.getSubscriptionsOptions(),
      tracing: this.config.debug,
      playground: this.config.debug && {
        settings: {
          'request.credentials': 'include' // include to keep the session between requests
        }
      }
    };
  }

  getDefaultSchemaDirectives() {
    return schemaDirectives;
  }

  /**
   * @private
   */
  async initializeServerApp() {
    await this.eventEmitter.emitAsync(Events.BEFORE_WEB_SERVER_CREATED, this.config);
    this.app = new Koa();
    // Set signed cookie keys (https://koajs.com/#app-keys-)
    this.app.keys = this.config.session.keys;

    this.router = new Router();

    this.app.context.components = this.componentContainer.components;
    this.app.use(body());
    this.app.use(compress());
    this.app.use(
      cors({
        credentials: true
      })
    );
    // todo: implement backend session store e.g. https://www.npmjs.com/package/koa-redis-session
    this.app.use(session((this.config.session && this.config.session.options) || {}, this.app));

    this.app.use((ctx, next) => {
      // copy session to native Node's req object because GraphQL execution context doesn't have access to Koa's
      // context, see https://github.com/apollographql/apollo-server/issues/1551
      ctx.req.session = ctx.session;
      return next();
    });
    this.app.use(async (ctx, next) => {
      await this.eventEmitter.emitAsync(Events.BEFORE_WEB_SERVER_REQUEST, ctx);
      await next();
      await this.eventEmitter.emitAsync(Events.AFTER_WEB_SERVER_REQUEST, ctx);
    });

    await this.eventEmitter.emitAsync(Events.AFTER_WEB_SERVER_CREATED, this.app);
  }

  /**
   * @private
   */
  async initializeContainers() {
    await this.eventEmitter.emitAsync(Events.BEFORE_API_CONTAINER_CREATED, this.config.apis);
    /** @type {ApiContainer} */
    this.apiContainer = new ApiContainer(this.eventEmitter);
    await this.apiContainer.registerApis(this.config.apis);
    await this.eventEmitter.emitAsync(Events.AFTER_API_CONTAINER_CREATED, this.apiContainer);

    await this.eventEmitter.emitAsync(Events.BEFORE_EXTENSION_CONTAINER_CREATED, this.config.extensions);
    /** @type {ExtensionContainer} */
    this.extensionContainer = new ExtensionContainer(this.eventEmitter);
    await this.extensionContainer.registerExtensions(this.config.extensions, this.apiContainer.dataSources);
    await this.eventEmitter.emitAsync(Events.AFTER_EXTENSION_CONTAINER_CREATED, this.extensionContainer);

    this.endpointContainer = new EndpointContainer(this.eventEmitter);
    await this.endpointContainer.registerEndpoints(this.config.endpoints);

    this.dynamicRouteResolver = new DynamicRouteResolver(this.extensionContainer);
  }

  async initializeComponents() {
    await this.eventEmitter.emitAsync(Events.BEFORE_COMPONENT_CONTAINER_CREATED, this.config.components);
    /** @type {ComponentContainer} */
    this.componentContainer = new ComponentContainer(this.eventEmitter);
    await this.componentContainer.registerComponents(this.config.components);
    await this.eventEmitter.emitAsync(Events.AFTER_COMPONENT_CONTAINER_CREATED, this.componentContainer);
  }

  /**
   * @private
   */
  async initializeApolloServer() {
    const apolloServerConfig = await this.getApolloServerConfig();

    await this.eventEmitter.emitAsync(Events.BEFORE_APOLLO_SERVER_CREATED, apolloServerConfig);
    this.server = new ApolloServer(apolloServerConfig);
    await this.eventEmitter.emitAsync(Events.AFTER_APOLLO_SERVER_CREATED, this.server);

    this.server.applyMiddleware({ app: this.app });
  }

  /**
   * Create instance of cache backend based on configuration ("cache" key from config)
   * @private
   * @returns {KeyValueCache} instance of cache backend
   */
  getCacheProvider() {
    const { type, options = {} } = this.config.cache || {};
    const packageName = type ? `apollo-server-cache-${type}` : null;
    try {
      // eslint-disable-next-line import/no-dynamic-require
      const CacheBackend = packageName ? require(packageName)[`${capitalize(type)}Cache`] : InMemoryLRUCache;
      return new CacheBackend(options);
    } catch (ex) {
      this.logger.error(
        `Cannot initialize cache backend using "${packageName}" package, GraphQL server will operate without cache`
      );
      this.logger.error(ex);
    }
  }

  /**
   * Registers API Provider endpoints
   * @private
   */
  async registerEndpoints() {
    const endpoints = [];
    const { url: cacheUrl } = this.config.cache || {};
    await this.eventEmitter.emitAsync(Events.BEFORE_ENDPOINTS_REGISTERED, this.endpointContainer.entries);
    this.endpointContainer.entries.forEach(({ methods, path: routerPath, handler }) => {
      (Array.isArray(methods) ? methods : [methods]).forEach(method => {
        this.logger.debug(`Registering endpoint ${method.toUpperCase()}: "${routerPath}"`);
        this.router[method.toLowerCase()](routerPath, handler);
        if (endpoints.indexOf(routerPath) < 0) {
          endpoints.push(routerPath);
        }
      });
    });
    this.router.get('/config', ctx => {
      ctx.body = { endpoints };
    });

    // Adding a custom route to handle Cache webhooks
    if (typeof cacheUrl === 'string') {
      if (cacheUrl === '/cache' && isProduction) {
        this.logger.warn(
          'Consider changing "cache.url" config value with a unique route to secure your Cache endpoint'
        );
      }
      this.router.post(cacheUrl, cacheInvalidatorMiddleware(this.cache));
    }

    this.app.use(this.router.routes()).use(this.router.allowedMethods());
    await this.eventEmitter.emitAsync(Events.AFTER_ENDPOINTS_REGISTERED, this.router);
  }

  async setLocale(_, args, context, info) {
    context.session.locale = args.locale;
    return this.fetchBackendConfig(_, args, context, info);
  }

  async fetchBackendConfig(_, args, context, info) {
    return this.extensionContainer.fetchBackendConfig(_, args, context, info);
  }

  formatGraphqlError(error) {
    let { code = codes.INTERNAL_SERVER_ERROR } = error.extensions || {};

    if (get(error, 'extensions.response.status') === 404) {
      code = codes.NOT_FOUND;
    }

    if (this.loggableErrorCodes.includes(code)) {
      setImmediate(async () => {
        await this.eventEmitter.emitAsync(Events.ERROR, error);
      });
    }

    return {
      ...error,
      extensions: {
        code
      }
    };
  }

  isSubscriptionsServerRequired() {
    return 'Subscription' in this.apolloServerConfig.schema.getTypeMap();
  }

  start() {
    const handleStartupError = err => {
      this.eventEmitter.emitAsync(Events.ERROR, err).then(() => {
        this.logger.error('Initialization error - cannot start the server');
        process.exit(1);
      });
    };

    this.logger.info('Starting Falcon Server');

    this.initialize()
      .then(() => this.eventEmitter.emitAsync(Events.BEFORE_STARTED, this))
      .then(
        () =>
          new Promise(resolve => {
            this.httpServer = this.app.listen({ port: this.config.port }, () => {
              this.logger.info(`🚀 Server ready at http://localhost:${this.config.port}`);
              this.logger.info(
                `🌍 GraphQL endpoint ready at http://localhost:${this.config.port}${this.server.graphqlPath}`
              );
              this.startSubscriptionsServer();
              resolve();
            });
          }, handleStartupError)
      )
      .then(() => this.eventEmitter.emitAsync(Events.AFTER_STARTED, this))
      .catch(handleStartupError);
  }

  /**
   * Starts (if needed) the subscriptions server (based on the stitched GraphQL Schema - Subscription type has resolvers)
   */
  startSubscriptionsServer() {
    if (this.isSubscriptionsServerRequired()) {
      this.server.installSubscriptionHandlers(this.httpServer);
      this.logger.info(
        `🔌 GraphQL Subscriptions endpoint ready at ws://localhost:${this.config.port}${this.server.subscriptionsPath}`
      );
    }
  }

  /**
   * Get default Subscriptions Options with even handlers to properly initialize required context values
   */
  getSubscriptionsOptions() {
    return {
      onConnect: (connectionParams, websocket, context) => {
        const { cookie: paramsCookie } = connectionParams;
        let { request } = context;

        if (paramsCookie) {
          // Faking `cookie` data passed from `connectionParams` to the request "headers" object
          request = {
            headers: {
              cookie: paramsCookie,
              ...context.request.headers
            }
          };
        }

        // Checking signed cookies (without a `res` argument, since for Subscriptions there're no traditional "responses")
        try {
          const cookies = new Cookies(
            request,
            {},
            {
              keys: this.config.session.keys
            }
          );
          // Manually decrypting session cookie
          const sessionContext = new SessionContext(
            {
              sessionOptions: {},
              cookies
            },
            this.config.session.options
          );

          return {
            headers: context.request.headers,
            session: sessionContext.get()
          };
        } catch (e) {
          throw new Error('Failed to parse Cookie');
        }
      }
    };
  }
}

module.exports = FalconServer;
module.exports.Events = Events;
module.exports.BaseSchema = BaseSchema;
