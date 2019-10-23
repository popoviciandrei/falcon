import supertest from 'supertest';
import Koa from 'koa';
import { FalconServer, Config, Events } from '.';

describe('Falcon Server', () => {
  const config: Config = {
    debug: true,
    port: 4000,
    logLevel: 'error',
    endpoints: {
      'fake-api': {
        package: 'fake-backend-endpoints',
        config: {
          host: 'fake.host.com',
          protocol: 'http'
        }
      }
    },
    session: {
      keys: ['secret']
    }
  };

  it('Should handle an incoming request to a custom API DataSource endpoint', async (done: jest.DoneCallback) => {
    const server = new FalconServer(config);
    let callback;

    server.eventEmitter.on(Events.AFTER_WEB_SERVER_CREATED, async (app: Koa) => {
      callback = app.callback();
    });
    server.eventEmitter.on(Events.AFTER_INITIALIZED, async () => {
      const response = await supertest(callback).get('/api/info');
      expect(response.text).toBe('foo');
      done();
    });

    await server.initialize();
  });
});
