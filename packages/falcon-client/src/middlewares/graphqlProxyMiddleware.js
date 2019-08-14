import { ProxyRequest } from '../service/ProxyRequest';

// GraphQL Proxy to Falcon-Server
export default httpLinkUri => async ctx => {
  const result = await ProxyRequest(httpLinkUri, ctx);

  // `result.body` will set a proper `content-encoding` header,
  // otherwise - it leads to a "net::ERR_CONTENT_DECODING_FAILED" error
  ctx.remove('content-encoding');

  ctx.status = result.status;
  ctx.body = result.body;
};
