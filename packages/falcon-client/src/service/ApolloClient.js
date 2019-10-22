import { ApolloLink } from 'apollo-link';
import Apollo from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';
import deepMerge from 'deepmerge';
import { resolvers } from './resolvers';

/**
 * @typedef {object} FalconApolloClientConfig
 * @property {boolean} [isBrowser=false] Boolean flag to determine the current environment
 * @property {object} [initialState={}] Object to restore Cache data from
 * @property {string} [serverUri="http://localhost:4000/graphql"] ApolloServer URL
 * @property {FalconApolloClientStateConfig} [clientState={}] Configuration of client state for Apollo
 */

/**
 * @typedef {object} FalconApolloClientStateConfig
 * @property {object} data https://www.apollographql.com/docs/react/essentials/local-state.html#cache-initialization
 * @property {object} resolvers https://www.apollographql.com/docs/react/essentials/local-state.html#local-resolvers
 */

/**
 * Creates an ApolloClient instance with the provided arguments
 * @param {FalconApolloClientConfig} config Falcon configuration for creating ApolloClient instance
 * @returns {Apollo} ApolloClient instance
 */
export function ApolloClient(config = {}) {
  const {
    extraLinks = [],
    isBrowser = false,
    initialState = {},
    clientState = {},
    headers,
    apolloClientConfig,
    cache
  } = config;
  clientState.resolvers = deepMerge(clientState.resolvers, resolvers);
  const { httpLink, connectToDevTools, ...restApolloClientConfig } = apolloClientConfig;

  const inMemoryCache = cache || new InMemoryCache().restore(initialState);
  inMemoryCache.writeData({ data: clientState.data });

  let httpLinkUri = httpLink.uri;
  if (!isBrowser && clientState.data.config.graphqlUrl) {
    httpLinkUri = clientState.data.config.graphqlUrl;
  }

  const apolloHttpLink = createHttpLink({
    ...httpLink,
    uri: httpLinkUri,
    fetch,
    credentials: 'include',
    headers
  });

  const client = new Apollo(
    deepMerge.all(
      [
        {
          ssrMode: !isBrowser,
          cache: inMemoryCache,
          link: ApolloLink.from([...extraLinks, apolloHttpLink]),
          connectToDevTools: isBrowser && connectToDevTools,
          resolvers: clientState.resolvers
        },
        restApolloClientConfig
      ],
      { clone: false }
    )
  );

  client.onResetStore(() => inMemoryCache.writeData({ data: clientState.data }));

  return client;
}
