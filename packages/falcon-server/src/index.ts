import 'source-map-support/register';
import { resolve as resolvePath } from 'path';
import { readFileSync } from 'fs';
import { Server as HttpServer, IncomingMessage } from 'http';
import { codes } from '@deity/falcon-errors';
import {
  ApolloServerConfig,
  Events,
  Cache,
  GraphQLResolver,
  InMemoryLRUCache,
  FetchUrlResult,
  FetchUrlParams
} from '@deity/falcon-server-env';
import Logger from '@deity/falcon-logger';
import { ApolloServer } from 'apollo-server-koa';
import { KeyValueCache } from 'apollo-server-caching';
import { ApolloError } from 'apollo-server-errors';
import { EventEmitter2 } from 'eventemitter2';
import { JSONResolver } from 'graphql-scalars';
import Cookies from 'cookies';
import cors from '@koa/cors';
import Koa from 'koa';
import compress from 'koa-compress';
import Router from 'koa-router';
import session from 'koa-session';
import SessionContext from 'koa-session/lib/context';
import body from 'koa-body';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import { ConnectionContext } from 'subscriptions-transport-ws';
import * as WebSocket from 'ws';
import { ApiContainer } from './containers/ApiContainer';
import { ComponentContainer } from './containers/ComponentContainer';
import { ExtensionContainer, GraphQLConfigDefaults } from './containers/ExtensionContainer';
import { EndpointContainer } from './containers/EndpointContainer';
import { DynamicRouteResolver } from './resolvers/DynamicRouteResolver';
import { cacheInvalidatorMiddleware } from './middlewares/cacheInvalidatorMiddleware';
import schemaDirectives from './schemaDirectives';
import { Config, BackendConfig } from './types';

export * from './types';

const BaseSchema: string = readFileSync(resolvePath(__dirname, './../schema.graphql'), 'utf8');
const isProduction: boolean = process.env.NODE_ENV === 'production';

export { BaseSchema, Events };

export class FalconServer {
  public eventEmitter: EventEmitter2;

  protected cache?: Cache;

  protected loggableErrorCodes: string[] = [codes.INTERNAL_SERVER_ERROR, codes.GRAPHQL_PARSE_FAILED];

  protected backendConfig: object = {};

  protected server?: ApolloServer;

  protected app?: Koa;

  protected router?: Router;

  protected extensionContainer?: ExtensionContainer;

  protected apiContainer?: ApiContainer;

  protected componentContainer?: ComponentContainer;

  protected endpointContainer?: EndpointContainer;

  protected logger: typeof Logger = Logger;

  protected httpServer?: HttpServer;

  protected apolloServerConfig?: ApolloServerConfig;

  constructor(protected config: Config) {
    const { maxListeners = 20, verboseEvents = false } = this.config;
    if (config.logLevel) {
      Logger.setLogLevel(config.logLevel);
    }
    if (config.appName) {
      Logger.setApp(config.appName);
    }

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
    this.cache = this.getCache();
    await this.initializeComponents();
    await this.initializeServerApp();
    await this.initializeContainers();
    await this.initializeApolloServer();
    await this.registerEndpoints();
    await this.eventEmitter.emitAsync(Events.AFTER_INITIALIZED, this);
  }

  async getApolloServerConfig() {
    this.apolloServerConfig = this.extensionContainer.createGraphQLConfig(this.getInitialGraphQLConfig());

    // Removing "placeholder" (_) fields from the Type definitions
    delete this.apolloServerConfig.schema.getSubscriptionType().getFields()['_'];

    // If there were no other fields defined for Type by any other extension
    // - we need to remove it completely in order to comply with GraphQL specification
    if (!Object.keys(this.apolloServerConfig.schema.getSubscriptionType().getFields()).length) {
      /* eslint-disable no-underscore-dangle */
      // @ts-ignore there's no other way to remove empty "Subscription" type from the schema
      this.apolloServerConfig.schema._subscriptionType = undefined;
      delete this.apolloServerConfig.schema.getTypeMap()['Subscription'];
      /* eslint-enable no-underscore-dangle */
    }

    return this.apolloServerConfig;
  }

