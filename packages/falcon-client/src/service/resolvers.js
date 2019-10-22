import { apolloStateToObject } from './apolloStateToObject';

export const resolvers = {
  Query: {
    getConfig: (_, args, { cache: _cache }) => {
      const keyPrefix = '$ROOT_QUERY.config';
      let { key = '' } = args || {};
      key = key ? `${keyPrefix}.${key}` : keyPrefix;
      return apolloStateToObject(_cache.data.data, key);
    }
  }
};
