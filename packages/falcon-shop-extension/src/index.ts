import { PlaceOrderResult } from './types';

/**
 * Shop Extension
 */
const ShopExtension = () => ({
  resolvers: {
    PlaceOrderResult: {
      __resolveType: (data: PlaceOrderResult) =>
        'url' in data ? 'PlaceOrder3dSecureResult' : 'PlaceOrderSuccessfulResult'
    },
    BackendConfig: {
      // Returning an empty object to make ShopConfig resolvers work
      shop: () => ({})
    }
  }
});

export * from './types';
export { ShopExtension as Extension };
