import 'source-map-support/register';
import http from 'http';
import Logger from '@deity/falcon-logger';

async function falconWebServer() {
  const { Server } = require('./server');
  const app = require('./clientApp');
  const clientBootstrap = require('./clientApp/bootstrap').default;
  const bootstrap = await clientBootstrap();
  const { config } = bootstrap;

  if (config.appName) {
    Logger.setApp(config.appName);
  }
  if (config.logLevel) {
    Logger.setLogLevel(config.logLevel);
  }

  /* eslint-disable */
  const webpackAssets =
    process.env.NODE_ENV === 'production'
      ? require(process.env.WEBPACK_ASSETS)
      : __non_webpack_require__(process.env.WEBPACK_ASSETS);
  /* eslint-enable */

  /**
   * Creates an instance of Falcon web server
   * @param {ServerAppConfig} props Application parameters
   * @returns {WebServer} Falcon web server
   */
  return Server({
    App: app.default,
    clientApolloSchema: app.clientApolloSchema,
    bootstrap,
    webpackAssets
  });
}

(async () => {
  const server = await falconWebServer();
  let currentWebServerHandler = server.callback();

  const httpServer = http.createServer(currentWebServerHandler); // https://github.com/koajs/koa/blob/master/docs/api/index.md#appcallback
  httpServer.listen(server.port, error => {
    if (error) {
      Logger.error(error);
    }

    Logger.info(`🚀  Client ready at http://localhost:${server.port}`);
    server.started();
  });

  if (module.hot) {
    Logger.info('✅  Server-side HMR Enabled!');

    module.hot.accept(['./server', './clientApp', './clientApp/bootstrap'], () => {
      Logger.info('🔁  HMR: Reloading server...');

      (async () => {
        try {
          const newServer = await falconWebServer();
          const newHandler = newServer.callback();
          httpServer.removeListener('request', currentWebServerHandler);
          httpServer.on('request', newHandler);
          currentWebServerHandler = newHandler;
          Logger.info('✅  HMR: Server reloaded.');
        } catch (error) {
          Logger.info('🛑  HMR: Reloading server failed, syntax error!');
        }
      })();
    });
  }
})();
