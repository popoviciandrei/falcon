export * from './types';

/**
 * Shop Extension
 */
export default () => ({
  resolvers: {
    PlaceOrderResult: {
      __resolveType: ({ url }) => (url ? 'PlaceOrder3dSecureResult' : 'PlaceOrderSuccessfulResult')
    },
    BackendConfig: {
      // Returning an empty object to make ShopConfig resolvers work
      shop: () => ({})
    }
  }
});
