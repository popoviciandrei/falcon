const { SchemaDirectiveVisitor } = require('graphql-tools');
const { defaultFieldResolver } = require('graphql');
const { getRootType, getOperationPath, extractTagsForIdPath, getTagsForField } = require('../graphqlUtils');
const { createShortHash } = require('../utils');

// Default cache TTL (10 minutes)
const DEFAULT_TTL = 10;

/**
 * @typedef {import('graphql').GraphQLType} GraphQLType
 * @typedef {import('graphql').GraphQLField} GraphQLField
 * @typedef {import('graphql').GraphQLResolveInfo} GraphQLResolveInfo
 */

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
module.exports = class GraphQLCacheDirective extends SchemaDirectiveVisitor {
  /**
   * @param {GraphQLType|GraphQLField} field GQL Field
   * @returns {void}
   */
  visitFieldDefinition(field) {
    const { ttl = DEFAULT_TTL } = this.args;
    let { resolve = defaultFieldResolver } = field;
    const defaultValue = {
      ttl
    };

    // Some APIDataSources may provide extra type-resolvers during the runtime via "addResolveFunctionsToSchema"
    // which will override "wrapped" resolve functions during Falcon-Server startup. By providing getter/setter
    // methods - we can ensure such such calls will be handled properly.
    Object.defineProperty(field, 'resolve', {
      get: () => this.getResolverWithCache(resolve, field, defaultValue),
      // Handling potential "addResolveFunctionsToSchema" calls that define dynamic resolvers
      set: newResolve => {
        resolve = newResolve;
      },
      configurable: true
    });
  }

  /**
   * Get a resolver function with caching capabilities (depends on the provided config)
   * @param {Function} resolve Native GQL resolver function
   * @param {GraphQLField} field Field info object
   * @param {Object} defaultCacheConfig Default cache config
   * @returns {Function} Resolver function with caching
   */
  getResolverWithCache(resolve, field, defaultCacheConfig) {
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
   * @param {Object} result Resolver result
   * @param {Object} parent GraphQL parent object
   * @param {GraphQLResolveInfo} info GraphQL Info object
   * @returns {Object} Final resolver result
   */
  handleCacheCallbackResponse(result, parent, info) {
    const resolverResult = result && result.value ? result.value : result;
    const { idPath = [] } = this.args;
    const { name: returnTypeName } = getRootType(info.returnType);
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
   * @param {Object} resolversCacheConfig Cache object provided via `context.config`
   * @param {Object} defaultDirectiveValue Default options defined in cache directive for the specific type
   * @returns {Object} Final cache options object
   */
  getCacheConfigForField(info, resolversCacheConfig, defaultDirectiveValue) {
    const { path: gqlPath, operation } = info;
    const fullPath = `${operation.operation}.${getOperationPath(gqlPath)}`;
    const { [fullPath]: operationConfig = {}, default: defaultConfig = {} } = resolversCacheConfig;

    return Object.assign({}, defaultConfig, defaultDirectiveValue, operationConfig);
  }
};
