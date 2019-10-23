import { ApolloLink, Observable } from 'apollo-link';
import { CachePersistor } from 'apollo-cache-persist';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from './ApolloClient';

function isOnline() {
  return window.navigator && window.navigator.onLine;
}

const onlyFromCacheWhenOfflineLink = new ApolloLink((operation, forward) => {
  if (isOnline()) {
    return forward(operation);
  }

  const operationDefinition = operation.query.definitions.find(x => x.kind === 'OperationDefinition');
  if (!operationDefinition || (operationDefinition && operationDefinition.operation !== 'query')) {
    return forward(operation);
  }

  const { cache } = operation.getContext();
  try {
    const response = { data: cache.read(operation) };

    // SEE: https://github.com/apollographql/apollo-link/blob/c32e170b72ae1a94cea1c633f977d2dbfcada0e1/packages/apollo-link-http/src/httpLink.ts#L133
    return new Observable(observer => {
      observer.next(response);
      observer.complete();

      return response;
    });
  } catch (error) {
    // cannot read from cache (e.g. because not found), so we forward this `operation` to let Apollo handle this state
    // TODO: check all possible reasons and rescue appropriately

    return forward(operation);
  }
});

export const apolloClientWeb = ({ initialState, clientApolloSchema, apolloClientConfig }) => {
  const cache = new InMemoryCache();
  const cachePersistor = new CachePersistor({
    cache,
    storage: window.localStorage,
    key: '@deity/falcon-client/apollo-cache',
    maxSize: 1048576, // https://github.com/apollographql/apollo-cache-persist/issues/50
    debounce: 1000
  });

  const restoreCache = persistor =>
    isOnline() ? persistor.purge().then(() => cache.restore(initialState)) : persistor.restore();

  return restoreCache(cachePersistor).then(() => {
    const apolloClient = new ApolloClient({
      isBrowser: true,
      clientState: clientApolloSchema,
      initialState,
      apolloClientConfig,
      cache,
      extraLinks: [onlyFromCacheWhenOfflineLink]
    });

    return Promise.resolve(apolloClient);
  });
};
