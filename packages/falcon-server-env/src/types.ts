import { Response, Request, RequestInit } from 'apollo-server-env';
import { CacheOptions, RequestOptions } from 'apollo-datasource-rest/dist/RESTDataSource';
import { Middleware } from 'koa';
import { Config as ApolloServerConfig } from 'apollo-server-koa';
import { GraphQLResolveInfo } from 'graphql';
import { IResolvers } from 'graphql-tools';
import { EventEmitter2 } from 'eventemitter2';
import { ApiDataSource } from './models/ApiDataSource';
import { Cache } from './cache/Cache';

export { ApolloServerConfig };

export interface DataSourceConfig<TContext> {
  context: TContext;
  cache: Cache;
}

export interface FetchUrlResult {
  id: string | number;
  type: string;
  path: string;
  redirect: boolean;
}

export enum ApiUrlPriority {
  HIGHEST = 1,
  HIGH = 2,
  NORMAL = 3,
  LOW = 4,
  LOWEST = 5,
  OFF = 0
}

export type DataSources = Record<string, ApiDataSource<GraphQLContext>>;

export interface IConfigurableConstructorParams<T = object> {
  /** short-name */
  name?: string;
  /** configuration */
  config?: T;
  /** EventEmitter2 instance */
  eventEmitter: EventEmitter2;
}

export type ContextType = {
  isAuthRequired?: boolean;
  didReceiveResult?: (result: any, res: ContextFetchResponse) => any;
  [propName: string]: any;
};

export interface PaginationData {
  totalPages: number | null;
  totalItems: number;
  perPage: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface UrlConfig {
  host?: string;
  port?: number;
  protocol?: string;
}

export interface ApiDataSourceConfig extends UrlConfig {
  fetchUrlPriority?: number;
  perPage?: number;
  [propName: string]: any;
}

export type RemoteBackendConfig = {
  [key: string]: any;
  locales?: string[];
};

// todo: this is a temporary type just to have proper type checking in the Extension class. It needs to be improved.
export type ApiContainer = object;

export interface ContextData {
  context?: ContextType;
}

export interface GraphQLContext {
  session?: Record<string, any>;
  headers?: Record<string, string>;
  cache: Cache;
  dataSources: DataSources;
  [propName: string]: any;
}

export type ContextRequestInit = RequestInit & ContextData;

export type ContextCacheOptions = CacheOptions & ContextData;

export type ContextRequestOptions = RequestOptions & ContextData;

export type ContextFetchOptions = {
  cacheKey?: string;
  cacheOptions?:
    | ContextCacheOptions
    | ((response: ContextFetchResponse, request: ContextFetchRequest) => ContextCacheOptions | undefined);
};

export type ContextFetchRequest = Request & ContextData;

export type ContextFetchResponse = Response & ContextData;

export interface ExtensionConfig {
  api?: string;
}

export interface ExtensionInitializer {
  (): ExtensionInstance;
  (config: ExtensionConfig): ExtensionInstance;
}

export interface ExtensionInstance {
  resolvers?: GraphQLResolverMap;
}

export type FetchUrlParams = {
  path: string;
};

export interface EndpointEntry {
  methods: Array<RequestMethod | keyof typeof RequestMethod> | RequestMethod | keyof typeof RequestMethod;
  handler: Middleware;
  path: string;
}

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  LINK = 'LINK',
  UNLINK = 'UNLINK',
  OPTIONS = 'OPTIONS',
  ALL = 'ALL'
}

export interface GraphQLResolver<T, O = any, P = any, C extends GraphQLContext = GraphQLContext> {
  (obj: O, params: P, context: C, info: GraphQLResolveInfo): Promise<T>;
}

export type GraphQLResolverMap = IResolvers<any, GraphQLContext>;
