import { SchemaDirectiveVisitor } from 'graphql-tools';
import {
  GetCacheFetchResult,
  getRootType,
  getOperationPath,
  extractTagsForIdPath,
  getTagsForField
} from '@deity/falcon-server-env';
import { defaultFieldResolver, GraphQLNamedType, GraphQLField, GraphQLResolveInfo } from 'graphql';
import { createShortHash } from '../utils';
import { CacheResolversConfig } from '../types';

// Default cache TTL (10 minutes)
const DEFAULT_TTL = 10;

export type FieldType = GraphQLField<any, any>;
export type FieldTypeResolver = FieldType['resolve'];

export type GraphQLCacheDirectiveParams = {
  ttl?: number;
};

/**
 * `@cache` directive
 * Caches the result of your resolver
 * ```
 * type Query {
 *   data: DataResult @cache
 *   foo: Bar @cache(ttl: 20)
 * }
 * ```
 */
export class GraphQLCacheDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: FieldType): void {
    const { ttl = DEFAULT_TTL } = this.args;
    const { resolve = defaultFieldResolver } = field;
    const defaultCacheConfig = {
      ttl
    };

    field.resolve = this.getResolverWithCache(resolve, field, defaultCacheConfig);
  }

  /**
   * Get a resolver function with caching capabilities (depends on the provided config)
   * @param {FieldTypeResolver} resolve Native GQL resolver function
   * @param {FieldType} field Field info object
   * @param {GraphQLCacheDirectiveParams} defaultCacheConfig Default cache config
   * @returns {FieldTypeResolver} Resolver function with caching
   */
  getResolverWithCache(
    resolve: FieldTypeResolver,
    field: FieldType,
    defaultCacheConfig: GraphQLCacheDirectiveParams
  ): FieldTypeResolver {
    const thisDirective = this;
    return async function fieldResolver(parent, params, context, info) {
      const resolver = async () => resolve.call(this, parent, params, context, info);
      const { config: { cache: { resolvers: resolversCacheConfig = {} } = {} } = {} } = context;

      if (resolversCacheConfig.enabled !== true) {
        // Schema caching is disabled globally
        return resolver();
      }
      const { ttl } = thisDirective.getCacheConfigForField(info, resolversCacheConfig, defaultCacheConfig);

      if (!ttl) {
        // TTL is falsy - skip cache checks
        return resolver();
      }

      const cacheContext = {};
      Object.keys(context.dataSources || {}).forEach(dsName => {
        const ds = context.dataSources[dsName];
        if (ds.getCacheContext) {
          cacheContext[dsName] = ds.getCacheContext();
        }
      });

      const { name: fieldName } = field;
      // Generating short and unique cache-key
      const cacheKey = createShortHash([fieldName, JSON.stringify([parent, params, cacheContext])]);

      return context.cache.get(cacheKey, {
        options: {
          ttl: ttl * 60 // minutes to seconds
        },
        fetchData: async () => {
          const result = await resolver();
          return thisDirective.handleCacheCallbackResponse(result, parent, info);
        }
      });
    };
  }

  /**
   * Execute the actual GraphQL resolver and generate cache tags
   * @param {GetCacheFetchResult} result Resolver result
   * @param {object} parent GraphQL parent object
   * @param {GraphQLResolveInfo} info GraphQL Info object
   * @returns {GetCacheFetchResult} Final resolver result
   */
  handleCacheCallbackResponse(
    result: GetCacheFetchResult,
    parent: object,
    info: GraphQLResolveInfo
  ): GetCacheFetchResult {
    const resolverResult = result && result.value ? result.value : result;
    const { idPath = [] } = this.args;
    const { name: returnTypeName } = getRootType(info.returnType) as GraphQLNamedType;
    const tags = [returnTypeName];

    // Checking if Type is "self-cacheable"
    tags.push(...getTagsForField(resolverResult, info.returnType));

    idPath.forEach(idPathEntry => {
      tags.push(...extractTagsForIdPath(idPathEntry, resolverResult, info, parent));
    });

    return {
      value: resolverResult,
      options: {
        ...((result && result.options) || {}),
        tags
      }
    };
  }

  /**
   * Returns cache options object based on the provided data in this order/priority:
   * - default cache config
   * - default cache config provided from `context.config`
   * - cache config provided in `@cache(...)` directive
   * - cache config for a specific operation via `context.config`
   * @param {GraphQLResolveInfo} info GraphQL Request info object
   * @param {CacheResolversConfig} resolversCacheConfig Cache object provided via `context.config`
   * @param {GraphQLCacheDirectiveParams} defaultDirectiveValue Default options defined in cache directive for the specific type
   * @returns {GraphQLCacheDirectiveParams} Final cache options object
   */
  getCacheConfigForField(
    info: GraphQLResolveInfo,
    resolversCacheConfig: CacheResolversConfig,
    defaultDirectiveValue: GraphQLCacheDirectiveParams
  ): GraphQLCacheDirectiveParams {
    const { path: gqlPath, operation } = info;
    const fullPath = `${operation.operation}.${getOperationPath(gqlPath)}`;
    const { [fullPath]: operationConfig = {}, default: defaultConfig = {} } = resolversCacheConfig;

    return Object.assign({}, defaultConfig, defaultDirectiveValue, operationConfig);
  }
}
