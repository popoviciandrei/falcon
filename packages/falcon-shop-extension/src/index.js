const { resolve } = require('path');
const typeDefs = require('fs').readFileSync(resolve(__dirname, 'schema.graphql'), 'utf8');
const { Extension } = require('@deity/falcon-server-env');

/**
 * Extension that implements shop features
 */
class Shop extends Extension {
  async getGraphQLConfig() {
    const gqlConfig = await super.getGraphQLConfig(typeDefs);

    Object.assign(gqlConfig.resolvers, {
      PlaceOrderResult: {
        __resolveType: obj => (obj.url ? 'PlaceOrder3dSecureResult' : 'PlaceOrderSuccessfulResult')
      },
      BackendConfig: {
        // Returning an empty object to make ShopConfig resolvers work
        shop: () => ({})
      },
      ShopConfig: {
        activeCurrency: (_, __, context) => this.getApiSession(context).currency,
        activeStore: (_, __, context) => this.getApiSession(context).storeCode
      }
    });

    return gqlConfig;
  }
}

module.exports = Shop;
module.exports.Schema = typeDefs;
