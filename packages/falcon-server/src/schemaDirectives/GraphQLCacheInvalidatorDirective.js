const { SchemaDirectiveVisitor } = require('graphql-tools');
const { defaultFieldResolver } = require('graphql');
const { extractTagsForIdPath, getTagsForField } = require('../graphqlUtils');

/**
 * @typedef {import('graphql').GraphQLType} GraphQLType
 * @typedef {import('graphql').GraphQLField} GraphQLField
 * @typedef {import('graphql').GraphQLResolveInfo} GraphQLResolveInfo
 *
 * @typedef {object} IdPathEntry
 * @property {string} type Entity type (optional)
 * @property {string} path Path to a list of entries or a single entry
 */

/**
 * `@cacheInvalidator` directive
 * Flushed the cache when requested
 * ```
 * type Query {
 *   data: DataResult @cacheInvalidator(idPath:[{ type: 'Product' path: "items" }])
 * }
 *
 * type DataResult {
 *   items: [Item]
 * }
 *
 * type Item {
 *   id: ID!
 * }
 * ```
 */
module.exports = class GraphQLCacheInvalidatorDirective extends SchemaDirectiveVisitor {
  /**
   * @param {GraphQLType|GraphQLField} field GraphQL Field
   * @returns {void}
   */
  visitFieldDefinition(field) {
    let { resolve = defaultFieldResolver } = field;
    const { idPath } = this.args;

    Object.defineProperty(field, 'resolve', {
      get: () => this.getResolverWithCacheInvalidator(resolve, idPath),
      // Handling potential "addResolveFunctionsToSchema" calls that define dynamic resolvers
      set: newResolve => {
        resolve = newResolve;
      },
      configurable: true
    });
  }

  /**
   * Get a resolver function with cache invalidation capabilities
   * @param {Function} resolve Native GQL resolver function
   * @param {IdPathEntry[]} idPath List of idPath entries to invalidate
   * @returns {Function} Resolver function
   */
  getResolverWithCacheInvalidator(resolve, idPath = []) {
    const thisDirective = this;
    return async function fieldResolver(parent, params, context, info) {
      const resolver = async () => resolve.call(this, parent, params, context, info);
      const { config: { cache: { resolvers: { invalidation = false } = {} } = {} } = {} } = context;
      const result = await resolver();
      if (invalidation) {
        const rootTags = getTagsForField(result, info.returnType);
        if (rootTags) {
          await context.cache.delete(rootTags);
        }

        await Promise.all(
          idPath.map(idPathEntry => thisDirective.invalidateCacheByResult(result, idPathEntry, parent, context, info))
        );
      }

      return result;
    };
  }

  /**
   * Invalidate cache from the result using the provided idPath entry
   * @param {mixed} result Resolver result
   * @param {IdPathEntry} idPathEntry ID Path entry
   * @param {Object} parent GraphQL Resolver parent value
   * @param {Object} context GraphQL context object
   * @param {GraphQLResolveInfo} info GraphQL Info object
   * @returns {void}
   */
  async invalidateCacheByResult(result, idPathEntry, parent, context, info) {
    const { path, type } = idPathEntry;
    const tags = extractTagsForIdPath(path, result, info, parent, type);
    // Removing first "clean" tag (like "Product")
    tags.shift();
    if (!tags.length) {
      return;
    }
    return context.cache.delete(tags);
  }
};
