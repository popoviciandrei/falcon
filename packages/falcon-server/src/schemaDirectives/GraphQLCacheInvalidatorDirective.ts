import { SchemaDirectiveVisitor } from 'graphql-tools';
import { GraphQLContext } from '@deity/falcon-server-env';
import { defaultFieldResolver, GraphQLResolveInfo } from 'graphql';
import { extractTagsForIdPath, getTagsForField } from '../graphqlUtils';
import { FieldType, FieldTypeResolver } from './GraphQLCacheDirective';

export type IdPathEntry = {
  /** Entity type (optional) */
  type?: string;
  /** Path to a list of entries or a single entry */
  path: string;
};

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
export class GraphQLCacheInvalidatorDirective extends SchemaDirectiveVisitor {
  /**
   * @param field GraphQL Field
   */
  visitFieldDefinition(field: FieldType): void {
    const { resolve = defaultFieldResolver } = field;
    const { idPath } = this.args;

    field.resolve = this.getResolverWithCacheInvalidator(resolve, idPath);
  }

  /**
   * Get a resolver function with cache invalidation capabilities
   * @param resolve Native GQL resolver function
   * @param idPath List of idPath entries to invalidate
   * @returns {FieldTypeResolver} Resolver function
   */
  getResolverWithCacheInvalidator(resolve: FieldTypeResolver, idPath: IdPathEntry[] = []): FieldTypeResolver {
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
   * @param {object} parent GraphQL Resolver parent value
   * @param {GraphQLContext} context GraphQL context object
   * @param {GraphQLResolveInfo} info GraphQL Info object
   * @returns {Promise<void>}
   */
  async invalidateCacheByResult(
    result: object,
    idPathEntry: IdPathEntry,
    parent: object,
    context: GraphQLContext,
    info: GraphQLResolveInfo
  ): Promise<void> {
    const { path, type } = idPathEntry;
    const tags = extractTagsForIdPath(path, result, info, parent, type);
    // Removing first "clean" tag (like "Product")
    tags.shift();
    if (!tags.length) {
      return;
    }
    return context.cache.delete(tags);
  }
}
