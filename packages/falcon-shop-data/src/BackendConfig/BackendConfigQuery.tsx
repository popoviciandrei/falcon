import gql from 'graphql-tag';
import { Query, BackendConfig } from '@deity/falcon-data';
import { ShopConfig } from '@deity/falcon-shop-extension';

export const GET_BACKEND_CONFIG = gql`
  query BackendConfig {
    backendConfig {
      locales
      activeLocale
      shop {
        activeCurrency
        sortOrderList {
          name
          value {
            field
            direction
          }
        }
      }
    }
  }
`;

export type ShopBackendConfig = BackendConfig & {
  shop: Pick<ShopConfig, 'activeCurrency' | 'sortOrderList'>;
};

export type BackendConfigResponse = {
  backendConfig: ShopBackendConfig;
};

export class BackendConfigQuery extends Query<BackendConfigResponse> {
  static defaultProps = {
    query: GET_BACKEND_CONFIG
  };
}
