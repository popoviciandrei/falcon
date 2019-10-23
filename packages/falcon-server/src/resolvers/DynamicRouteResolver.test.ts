import { ApiDataSource, ApiUrlPriority } from '@deity/falcon-server-env';
import { EventEmitter2 } from 'eventemitter2';
import { DynamicRouteResolver } from './DynamicRouteResolver';

class Api1 extends ApiDataSource {
  getFetchUrlPriority(url) {
    return url.startsWith('/blog/') ? ApiUrlPriority.HIGHEST : ApiUrlPriority.LOW;
  }

  async fetchUrl(_, { path }) {
    return { id: 1, path, type: 'foo' };
  }
}
class Api2 extends ApiDataSource {
  getFetchUrlPriority(url) {
    return url.endsWith('.html') ? ApiUrlPriority.HIGH : ApiUrlPriority.NORMAL;
  }

  async fetchUrl(_, { path }) {
    return { id: 2, path, type: 'bar' };
  }
}

describe('DynamicRouteResolver', () => {
  it('Should correctly resolve DynamicRoute request', async () => {
    const ee = new EventEmitter2();
    const dataSources = {
      api1: new Api1({
        eventEmitter: ee
      }),
      api2: new Api2({
        eventEmitter: ee
      })
    };

    const spyApi1 = jest.spyOn(dataSources.api1, 'fetchUrl');
    const spyApi2 = jest.spyOn(dataSources.api2, 'fetchUrl');

    const dynamicResolver = new DynamicRouteResolver();

    const result = await dynamicResolver.fetchUrl({}, { path: 'foo.html' }, { dataSources });
    expect(result).toEqual({ id: 2, path: 'foo.html', redirect: false, type: 'bar' });
    expect(spyApi2).toHaveBeenCalled();
    expect(spyApi1).not.toHaveBeenCalled();

    spyApi1.mockClear();
    spyApi2.mockClear();

    const result2 = await dynamicResolver.fetchUrl({}, { path: '/blog/bar/page' }, { dataSources });
    expect(result2).toEqual({ id: 1, path: '/blog/bar/page', redirect: false, type: 'foo' });
    expect(spyApi1).toHaveBeenCalled();
    expect(spyApi2).not.toHaveBeenCalled();
  });
});
