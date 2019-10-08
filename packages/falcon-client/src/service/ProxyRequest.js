import Url from 'url';
import fetch from 'node-fetch';

/**
 * @param {string} url
 * @param {import('koa-router').IRouterContext} ctx
 */
export async function ProxyRequest(url, ctx) {
  const { request, req } = ctx;

  return fetch(url, {
    method: request.method,
    headers: {
      ...request.header,
      // Overriding Host header with the target server
      host: Url.parse(url).host
    },
    body: request.method === 'POST' ? req : undefined
  }).then(response => {
    response.headers.forEach((value, name) => ctx.set(name, value));

    // TODO: we should not change `ctx` here!

    // https://github.com/bitinn/node-fetch/blob/master/src/headers.js#L120
    // node-fetch returns `set-cookie` headers concatenated with ", " (which is invalid)
    // for this reason we get a list of "raw" headers and set them to the response
    ctx.set('set-cookie', response.headers.raw()['set-cookie'] || []);

    return response;
  });
}
