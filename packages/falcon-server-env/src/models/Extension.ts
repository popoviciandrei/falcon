import { DocumentNode, Kind, GraphQLResolveInfo, parse } from 'graphql';
import { EventEmitter2 } from 'eventemitter2';
import Logger, { Logger as LoggerType } from '@deity/falcon-logger';
import {
  ApiUrlPriority,
  IConfigurableConstructorParams,
  ExtensionContainer,
  FetchUrlParams,
  FetchUrlResult,
  GraphQLContext
} from '../types';
import { ApiDataSource } from './ApiDataSource';

export type ExtensionConstructorParams = IConfigurableConstructorParams & {
  /** ExtensionContainer instance */
  extensionContainer: ExtensionContainer;
};

export type GraphQLConfig = {
  schema: Array<string>;
  resolvers: GraphQLResolverMap;
};

export interface ExtensionConfig {
  api?: string;
}

export interface RootFieldTypes {
  [name: string]: Array<string>;
}

export type GraphQLFieldResolver = (obj: any, args: any, context: GraphQLContext, info: GraphQLResolveInfo) => any;

export type GraphQLResolverMap = {
  [name: string]: {
    [name: string]: GraphQLFieldResolver;
  };
};

export abstract class Extension {
  public config: ExtensionConfig;

  public name: string;

  public api?: ApiDataSource;

  protected extensionContainer: ExtensionContainer;

  protected eventEmitter: EventEmitter2;

  protected logger: LoggerType;

  /**
   * @param {ExtensionConstructorParams} params Constructor params
   */
  constructor(params: ExtensionConstructorParams) {
    const { config = {}, name, extensionContainer, eventEmitter } = params;
    this.name = name || this.constructor.name;
    this.config = config as ExtensionConfig;
    this.extensionContainer = extensionContainer;
    this.eventEmitter = eventEmitter;
    this.logger = Logger.getFor(this.name);
  }

  /**
   * GraphQL configuration getter
   * @param {string|Array<string>} typeDefs Extension's GQL schema type definitions
   * @returns {Object} GraphQL configuration object
   */
  async getGraphQLConfig(typeDefs: string | Array<string> = ''): Promise<GraphQLConfig> {
    if (!typeDefs) {
      this.logger.warn(`typeDefs is empty! Make sure you call "super.getGraphQLConfig(typeDefs)" properly`);
    }
    const rootTypes: RootFieldTypes = await this.logger.traceTime(`Processing schema fields`, () =>
      Promise.resolve(this.getRootTypeFields(typeDefs))
    );
    const resolvers: GraphQLResolverMap = {};

    Object.keys(rootTypes).forEach((typeName: string) => {
      if (!rootTypes[typeName].length) {
        return;
      }
      resolvers[typeName] = {};
      rootTypes[typeName].forEach((fieldName: string) => {
        this.logger.debug(
          `Binding "${typeName}.${fieldName} => ${this.config.api}.${fieldName}(obj, args, context, info)" resolver`
        );
        resolvers[typeName][fieldName] = async (
          obj: any,
          args: any,
          context: GraphQLContext,
          info: GraphQLResolveInfo
        ) => {
          if (typeof (this.getApi(context) as any)[fieldName] !== 'function') {
            throw new Error(`${this.name}: ${this.config.api}.${fieldName}() resolver method is not defined!`);
          }
          return (this.getApi(context) as any)[fieldName](obj, args, context, info);
        };
      });
    });

    return {
      schema: Array.isArray(typeDefs) ? typeDefs : [typeDefs],
      resolvers
    };
  }

  /**
   * Gets API instance from DataSource by assigned API name
   * @param {GraphQLContext} context GraphQL Resolver context object
   * @returns {ApiDataSource<GraphQLContext> | null} API DataSource instance if found
   */
  getApi(context: GraphQLContext): ApiDataSource<GraphQLContext> | null {
    const { dataSources } = context;
    return (this.config.api && dataSources[this.config.api]) || null;
  }

  /**
   * Returns a session object from the assigned API Provider
   * @param {GraphQLContext} context GraphQL Resolver context object
   * @returns {Object} Session object
   */
  getApiSession(context: GraphQLContext): any {
    return this.getApi(context)!.session;
  }

  /**
   * Should be implemented if extension wants to deliver content for dynamic urls. It should return priority value for passed url.
   * @param {GraphQLContext} context GraphQL Resolver context object
   * @param {string} path url for which the priority should be returned
   * @returns {number|null} Priority index or ApiUrlPriority.OFF (if "dynamic URL" is not supported)
   */
  getFetchUrlPriority(context: GraphQLContext, path: string): number | null {
    const apiDataSource: ApiDataSource<GraphQLContext> | null = this.getApi(context);
    return apiDataSource && apiDataSource.getFetchUrlPriority && apiDataSource.fetchUrl
      ? apiDataSource.getFetchUrlPriority(path)
      : ApiUrlPriority.OFF;
  }

  async fetchUrl(obj: object, args: FetchUrlParams, context: any, info: GraphQLResolveInfo): Promise<FetchUrlResult> {
    return this.getApi(context)!.fetchUrl!(obj, args, context, info);
  }

  fetchApiBackendConfig(
    obj: object,
    args: object,
    context: any,
    info: GraphQLResolveInfo
  ): Promise<object | undefined> {
    const apiDataSource: ApiDataSource<GraphQLContext> | null = this.getApi(context);

    return apiDataSource && apiDataSource.fetchBackendConfig
      ? apiDataSource.fetchBackendConfig(obj, args, context, info)
      : Promise.resolve(undefined);
  }

  /**
   * Returns a map of fields by GQL type name
   * @param {string|Array<string>} typeDefs Extension GQL schema type definitions
   * @returns {RootFieldTypes} Map of GQL type-fields
   */
  protected getRootTypeFields(typeDefs: string | Array<string>): RootFieldTypes {
    const result: RootFieldTypes = {
      Query: [],
      Mutation: []
    };
    if (!typeDefs) {
      return result;
    }
    try {
      const docNode: DocumentNode = parse(Array.isArray(typeDefs) ? typeDefs.join('\n') : typeDefs);
      docNode.definitions.forEach(definition => {
        if (definition.kind !== Kind.OBJECT_TYPE_DEFINITION && definition.kind !== Kind.OBJECT_TYPE_EXTENSION) {
          return;
        }

        const typeName: string = definition.name.value;
        if (!['Query', 'Mutation'].includes(typeName)) {
          return;
        }

        if (definition.fields) {
          definition.fields.forEach(field => {
            const fieldName = field.name.value;
            if (!result[typeName].includes(fieldName)) {
              result[typeName].push(fieldName);
            }
          });
        }
      });
    } catch (error) {
      error.message = `${this.name}: Failed to get root type fields - ${error.message}`;
      throw error;
    }

    return result;
  }
}
