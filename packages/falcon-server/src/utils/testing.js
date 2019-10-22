const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');

const runQuery = async (schema, query, context) =>
  graphql({
    schema,
    source: query,
    contextValue: context
  });

const buildSchema = (typeDefs, resolvers, schemaDirectives) =>
  makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives
  });

const buildSchemaAndRunQuery = async (typeDefs, resolvers, query, context, schemaDirectives) =>
  runQuery(buildSchema(typeDefs, resolvers, schemaDirectives), query, context);

module.exports = {
  runQuery,
  buildSchema,
  buildSchemaAndRunQuery
};
