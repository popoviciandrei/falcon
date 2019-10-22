const GraphQLCacheDirective = require('./GraphQLCacheDirective');
const GraphQLCacheInvalidatorDirective = require('./GraphQLCacheInvalidatorDirective');

module.exports = {
  cache: GraphQLCacheDirective,
  cacheInvalidator: GraphQLCacheInvalidatorDirective
};
