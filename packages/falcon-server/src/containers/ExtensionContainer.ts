/* eslint-disable no-restricted-syntax, no-await-in-loop, no-underscore-dangle */
import path from 'path';
import fs from 'fs';
import {
  ApolloServerConfig,
  ApiDataSource,
  DataSources,
  Events,
  ExtensionInitializer,
  GraphQLContext,
  GraphQLResolver,
  GraphQLResolverMap,
  RemoteBackendConfig
} from '@deity/falcon-server-env';
import { IResolvers } from 'apollo-server-koa';
import { GraphQLResolveInfo } from 'graphql';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';
import deepMerge from 'deepmerge';
import { getRootTypeFields, RootFieldTypes } from '../graphqlUtils/schema';
import { BackendConfig, ExtensionGraphQLConfig, ExtensionEntryMap } from '../types';
import { BaseContainer } from './BaseContainer';

export type GraphQLConfigDefaults = Partial<ApolloServerConfig> & {
  schemas?: Array<string>;
  contextModifiers?: ApolloServerConfig['context'][];
  rootResolvers?: IResolvers<any, any>[];
};

/**
 * Holds extensions and expose running hooks for for them.
 */
export class ExtensionContainer<T extends GraphQLContext = GraphQLContext> extends BaseContainer {
  public schemaFileName: string = 'schema.graphql';

  protected entries: Map<string, ExtensionGraphQLConfig> = new Map();

  /**
   * Instantiates extensions based on passed configuration and registers event handlers for them
   * @param extensions Key-value list of extension configurations
   */
  async registerExtensions(extensions: ExtensionEntryMap): Promise<void> {
    for (const extKey in extensions) {
      if (Object.prototype.hasOwnProperty.call(extensions, extKey)) {
        let extGqlConfig: ExtensionGraphQLConfig = {};
        const extension = extensions[extKey];
        const { config: extensionConfig = {} } = extension;

        const ExtensionInstanceFn = this.importModule<ExtensionInitializer>(extension.package);
        if (ExtensionInstanceFn) {
          extGqlConfig = deepMerge(extGqlConfig, ExtensionInstanceFn(extensionConfig) || {});
        }

        const schemaContent = this.importExtensionGraphQLSchema(extension.package, extKey);
        if (schemaContent) {
          extGqlConfig = deepMerge(
            extGqlConfig,
            await this.getExtensionGraphQLConfig(schemaContent, extensionConfig.api, extKey)
          );
        } else {
          this.logger.warn(
            `${extKey} ("${extension.package}") extension does not contain ${this.schemaFileName} file.`
          );
        }

        this.logger.debug(`"${extKey}" added to the list of extensions`);
        this.entries.set(extKey, extGqlConfig);

        await this.eventEmitter.emitAsync(Events.EXTENSION_REGISTERED, {
          name: extKey,
          instance: extGqlConfig
        });
      }
    }
  }

  /**
   * Initializes each registered extension (in sequence)
   * @param obj
   * @param args
   * @param context
   * @param info
   * @returns {object} Merged config
   */
  fetchBackendConfig: GraphQLResolver<BackendConfig, null, null, T> = async (obj, args, context, info) => {
    const configs = await Promise.all(
      Array.from(Object.entries(context.dataSources), ([apiName, api]) => {
        if (typeof api.fetchBackendConfig !== 'function') {
          // Processing only supported APIs
          return null;
        }
        this.logger.debug(`Fetching "${apiName}" API backend config`);
        return api.fetchBackendConfig(obj, args, context, info);
      })
    );

    return this.mergeBackendConfigs(configs);
  };

  /**
   * Merges backend configs
   * @param configs List of API config
   * @returns {object} Merged config
   */
  mergeBackendConfigs(configs: Array<RemoteBackendConfig>): BackendConfig {
    return configs.reduce((prev, current) => {
      if (!current) {
        return prev;
      }

      const { locales: prevLocales } = prev;
      const { locales: currLocales } = current;

      const isPrevLocalesArr = Array.isArray(prevLocales);
      const isCurrLocalesArr = Array.isArray(currLocales);

      let mergedLocales: string[];

      // Merging "locales" values (leaving only those that exist on every API)
      if (isCurrLocalesArr && isPrevLocalesArr) {
        mergedLocales = currLocales.filter(loc => prevLocales.indexOf(loc) >= 0);
      } else {
        mergedLocales = isCurrLocalesArr && !isPrevLocalesArr ? currLocales : prevLocales;
      }

      return {
        locales: mergedLocales
      };
    }, {}) as BackendConfig;
  }

  /**
   * Creates a complete configuration for ApolloServer
   * @param defaultConfig default configuration that should be used
   * @returns {object} resolved configuration
   */
  createGraphQLConfig(defaultConfig: GraphQLConfigDefaults = {}): ApolloServerConfig {
    const config = Object.assign(
      {
        schemas: [],
        resolvers: [],
        // contextModifiers will be used as helpers - it will gather all the context functions and we'll invoke
        // all of them when context will be created. All the results will be merged to produce final context
        contextModifiers: defaultConfig.context ? [defaultConfig.context] : []
      },
      defaultConfig,
      {
        resolvers:
          defaultConfig.rootResolvers && !Array.isArray(defaultConfig.rootResolvers)
            ? [defaultConfig.rootResolvers]
            : defaultConfig.rootResolvers || []
      }
    );

    for (const [extName, extConfig] of this.entries) {
      this.mergeGraphQLConfig(config, extConfig, extName);
    }

    // define context handler that invokes all context handlers delivered by extensions
    const { contextModifiers } = config;
    config.context = (arg: any) => {
      const ctx = {};
      contextModifiers.forEach(modifier => {
        Object.assign(ctx, typeof modifier === 'function' ? modifier(arg) : modifier);
      });
      return ctx;
    };

    config.schema = mergeSchemas({
      schemas: [
        makeExecutableSchema({
          typeDefs: config.schemas,
          resolvers: config.resolvers
        })
      ],
      schemaDirectives: config.schemaDirectives,
      resolvers: config.resolvers
    });

    // remove processed fields
    delete config.contextModifiers;
    delete config.resolvers;
    delete config.schemas;

    return config;
  }