  getInitialGraphQLConfig(): GraphQLConfigDefaults {
    const dynamicRouteResolver = new DynamicRouteResolver();

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
          session: ctx.session
        };
      },
      cache: this.cache,
      rootResolvers: [
        {
          Query: {
            url: this.urlResolver(dynamicRouteResolver),
            backendConfig: this.backendConfigResolver()
          },
          Mutation: {
            setLocale: this.setLocaleMutation()
          },
          BackendConfig: {
            activeLocale: this.activeLocaleResolver()
          },
          JSON: JSONResolver
        }
      ],
      extraResolvers: [...this.apiContainer.resolvers],
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

  protected urlResolver(
    dynamicRouteResolver: DynamicRouteResolver
  ): GraphQLResolver<FetchUrlResult | null, null, FetchUrlParams> {
    return async (...params) => dynamicRouteResolver.fetchUrl(...params);
  }

  protected backendConfigResolver(): GraphQLResolver<BackendConfig, null, null> {
    return async (...params) => this.extensionContainer.fetchBackendConfig(...params);
  }

  protected activeLocaleResolver(): GraphQLResolver<string, null, null> {
    return async (_obj, _params, context) => context.session.locale;
  }

  protected setLocaleMutation(): GraphQLResolver<BackendConfig, null, { locale: string }> {
    return async (obj, params, context, info) => {
      context.session.locale = params.locale;
      return this.backendConfigResolver()(obj, null, context, info);
    };
  }

  private async initializeServerApp() {
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
    this.app.use(async (ctx, next) => {
      await this.eventEmitter.emitAsync(Events.BEFORE_WEB_SERVER_REQUEST, ctx);
      await next();
      await this.eventEmitter.emitAsync(Events.AFTER_WEB_SERVER_REQUEST, ctx);
    });

    await this.eventEmitter.emitAsync(Events.AFTER_WEB_SERVER_CREATED, this.app);
  }

  private async initializeContainers() {
    await this.eventEmitter.emitAsync(Events.BEFORE_API_CONTAINER_CREATED, this.config.apis);
    this.apiContainer = new ApiContainer(this.eventEmitter);
    await this.apiContainer.registerApis(this.config.apis);
    await this.eventEmitter.emitAsync(Events.AFTER_API_CONTAINER_CREATED, this.apiContainer);

    await this.eventEmitter.emitAsync(Events.BEFORE_EXTENSION_CONTAINER_CREATED, this.config.extensions);
    this.extensionContainer = new ExtensionContainer(this.eventEmitter);
    await this.extensionContainer.registerExtensions(this.config.extensions);
    await this.eventEmitter.emitAsync(Events.AFTER_EXTENSION_CONTAINER_CREATED, this.extensionContainer);

    this.endpointContainer = new EndpointContainer(this.eventEmitter);
    await this.endpointContainer.registerEndpoints(this.config.endpoints);
  }

  async initializeComponents() {
    await this.eventEmitter.emitAsync(Events.BEFORE_COMPONENT_CONTAINER_CREATED, this.config.components);
    this.componentContainer = new ComponentContainer(this.eventEmitter);
    await this.componentContainer.registerComponents(this.config.components);
    await this.eventEmitter.emitAsync(Events.AFTER_COMPONENT_CONTAINER_CREATED, this.componentContainer);
  }

  private async initializeApolloServer() {
    const apolloServerConfig = await this.getApolloServerConfig();

    await this.eventEmitter.emitAsync(Events.BEFORE_APOLLO_SERVER_CREATED, apolloServerConfig);
    this.server = new ApolloServer(apolloServerConfig);
    await this.eventEmitter.emitAsync(Events.AFTER_APOLLO_SERVER_CREATED, this.server);

    this.server.applyMiddleware({ app: this.app });
  }

  /**
   * Cache initializer
   * @returns {Cache} Cache instance
   */
  protected getCache(): Cache {
    return new Cache(this.getCacheBackend());
  }

  /**
   * Create instance of cache backend based on configuration ("cache" key from config)
   * @returns {KeyValueCache} Instance of cache backend
   */
  protected getCacheBackend(): KeyValueCache {
    const { type = null, options = {} } = this.config.cache || {};
    const packageName = type ? `apollo-server-cache-${type}` : null;
    try {
      // eslint-disable-next-line import/no-dynamic-require
      const CacheBackend = packageName ? require(packageName)[`${capitalize(type)}Cache`] : InMemoryLRUCache;
      return new CacheBackend(options);
    } catch (error) {
      this.logger.error(`Cannot initialize cache backend using "${packageName}" package.`);
      throw error;
    }
  }

  /**
   * Registers API Provider endpoints
   */
  protected async registerEndpoints(): Promise<void> {
    const endpoints = [];
    const { url: cacheUrl = null } = this.config.cache || {};
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

  formatGraphqlError(error: ApolloError): ApolloError {
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

  isSubscriptionsServerRequired(): boolean {
    return 'Subscription' in this.apolloServerConfig.schema.getTypeMap();
  }

  start(): void {
    const handleStartupError = (err: Error): void => {
      this.eventEmitter.emitAsync(Events.ERROR, err).then(() => {
        this.logger.error('Initialization error - cannot start the server');
        process.exit(1);
      });
    };

    this.logger.info('Starting Falcon Server');

    this.initialize()
      .then(() => this.eventEmitter.emitAsync(Events.BEFORE_STARTED, this))
      .then(() =>
        new Promise(resolve => {
          this.httpServer = this.app.listen({ port: this.config.port }, () => {
            this.logger.info(`🚀 Server ready at http://localhost:${this.config.port}`);
            this.logger.info(
              `🌍 GraphQL endpoint ready at http://localhost:${this.config.port}${this.server.graphqlPath}`
            );
            this.startSubscriptionsServer();
            resolve();
          });
        }).catch(handleStartupError)
      )
      .then(() => this.eventEmitter.emitAsync(Events.AFTER_STARTED, this))
      .catch(handleStartupError);
  }

  /**
   * Starts (if needed) the subscriptions server (based on the stitched GraphQL Schema - Subscription type has resolvers)
   */
  startSubscriptionsServer(): void {
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
      onConnect: (connectionParams: any, _websocket: WebSocket, context: ConnectionContext) => {
        const { cookie: paramsCookie } = connectionParams;
        let { request } = context;

        if (paramsCookie) {
          // Faking `cookie` data passed from `connectionParams` to the request "headers" object
          request = {
            headers: {
              cookie: paramsCookie,
              ...context.request.headers
            }
          } as IncomingMessage;
        }

        // Checking signed cookies (without a `res` argument, since for Subscriptions there're no traditional "responses")
        try {
          const cookies = new Cookies(request, {} as any, {
            keys: this.config.session.keys
          });
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
