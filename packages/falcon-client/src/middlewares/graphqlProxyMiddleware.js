import { toApolloError } from 'apollo-server-errors';
import { ProxyRequest } from '../service/ProxyRequest';

/**
 * GraphQL requests proxy to (Falcon-Server)
 * @param {string} graphQLServerUrl
 */
export default graphQLServerUrl => {
  return async ctx => {
    try {
      const result = await ProxyRequest(graphQLServerUrl, ctx);

      ctx.status = result.status;
      ctx.body = result.body;
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
