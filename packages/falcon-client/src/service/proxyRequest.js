import Url from 'url';
import fetch from 'node-fetch';

/**
 * @param {string} url
 * @param {import('koa').Context} ctx
 */
export async function proxyRequest(url, ctx) {
  const { request, req } = ctx;

  return fetch(url, {
    method: request.method,
    headers: {
      ...request.header,
      host: Url.parse(url).host // overriding `host` header with the target server
    },
    body: request.method === 'POST' ? req : undefined
  });
}
