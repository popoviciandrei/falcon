import { ApiDataSource } from '@deity/falcon-server-env';

export default class FakeBackendApi extends ApiDataSource {
  static getExtraResolvers() {
    return {};
  }
}
