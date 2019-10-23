import { IFieldResolver } from 'graphql-tools';
import { apolloStateToObject } from '../Apollo';

const CLIENT_CONFIG_PATH = '$ROOT_QUERY.config';

export const getClientConfig = (apolloState: object, key?: string) => {
  key = key ? `${CLIENT_CONFIG_PATH}.${key}` : CLIENT_CONFIG_PATH;

  return apolloStateToObject(apolloState, key);
};

export const getClientConfigResolver: IFieldResolver<{}, any, { key: string }> = (_source, { key }, { cache }) =>
  getClientConfig(cache.data.data, key);
