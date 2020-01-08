const url = require('url');
const qs = require('qs');
const pick = require('lodash/pick');
const isEmpty = require('lodash/isEmpty');
const isObject = require('lodash/isObject');
const { ApiDataSource, stripHtmlEntities, stripHtmlTags, generateExcerpt } = require('@deity/falcon-server-env');

module.exports = class WordpressApi extends ApiDataSource {
  constructor(params) {
    super(params);
    this.wpConfig = {};
    this.languageMap = {};
    this.languageSupported = false;
    this.baseLanguage = null;
  }

  async authorizeRequest(req) {
    const { username, password } = this.config;
    const token = Buffer.from(`${username}:${password}`).toString('base64');
    req.headers.set('Authorization', `Basic ${token}`);
  }

  /**
   * Resolves url based on passed parameters
   * @param {object} req request params
   * @returns {string} resolved url object
   */
  async resolveURL(req) {
    const { path } = req;
    const { locale } = this.context.session || {};
    const { apiPrefix } = this.config;
    const { baseLanguage, languageSupported, languageMap } = this;

    const language = languageSupported && locale && languageMap[locale] ? languageMap[locale] : baseLanguage;
    // for base lang do not add prefix
    const langPrefix = language && language !== baseLanguage ? `/${language}` : '';

    return super.resolveURL({ path: `${langPrefix}${apiPrefix}/${path}` });
  }

  /**
   * Parses response and returns data in format accepted by falcon-blog-extension
   * @param {object} res object
   * @param {object} req native request object
   * @returns {object} parsed response
   */
  async didReceiveResponse(res, req) {
    const data = await super.didReceiveResponse(res, req);
    const { headers } = res;

    const totalItems = headers.get('x-wp-total');
    const totalPages = headers.get('x-wp-totalpages');

    if (!totalItems && !totalPages) {
      return data;
    }

    // remove everything before '?' and parse the rest
    const query = qs.parse(req.url.replace(/.*?\?/, ''));
    const { per_page: perPage = 10, page: currentPage = 1 } = query;

    return {
      items: data,
      pagination: this.processPagination(totalItems, currentPage, perPage)
    };
  }

  async fetchBackendConfig() {
    const key = await this.resolveURL({ path: 'blog/info' });
    const config = await this.context.cache.get(key.href, {
      fetchData: async () => this.get('blog/info'),
      options: {
        ttl: 300
      }
    });

    const { languages = {} } = config;
    this.languageSupported = !!Object.keys(languages).length;

    if (this.languageSupported) {
      this.baseLanguage = languages.default;

      this.languageMap = languages.options.reduce((result, option) => {
        const localeCode = option.default_locale.replace('_', '-');

        return {
          ...result,
          [localeCode]: option.language_code
        };
      }, {});

      this.wpConfig.locales = Object.keys(this.languageMap) || [];
    }

    return this.wpConfig;
  }

  /**
   * Fetch single published post by slug
   * @param {object} _ GraphQL root object
   * @param {string} path WP "slug" value
   * @returns {object} Post data
   */
  async blogPost(_, { path }) {
    const slug = path.replace('/', '');

    const query = {
      slug,
      'include-gallery': 1,
      'include-related': 1,
      'count-visit': 1
    };

    return this.get('posts', query, {
      context: {
        didReceiveResult: (result, res) => {
          // WP API returns "post" entry as an array, the following code removes extra-headers
          if (res && res.headers && res.headers.has('x-wp-total')) {
            res.headers.delete('x-wp-total');
            res.headers.delete('x-wp-totalpages');
          }
          return result ? this.processPost(result[0]) : null;
        }
      }
    });
  }

  /**
   * Fetch published posts.
   * @param {object} _ GraphQL root object
   * @param {object} args arguments
   * @param {object} args.query Query object
   * @param {object} args.pagination Pagination
   * @returns {object[]} blog post list
   */
  async blogPostList(_, { query, pagination }) {
    const payload = {
      ...query
    };

    if (pagination) {
      payload.per_page = pagination.perPage;
      payload.page = pagination.page;
    }

    return this.get('posts', payload, {
      context: {
        didReceiveResult: result =>
          result && Array.isArray(result) ? result.map(entry => this.processPost(entry)) : result
      }
    });
  }

  /**
   * @private
   * @param {object} post Post object
   * @returns {object} Processed Post object
   */
  processPost(post) {
    if (!post) {
      return post;
    }

    if (post.featured_image) {
      post.image = this.reduceFeaturedImage(post.featured_image);
    }

    if (post.related_posts) {
      post.related = post.related_posts.map(this.reduceRelatedPost);
    } else {
      post.related = [];
    }

    if (post.title && post.title.rendered) {
      post.title = stripHtmlEntities(post.title.rendered);
    }

    if (post.content) {
      const excerpt =
        (post.acf && post.acf.short_description) ||
        (post.toolset_types && post.toolset_types['custom-text']) ||
        post.content;
      let length;

      if (post.acf && post.acf.short_description) {
        length = 250;
      }

      this.reduceAcf(post.acf);

      post.excerpt = this.prepareExcerpt(excerpt, length);
    }

    post.content = post.content && post.content.rendered;
    post.title = stripHtmlTags(post.title);

    return post;
  }

  /**
   * Removes language prefix from passed url
   * @param {string} urlToReplace url
   * @param {string} prefix prefix to remove
   * @returns {string} url without prefix
   */
  replaceLanguagePrefix(urlToReplace, prefix) {
    return prefix && urlToReplace.indexOf(prefix) === 0 ? urlToReplace.replace(prefix, '') : urlToReplace;
  }

  prepareLink(item, meta) {
    const { title, ID: id, url: link, acf, target } = item;
    const { languagePrefix } = meta;
    let urlPath = link;
    let isExternal = false;

    if (target === '_blank') {
      isExternal = true;
    } else {
      urlPath = this.replaceLanguagePrefix(url.parse(link).pathname, languagePrefix);
    }

    if (item.children) {
      item.children = item.children.map(this.prepareLink);
    }

    const finalItem = {
      id,
      title,
      isExternal,
      url: urlPath,
      level: Number(item.menu_item_parent) || Number(item.parent) ? 2 : 1,
      children: item.children || []
    };

    if (acf && !isEmpty(acf)) {
      finalItem.acf = acf;
    }

    return finalItem;
  }

  reducePage(response) {
    const { data: item } = response;

    if (!item) {
      response.data = {};

      return response;
    }

    const reducedItem = pick(item, ['slug', 'acf', 'id', 'featured_image']);

    reducedItem.title = item.title && item.title.rendered && stripHtmlEntities(item.title.rendered);
    reducedItem.content = item.content && item.content.rendered;
    reducedItem.featured_image = this.reduceFeaturedImage(reducedItem.featured_image);
    this.reduceAcf(reducedItem.acf);

    response.data = Object.assign(reducedItem, { type: 'wp-page' });

    return response;
  }

  reduceCategory(response) {
    const category = response.data || {};

    if (category.promoted_posts) {
      category.promoted_posts = category.promoted_posts.map(item => this.processPost({ data: item }).data);
    }

    return response;
  }

  reduceRelatedPost(post) {
    // todo reduce to same format as normal post to clean components
    post.title = stripHtmlEntities(post.title);

    return post;
  }

  prepareExcerpt(data = {}, length = 145) {
    let content = '';

    if (isObject(data) && data.rendered) {
      content = data.rendered;
    } else if (data) {
      content = data;
    }

    content = stripHtmlEntities(content);

    return generateExcerpt(content, length);
  }

  reduceFeaturedImage(image) {
    return {
      url: image.url,
      description: image.description,
      // todo remove from core
      sizes: pick(image.sizes, [
        'thumbnail',
        'bones-thumb-search',
        'photo-l-land',
        'category-landing',
        'bones-thumb-590',
        'slide'
      ])
    };
  }

  /* eslint-disable no-unused-vars */
  /**
   * Project can define it's own custom field processing logic for example to reduce size of acf related payload
   * @param {object} content custom fields values
   */
  reduceAcf(content) {}
  /* eslint-enable no-unused-vars */

  isDraft(link) {
    return link && link.indexOf('preview/') === 0;
  }

  /**
   * Make sure that pathname that will be checked always starts and ends with '/'
   * @param {string} pathname to convert
   * @returns {string} converted pathname
   */
  preparePathname(pathname) {
    let path = pathname;

    if (!pathname.startsWith('/')) {
      path = `/${path}`;
    }

    if (!pathname.endsWith('/')) {
      path = `${path}/`;
    }

    return path;
  }

  /**
   * Based on api response check if requested pathname contains redirect
   * @param {string} dataPath pathname from wordpress api response
   * @param {string} requestedPath pathname requested by client
   * @returns {boolean}
   */
  isEntityRedirect(dataPath, requestedPath) {
    return (dataPath !== requestedPath && !this.isDraft(dataPath));
  }

  getFetchUrlPriority() {
    return this.fetchUrlPriority;
  }

  /**
   * Fetch wordpress url based on pathname and check if it contains any redirect.
   * Convert response based on data type (page | post | category )
   * @param {object} _ GQL root object
   * @param {object} params GQL params object
   * @param {string} params.path URL path param
   * @returns {object} response - with reduced and converted data
   */
  async fetchUrl(_, { path }) {
    const { locale } = this.context.session;

    return this.get(
      'url',
      { path },
      {
        context: {
          authRequired: this.isDraft(path),
          didReceiveResult: result => this.reduceUrl(result, path, this.languageMap[locale])
        }
      }
    );
  }

  reduceUrl(result, path, language) {
    const { data, type, url: entityUrl } = result;
    const languageUrl = this.replaceLanguagePrefix(entityUrl, language);

    return {
      id: data && data.id,
      path: languageUrl,
      type: `blog-${type}`,
      redirect: this.isEntityRedirect(this.preparePathname(languageUrl), this.preparePathname(path))
    };
  }
};
