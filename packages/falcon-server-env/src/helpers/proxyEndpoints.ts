import { parse } from 'url';
import { IRouterContext } from 'koa-router';
import { EndpointManager } from '../models/EndpointManager';
import { RequestMethod } from '../types';

declare type ResponseStatus = {
  [key: string]: number;
};

export default class ProxyEndpoints extends EndpointManager {
  getEntries() {
    return this.entries.map(route => ({
      methods: RequestMethod.ALL,
      path: route,
      handler: async (ctx: IRouterContext) => this.handleRequest(ctx)
    }));
  }

  /**
   * Handling the request
   * @param {IRouterContext} ctx Koa request context
   */
  async handleRequest(ctx: IRouterContext): Promise<void> {
    const { request } = ctx;
    const { method, url, header } = request;

    header.host = parse(this.baseUrl).host;

    try {
      this.logger.debug(`Processing ${method} ${url} => ${this.baseUrl + url}`);
      ctx.body = this.fetch(`${this.baseUrl}${url}`, {
        method,
        headers: header,
        body: method === 'POST' ? ctx.req : undefined
      });
    } catch (e) {
      const status: number = ({
        ECONNREFUSED: 503,
        ETIMEOUT: 504
      } as ResponseStatus)[e.code];
      ctx.status = status || 500;
    }
  }
}
