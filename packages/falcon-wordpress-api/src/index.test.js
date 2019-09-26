const nock = require('nock');
const { InMemoryLRUCache } = require('@deity/falcon-server-env');
const WordpressApi = require('./');

const cache = {
  provider: new InMemoryLRUCache()
};

describe('WordPress API', () => {
  let wpApi;

  beforeEach(() => {
    wpApi = new WordpressApi({
      config: {
        host: 'example.com',
        protocol: 'https'
      }
    });
  });

  afterAll(() => {
    nock.restore();
  });

  it('Should generate "baseURL" properly', () => {
    expect(wpApi.baseURL).toBe('https://example.com');
  });

  it('Should handle "fetchUrl" method response', async () => {
    nock('https://example.com')
      .get(uri => uri.indexOf('url?path'))
      .reply(200, {
        type: 'post',
        url: '/foo/',
        data: {
          id: 1
        }
      });

    await wpApi.initialize({ context: { session: {} }, cache });

    const result = await wpApi.fetchUrl({}, { path: '/foo/' }, { session: {} });
    expect(result).toEqual({
      id: 1,
      path: '/foo/',
      type: 'blog-post',
      redirect: false
    });
  });

  it('Should pass pagination data correctly in "blogPostList" method', async () => {
    const correctResponse = {
      success: true
    };

    nock('https://example.com')
      .get(uri => uri.indexOf('posts?per_page=3') >= 0)
      .reply(200, correctResponse);

    await wpApi.initialize({ context: {}, cache });

    const result = await wpApi.blogPostList({}, { query: {}, pagination: { perPage: 3 } }, { session: {} });

    expect(result).toEqual(correctResponse);
  });
});