  protected mergeGraphQLConfig(dest: GraphQLConfigDefaults, source: ExtensionGraphQLConfig, extensionName: string) {
    this.logger.debug(`Merging "${extensionName}" extension GraphQL config`);

    Object.keys(source).forEach(name => {
      if (!name || typeof source[name] === 'undefined') {
        return;
      }
      const value = source[name];
      const valueArray = Array.isArray(value) ? value : [value];

      switch (name) {
        case 'schema':
        case 'schemas':
          valueArray.forEach(schemaItem => {
            if (typeof schemaItem !== 'string') {
              this.logger
                .getFor(extensionName)
                .warn(
                  `Extension contains non-string GraphQL Schema definition,` +
                    `please check its "${name}" configuration and make sure all items are represented as strings. ${schemaItem}`
                );
            }
          });

          dest.schemas.push(...valueArray);
          break;
        case 'resolvers':
          (dest.resolvers as any).push(...valueArray);
          break;
        case 'context':
          dest.contextModifiers.push(value);
          break;
        case 'schemaDirectives':
          Object.assign(dest.schemaDirectives, value);
          break;
        case 'dataSources':
          Object.assign(dest.dataSources, value);
          break;
        default:
          // todo: consider overriding the properties that we don't have custom merge logic for yet instead of
          // skipping those
          // that would give a possibility to override any kind of ApolloServer setting but the downside is
          // that one extension could override setting returned by previous one
          this.logger
            .getFor(extensionName)
            .warn(
              `Extension wants to use GraphQL "${name}" option which is not supported by Falcon extensions api yet - skipping that option`
            );
          break;
      }
    });
  }

  /**
   * Imports extension's GraphQL Schema (if present in the provided "package")
   * @param basePath Base path of the package
   * @param extKey Extension name
   * @returns {string | undefined} Partial GraphQL Schema (if available)
   */
  protected importExtensionGraphQLSchema(basePath: string, extKey: string): string | undefined {
    const packagePath = path.join(basePath, this.schemaFileName);
    const subFolderPath = path.join(process.cwd(), packagePath);
    const readFile = (filePath: string) => fs.readFileSync(filePath, 'utf8');

    try {
      const packageResolvedPath: string = require.resolve(packagePath);
      this.logger.getFor(extKey).debug(`Loading Schema from "${packageResolvedPath}"`);
      return readFile(packageResolvedPath);
    } catch {
      try {
        this.logger.getFor(extKey).debug(`Loading Schema from "${subFolderPath}"`);
        return readFile(subFolderPath);
      } catch {
        return undefined;
      }
    }
  }

  /**
   * Performs partial auto-binding for DataSource methods based on the provided `typeDefs`
   * @param typeDefs Extension's GQL schema type definitions
   * @param dataSourceName name of the DataSource
   * @param extKey Extension name
   * @returns {Promise<ExtensionGraphQLConfig | undefined>} GraphQL configuration object
   */
  protected async getExtensionGraphQLConfig(
    typeDefs: string | Array<string>,
    dataSourceName: string,
    extKey: string
  ): Promise<ExtensionGraphQLConfig | undefined> {
    if (!typeDefs) {
      return undefined;
    }

    const rootTypes: RootFieldTypes = await this.logger
      .getFor(extKey)
      .traceTime(`Processing schema fields`, () => Promise.resolve(getRootTypeFields(typeDefs as any)));
    const resolvers: GraphQLResolverMap = {};

    Object.keys(rootTypes).forEach((typeName: string) => {
      resolvers[typeName] = {};
      rootTypes[typeName].forEach((fieldName: string) => {
        this.logger
          .getFor(extKey)
          .debug(
            `Binding "${typeName}.${fieldName} => ${dataSourceName}.${fieldName}(obj, args, context, info)" resolver`
          );
        resolvers[typeName][fieldName] = async (
          obj: any,
          args: any,
          context: GraphQLContext,
          info: GraphQLResolveInfo
        ) => {
          const dataSource = this.getApi(context.dataSources, dataSourceName);
          if (typeof dataSource[fieldName] !== 'function') {
            throw new Error(
              `${this.constructor.name}: ${dataSourceName}.${fieldName}() resolver method is not defined!`
            );
          }
          return dataSource[fieldName](obj, args, context, info);
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
   * @param dataSources GraphQL Resolver context object
   * @param name Name of ApiDataSource (set via config)
   * @returns {ApiDataSource<GraphQLContext> | null} API DataSource instance if found
   */
  protected getApi(dataSources: DataSources, name: string): ApiDataSource<GraphQLContext> | null {
    return name in dataSources ? dataSources[name] : null;
  }
}
