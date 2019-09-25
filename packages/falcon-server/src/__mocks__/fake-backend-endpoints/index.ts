import { EndpointManager, EndpointEntry } from '@deity/falcon-server-env';

export default class FakeBackendEndpoints extends EndpointManager {
  getEntries(): Array<EndpointEntry> {
    return [
      {
        path: '/api/info',
        methods: ['get'],
        handler: (ctx, next) => {
          ctx.body = 'foo';
          next();
        }
      }
    ];
  }
}
