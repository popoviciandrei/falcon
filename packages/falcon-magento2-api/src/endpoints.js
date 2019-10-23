const url = require('url');
const { EndpointManager } = require('@deity/falcon-server-env');
const get = require('lodash/get');
const set = require('lodash/set');

module.exports = class MagentoEndpoints extends EndpointManager {
  constructor(params) {
    super(params);
    this.resultHeader = this.config.resultHeader || 'Falcon-Result';
    this.customerTokenSessionPath = this.config.customerTokenSessionPath || 'magento2.customerToken.token';
    this.orderIdSessionPath = this.config.orderIdSessionPath || 'magento2.orderId';
    this.cartSessionPath = this.config.cartSessionPath || 'magento2.cart';
  }

  getEntries() {
    return [...this.getPayPalCallbackEntries(), ...this.getAdyenCallbackEntries()];
  }

  getAdyenCallbackEntries() {
    return [
      {
        methods: 'POST',
        path: '/rest/(.*)/V1/falcon/guest-orders/(.*)/adyen-process-validate3d',
        handler: this.handleReturn()
      },
      {
        methods: 'POST',
        path: '/rest/(.*)/V1/falcon/orders/(.*)/adyen-process-validate3d',
        handler: this.handleReturn(false)
      }
    ];
  }

  getPayPalCallbackEntries() {
    return [
      {
        methods: 'GET',
        path: '/rest/(.*)/V1/falcon/guest-carts/(.*)/paypal-express-return',
        handler: this.handleReturn()
      },
      {
        methods: 'GET',
        path: '/rest/(.*)/V1/falcon/guest-carts/(.*)/paypal-express-cancel',
        handler: this.handlePayPalCancel()
      },
      {
        methods: 'GET',
        path: '/rest/(.*)/V1/falcon/carts/mine/paypal-express-return',
        handler: this.handleReturn(false)
      },
      {
        methods: 'GET',
        path: '/rest/(.*)/V1/falcon/carts/mine/paypal-express-cancel',
        handler: this.handlePayPalCancel(false)
      }
    ];
  }

  handleReturn(isGuest = true) {
    return async ctx => {
      const result = await this.handleMagentoCallback(ctx, isGuest);
      if (result.ok) {
        const body = await result.json();
        if (body.order_id) {
          set(ctx.session, this.orderIdSessionPath, body.order_id);
          this.clearCart(ctx);
          this.setResult(ctx, body.redirect || 'success');
          return;
        }
      }

      this.setResult(ctx, 'failure');
    };
  }

  handlePayPalCancel(isGuest = true) {
    return async ctx => {
      await this.handleMagentoCallback(ctx, isGuest);
      this.setResult(ctx, 'cancel');
    };
  }

  async handleMagentoCallback(ctx, isGuest) {
    const parsedUrl = url.parse(ctx.request.url);
    const targetUrl = url.format({
      protocol: this.config.protocol,
      host: this.config.host,
      pathname: parsedUrl.pathname,
      search: parsedUrl.search
    });

    this.logger.debug(`Proxying ${ctx.request.url} to ${targetUrl}`);

    return this.fetch(targetUrl, {
      method: ctx.request.method,
      body: ctx.request.method === 'POST' ? JSON.stringify(ctx.request.body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(ctx, isGuest)
      }
    });
  }

  setResult(ctx, result) {
    ctx.body = {
      type: 'payment',
      result
    };
  }

  /**
   * Generates Auth header (if required)
   * @param {object} ctx Koa context object
   * @param {boolean} isGuest Anonymous flag
   * @returns {object} Headers object
   */
  getAuthHeaders(ctx, isGuest = true) {
    if (isGuest) {
      return {};
    }
    const token = get(ctx.session, this.customerTokenSessionPath);
    if (!token) {
      throw new Error('You are not authorized');
    }

    return {
      Authorization: `Bearer ${token}`
    };
  }

  clearCart(ctx) {
    set(ctx.session, this.cartSessionPath, undefined);
  }
};
