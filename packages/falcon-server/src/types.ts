import { ExtensionInstance } from '@deity/falcon-server-env';
import Logger from '@deity/falcon-logger';

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
  api?: string;
};

export type ExtensionGraphQLConfig = {
  schema?: Array<string>;
} & ExtensionInstance;

export type ExternalResourceLikeConfig = {
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
