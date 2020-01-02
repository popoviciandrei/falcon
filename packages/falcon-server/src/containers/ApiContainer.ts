/* eslint-disable no-restricted-syntax, no-await-in-loop */
import {
  ApiDataSource,
  ApiGetter,
  ApiDataSourceConstructor,
  ApolloServerConfig,
  Events
} from '@deity/falcon-server-env';
import { IResolvers } from 'apollo-server-koa';
import { ApiEntryMap } from '../types';
import { BaseContainer } from './BaseContainer';

export type ApiDataSourceInitializer = (gqlServerConfig: ApolloServerConfig) => ApiDataSource;
export type ApiDataSourceMap = Map<string, ApiDataSourceInitializer>;

/**
 * Api Engine acts as a container for API instances:
 * - manages all the instances
 * - returns the instances as dataSources (required by Apollo Server)
 */
export class ApiContainer extends BaseContainer {
  public dataSources: ApiDataSourceMap = new Map();

  public resolvers: IResolvers<any, any>[] = [];

  /**
   * Instantiates apis based on passed configuration
   * @param apis Key-value list of APIs configuration
   */
  async registerApis(apis: ApiEntryMap = {}): Promise<void> {
    for (const apiKey in apis) {
      if (Object.prototype.hasOwnProperty.call(apis, apiKey)) {
        const api = apis[apiKey];

        const { package: pkg, config = {} } = api;
        const ApiClass = this.importModule<ApiDataSourceConstructor>(pkg, 'ApiDataSource');
        if (!ApiClass) {
          return;
        }

        // If imported ApiClass has a defined "getExtraResolvers" static method:
        // - pass `apiGetter` to this method
        // - get the result and push to `this.resolvers` list which will be passed to `extraResolvers` later
        if (ApiClass.getExtraResolvers && typeof ApiClass.getExtraResolvers === 'function') {
          const apiGetter = (resolve): ApiGetter => async (root, params, context, info) => {
            if (!(apiKey in context.dataSources)) {
              throw new Error(`"${apiKey}" API not found `);
            }
            return resolve(context.dataSources[apiKey], root, params, context, info);
          };
          this.resolvers.push(ApiClass.getExtraResolvers(apiGetter));
        }

        const apiInstanceCb: ApiDataSourceInitializer = gqlServerConfig => {
          const instance: ApiDataSource = new ApiClass({
            config,
            name: apiKey,
            apiContainer: this,
            eventEmitter: this.eventEmitter,
            gqlServerConfig
          });

          this.eventEmitter.emit(Events.API_DATA_SOURCE_REGISTERED, {
            instance,
            name: instance.name
          });

          this.logger.debug(`"${instance.name}" API DataSource instantiated`);

          return instance;
        };
        this.dataSources.set(apiKey, apiInstanceCb);
      }
    }
  }
}
