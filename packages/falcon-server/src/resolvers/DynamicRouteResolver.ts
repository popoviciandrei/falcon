import Logger from '@deity/falcon-logger';
import {
  ApiDataSource,
  GraphQLContext,
  GraphQLResolver,
  FetchUrlParams,
  FetchUrlResult
} from '@deity/falcon-server-env';

/**
 * Dynamic Route GraphQL Resolver.
 *
 * Dynamic {@link DynamicRouteResolver#fetchUrl url discovery} to connect multiple external api generated urls
 * (example: sale.html)
 * That information can be used for fetching detailed data of that url.
 * It provides back information about entity type for passed url:
 * @example
 * {
 *  type: 'shop-category',
 *  path: '/category/page/path/',
 *  id: 1
 * }
 */
export class DynamicRouteResolver {
  /**
   * Reorder handlers based on request path to boost performance,
   * for example 99% urls ending with .html are coming from Magento
   * @param {GraphQLContext} context GQL context
   * @param {string} url request path
   * @returns {ApiDataSource<GraphQLContext>[]} list of apis that supports url method
   */
  private getDynamicRouteHandlers(context: GraphQLContext, url: string): ApiDataSource<GraphQLContext>[] {
    return Object.values(context.dataSources)
      .filter(
        dataSource => typeof dataSource.getFetchUrlPriority === 'function' && dataSource.getFetchUrlPriority(url) > 0
      )
      .sort((first, second) => (second.getFetchUrlPriority(url) < first.getFetchUrlPriority(url) ? 1 : -1));
  }

  /**
   * Fetches url data from remote API. Signature of the method must match the signature of GraphQL resolvers
   * @param obj
   * @param args
   * @param context
   * @param info
   */
  fetchUrl: GraphQLResolver<FetchUrlResult | null, null, FetchUrlParams> = async (obj, args, context, info) => {
    const { path } = args;

    let response: FetchUrlResult;
    const resolvers = this.getDynamicRouteHandlers(context, path);

    /* eslint-disable no-restricted-syntax */
    /* eslint-disable no-await-in-loop */
    /* eslint-disable no-continue */

    for (const resolver of resolvers) {
      if (typeof resolver.fetchUrl !== 'function') {
        throw new Error(`"fetchUrl" method is not defined in your "${resolver.name}" api`);
      }
      Logger.getFor(this.constructor.name).debug(`Checking ${resolver.name} extension for url: "${path}"...`);
      try {
        response = await resolver.fetchUrl(obj, args, context, info);
        if (response) {
          break;
        }
      } catch (e) {
        // get status code from ApolloExtension internals
        if (e.extensions && e.extensions.response && e.extensions.response.status === 404) {
          response = null;
        } else {
          throw e;
        }
      }
    }

    if (!response) {
      return null;
    }

    /* eslint-enable no-continue */
    /* eslint-enable no-await-in-loop */
    /* eslint-enable no-restricted-syntax */

    return {
      redirect: false,
      path,
      ...response
    };
  };
}
