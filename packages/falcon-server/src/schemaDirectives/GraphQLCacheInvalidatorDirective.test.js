const { Cache, InMemoryLRUCache } = require('@deity/falcon-server-env');
const { buildSchemaAndRunQuery } = require('../utils/testing');
const GraphQLCacheInvalidatorDirective = require('./GraphQLCacheInvalidatorDirective');

const directiveDefinition = `directive @cacheInvalidator(idPath: [IdPathEntryInput]) on FIELD_DEFINITION

input IdPathEntryInput {
  type: String
  path: String!
}`;

const config = {
  cache: {
    resolvers: {
      invalidation: true
    }
  }
};

const schemaDirectives = {
  cacheInvalidator: GraphQLCacheInvalidatorDirective
};

describe('@cacheInvalidator directive', () => {
  let cacheProvider;
  let cache;

  beforeEach(() => {
    cacheProvider = new InMemoryLRUCache();
    cache = new Cache(cacheProvider);
  });

  it('Should properly resolve value and flush the cache by tags', async () => {
    const cacheDeleteSpy = jest.spyOn(cache, 'delete');
    const typeDefs = `
      ${directiveDefinition}
      type Query {
        foo: Foo @cacheInvalidator
      }
      type Foo {
        id: ID!
        name: String
      }
    `;

    const resolvers = {
      Query: {
        foo: () => ({
          id: '1',
          name: 'foo'
        })
      }
    };
    const query = `query { foo { name } }`;
    const expected = { foo: { name: 'foo' } };

    const { data } = await buildSchemaAndRunQuery(typeDefs, resolvers, query, { cache, config }, schemaDirectives);
    expect(data).toEqual(expected);
    expect(cacheDeleteSpy).toHaveBeenCalledWith(['Foo:1']);
  });

  it('Should invalidate cache by tags with a custom Type', async () => {
    const cacheDeleteSpy = jest.spyOn(cache, 'delete');
    const typeDefs = `
      ${directiveDefinition}
      type Query {
        foo: Foo @cacheInvalidator(idPath: [{ path: "items", type: "Bar" }])
      }
      type Foo {
        items: [FooItem]
      }
      type FooItem {
        id: ID!
        name: String
      }
    `;

    const resolvers = {
      Query: {
        foo: () => ({
          items: [
            {
              id: '1',
              name: 'foo1'
            },
            {
              id: '2',
              name: 'foo2'
            }
          ]
        })
      }
    };
    const query = `query { foo { items { name } } }`;
    const expected = { foo: { items: [{ name: 'foo1' }, { name: 'foo2' }] } };

    const { data } = await buildSchemaAndRunQuery(typeDefs, resolvers, query, { cache, config }, schemaDirectives);
    expect(data).toEqual(expected);
    expect(cacheDeleteSpy).toHaveBeenCalledWith(['Bar:1', 'Bar:2']);
    cacheDeleteSpy.mockClear();

    const emptyResolvers = {
      Query: {
        foo: () => ({})
      }
    };
    const { data: emptyData } = await buildSchemaAndRunQuery(
      typeDefs,
      emptyResolvers,
      query,
      { cache, config },
      schemaDirectives
    );
    expect(emptyData).toEqual({ foo: { items: null } });
    expect(cacheDeleteSpy).toHaveBeenCalledWith([]);
  });
});
