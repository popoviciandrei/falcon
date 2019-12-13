import { ExtensionInstance } from '@deity/falcon-server-env';
import Logger from '@deity/falcon-logger';
import { EventEmitter2 } from 'eventemitter2';
import { DefaultContext, DefaultState, Middleware } from 'koa';
import { ApiDataSourceMap, ComponentMap } from './containers';

export { DefaultState as WebServerState };

export interface WebServerContext extends DefaultContext {
  components: ComponentMap;
  dataSources: ApiDataSourceMap;
  eventEmitter: EventEmitter2;
}

export type WebServerMiddleware<TState = DefaultState, TContext = WebServerContext> = Middleware<TState, TContext>;

export type Config = {
  appName?: string;
  debug?: boolean;
  maxListeners?: number;
  verboseEvents?: boolean;
  logLevel?: Parameters<typeof Logger.setLogLevel>[0];
  session: SessionConfig;
  port?: number;
  apis?: ApiEntryMap;
  extensions?: ExtensionEntryMap;
  endpoints?: EndpointEntryMap;
  components?: ComponentEntryMap;
  cache?: CacheConfig;
};

// Cache types

export type CacheConfig = {
  url?: string;
  type?: string;
  options?: object;
  resolvers?: CacheResolversConfig;
};

export type CacheResolversConfig = {
  enabled?: boolean;
  invalidation?: boolean;
} & {
  [key: string]: CacheResolversOptionsConfig;
};

export type CacheResolversOptionsConfig = {
  ttl?: number;
};

// Module types

export type ModuleDefinition<T> = Record<
  string,
  {
    package: string;
    config?: T;
  }
>;

export type ExtensionConfig = {
  [key: string]: any;
  api?: string;
};

export type ExtensionGraphQLConfig = {
  schema?: Array<string>;
} & ExtensionInstance;

export type ExternalResourceLikeConfig = {
  [key: string]: any;
  protocol?: string;
  host?: string;
  port?: number;
};

export type EndpointEntryMap = ModuleDefinition<ExternalResourceLikeConfig>;

export type ApiEntryMap = ModuleDefinition<ExternalResourceLikeConfig>;

export type ComponentEntryMap = ModuleDefinition<any>;

export type ExtensionEntryMap = ModuleDefinition<ExtensionConfig>;

// Session types

export type SessionConfig = {
  keys: string[];
  options?: SessionOptions;
};

export type SessionOptions = {
  key?: string;
  maxAge?: number;
  overwrite?: boolean;
  httpOnly?: boolean;
  signed?: boolean;
  rolling?: boolean;
  renew?: boolean;
};

// Data types

export type BackendConfig = {
  locales: string[];
};
