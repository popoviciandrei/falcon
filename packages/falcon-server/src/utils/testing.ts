import { graphql, GraphQLSchema } from 'graphql';
import { makeExecutableSchema, SchemaDirectiveVisitor, IResolvers } from 'graphql-tools';

declare type SchemaDirectives = Record<string, typeof SchemaDirectiveVisitor>;
declare type Resolvers = IResolvers | Array<IResolvers>;

const runQuery = async (schema: GraphQLSchema, query: string, context: any) =>
  graphql({
    schema,
    source: query,
    contextValue: context
  });

const buildSchema = (typeDefs: string | string[], resolvers: Resolvers, schemaDirectives: SchemaDirectives) =>
  makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives
  });

const buildSchemaAndRunQuery = async (
  typeDefs: string | string[],
  resolvers: Resolvers,
  query: string,
  context: any,
  schemaDirectives: SchemaDirectives
) => runQuery(buildSchema(typeDefs, resolvers, schemaDirectives), query, context);

export { runQuery, buildSchema, buildSchemaAndRunQuery };
