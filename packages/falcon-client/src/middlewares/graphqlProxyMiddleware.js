import { toApolloError } from 'apollo-server-errors';
import { proxyRequest } from '../service/proxyRequest';

/**
 * GraphQL requests proxy to (Falcon-Server)
 * @param {string} graphQLServerUrl
 */
export default graphQLServerUrl => {
  return async ctx => {
    try {
      const response = await proxyRequest(graphQLServerUrl, ctx);

      response.headers.forEach((value, name) => ctx.set(name, value));
      /**
       * node-fetch returns `set-cookie` headers concatenated with `, ` (which is invalid)
       * for this reason we manually fill `set-cookie` with `raw` headers
       * @see https://github.com/bitinn/node-fetch/blob/master/src/headers.js#L120
       */
      ctx.set('set-cookie', response.headers.raw()['set-cookie'] || []);

      ctx.status = response.status;
      ctx.body = response.body;
    } catch (error) {
      ctx.status = 200;
      ctx.body = toApolloError(error, error.code);
    } finally {
      // `result.body` will set a proper `content-encoding` header,
      // otherwise - it leads to a "net::ERR_CONTENT_DECODING_FAILED" error
      ctx.remove('content-encoding');
    }
  };
};
