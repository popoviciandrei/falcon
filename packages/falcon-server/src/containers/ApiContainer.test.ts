import { EventEmitter2 } from 'eventemitter2';
import Logger from '@deity/falcon-logger';
import { ApiContainer } from './ApiContainer';

Logger.setLogLevel('silent');

const apis = {
  'fake-api': {
    package: 'fake-backend-api',
    config: {
      host: 'fake.host.com',
      protocol: 'http'
    }
  }
};

const apisWithExtraResolvers = {
  'fake-api': {
    package: 'fake-backend-api-with-extra-resolvers',
    config: {
      host: 'fake.host.com',
      protocol: 'http'
    }
  }
};

describe('ApiContainer', () => {
  let ee;

  beforeEach(() => {
    ee = new EventEmitter2();
  });

  it('Should register provided API DataSources', async () => {
    /** @type {ApiContainer} */
    const container = new ApiContainer(ee);
    await container.registerApis(apis);
    expect(container.dataSources.size).toBe(1);

    const apiInstance = container.dataSources.get('fake-api');
    expect(apiInstance).toBeTruthy();
    expect(apiInstance().name).toBe('fake-api');
  });

  it('Should do nothing for an empty API list', async () => {
    const container = new ApiContainer(ee);
    await container.registerApis();
    expect(container.dataSources.size).toBe(0);
  });

  it('Should not fail for missing API DataSource package', async () => {
    const container = new ApiContainer(ee);
    await container.registerApis([{ package: 'foo-bar' }]);

    expect(container.dataSources.size).toBe(0);
  });

  it('Should collect extraResolvers (if available)', async () => {
    const container = new ApiContainer(ee);
    expect(container.resolvers).toHaveLength(0);
    await container.registerApis(apisWithExtraResolvers);
    expect(container.resolvers).toHaveLength(1);
  });
});
