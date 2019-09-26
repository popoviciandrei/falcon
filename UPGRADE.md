# Upgrade notes

**Note:** This is a cumulative upgrade notes file, that provides detailed instructions
on how to migrate your previously generated Falcon-based project to a newer version.

> Make sure you remove your `node_modules` folders from both `client` and `server` apps
> to ensure a proper installation of NPM packages before any upgrade between Falcon versions.

## Overview

There are 2 ways of upgrading - first one is simpler and updates only dependencies, second updates also your application with new features we added to our example app.

### Update of dependencies

Update versions of packages in both `client/package.json` and `server/package.json` so all packages from `@deity` scope match the newest versions - that way you get the newest changes in the libraries but you don't alter your existing application code. To do so you have to:

1. update both files mentioned above (`client/package.json`, `server/package.json`) - you can check the newest version in our repository - [client/package.json](https://github.com/deity-io/falcon/blob/master/examples/shop-with-blog/client/package.json), [server/package.json](https://github.com/deity-io/falcon/blob/master/examples/shop-with-blog/server/package.json)
2. remove `client/yarn.lock` and `server/yarn.lock`
3. remove `client/node_modules` and `server/node_modules`
4. run `yarn install` in `client` and `server` folders

### Update of everything

That's a bit more complex but it adds new features to your application that we added to our example. Keep in mind that it's not always possible to do so, i.e. if you have changed a lot of things in the code generated via [create-falcon-app](https://www.npmjs.com/package/create-falcon-app).

To apply such update you instead of 1st step from the list above you have to:

1. download the patch for the specific update (links for all updates are placed below)
2. apply that patch in the root directory of your application by executing the following command:

```bash
git apply falcon-update-xxxxxx.patch
```

where `xxxxxx` should be changed to a proper name of the patch.

3. solve potential conflicts between your changes and our new code

Next, follow steps 2, 3 and 4 to install required dependencies.

## Falcon 1.3 to 1.4

### Falcon-Server ApiDataSource

**[Possible upgrade required]** If your API package was previously adding extra resolvers via `addResolveFunctionsToSchema`
during the runtime - here's upgrade instructions on how to make those changes compatible with the new version of Falcon-Server:

Your current Api Class with `addResolveFunctionsToSchema` call:

```javascript
class MyApi extends ApiDataSource {
  constructor() {
    super();
    this.addTypeResolvers();
  }

  addTypeResolvers() {
    const resolvers = {
      BackendConfig: {
        shop: () => this.fetchBackendConfig()
      },
      ShopConfig: {
        weightUnit: () => this.session.weightUnit
      },
      Product: {
        price: (...args) => this.productPrice(...args)
      }
    };
    addResolveFunctionsToSchema({ schema: this.gqlServerConfig.schema, resolvers });
  }
}
```

Your upgraded Api Class with `getExtraResolvers` static method (`ApiDataSource` interface):

```javascript
class MyApi extends ApiDataSource {
  static getExtraResolvers(apiGetter) {
    return {
      BackendConfig: {
        shop: apiGetter(api => api.fetchBackendConfig())
      },
      ShopConfig: {
        weightUnit: apiGetter(api => api.session.weightUnit)
      },
      Product: {
        price: apiGetter((api, root, params, context, info) => api.productPrice(root, params, context, info))
      }
    };
  }
}
```

> `apiGetter` argument helps you to get required ApiDataSource instance from the current context
> and defined the required field resolver.

### Falcon-Client

`client/falcon-client.build.config.js`:

```diff
  serviceWorker: {
-    precache: process.env.NODE_ENV === 'production'
+    precache: process.env.NODE_ENV === 'production',
+    blacklistRoutes: config.proxyEndpoints || []
  },
```

`client/bootstrap.js`:

```diff
-    onRouterCreated: async router => configureProxy(router, serverUrl, serverConfig.endpoints, redirects)
+    onRouterCreated: async router => configureProxy(router, serverUrl, config.proxyEndpoints, redirects)
```

## Falcon 1.0 to 1.1

API configuration for falcon server

- Change your `magento2` api config key to the following structure:

```diff
{
  ...,
  "magento2": {
    "config":{
+     "auth": {
+       "type:" "admin-token"
        "username": "[username]",
        "password": "[password]"
+     }
    }
  }
}

```

## Falcon 1.0-rc3 to 1.0

Patch for this update can be found [here](https://github.com/deity-io/falcon/releases/download/v1.0/falcon-update-100rc3-100.patch).

## Falcon 1.0-rc2 to 1.0-rc3

Full patch for this update can be found [here](https://github.com/deity-io/falcon/releases/download/v1.0-rc3/falcon-update-100rc2-100rc3.patch).

If you don't want to include all the changes from this release but you want to keep Falcon Server and Falcon Client at the latest version then please follow the guide below to adjust your application.

In your falcon-client project - check `apolloClient.httpLink.uri` and `graphqlUrl` (your project may not have this key) config values
(in `config/default.json` file). If `apolloClient.httpLink.uri` uses a full GraphQL URL and you would like to enable proxying for
GraphQL server - make the following changes to your config file:

```diff
 {
+  "graphqlUrl": "http://localhost:4000/graphql",
   "apolloClient": {
     "httpLink": {
-      "uri": "http://localhost:4000/graphql"
+      "uri": "/graphql"
     }
   }
 }
```

If you wish to use your generated application without GraphQL proxy:

```diff
 {
+  "graphqlUrl": false,
   "apolloClient": {
     "httpLink": {
       "uri": "http://localhost:4000/graphql"
     }
   }
 }
```

`client/bootstrap.js` now must return an async callback that initiates the bootstrap
config:

```diff
const config = require('config');

- export default {
+ export default async () => ({
    config: { ...config }
- };
+ });
```

To enable endpoints proxy (for handling Payment callbacks) - you need to modify your
`client/bootstrap.js` file to fetch a list of endpoints from Falcon-Server and
enable them for Falcon-Client:

```js
const config = require('config');
const { fetchRemoteConfig, configureProxy } = require('@deity/falcon-client/src/bootstrap/configureServer');

export default async () => {
  const redirects = {
    payment: {
      success: '/checkout/confirmation',
      failure: '/checkout/failure',
      cancel: '/cart'
    }
  };
  const serverUrl = config.graphqlUrl || config.apolloClient.httpLink.uri;
  const serverConfig = await fetchRemoteConfig(serverUrl);

  return {
    config: { ...config },
    onRouterCreated: async router => configureProxy(router, serverUrl, serverConfig.endpoints, redirects)
  };
};
```

## Falcon 1.0-rc to 1.0-rc2

Patch for this update can be found [here](https://github.com/deity-io/falcon/releases/download/v1.0-rc2/falcon-update-100rc-100rc2.patch).

## Falcon 0.3.0 to 1.0-rc

Patch for this update can be found [here](https://github.com/deity-io/falcon/releases/download/v1.0-rc/falcon-update-030-100rc.patch).

## Falcon 0.2.0 to 0.3.0

Patch for this update can be found [here](https://github.com/deity-io/falcon/releases/download/v0.3/falcon-update-020-030.patch).

---

## Falcon 0.1.0 to 0.2.0

### Falcon-Server 0.2.0

- Change your `apis` and `extensions` config keys to the following structure:

```diff
{
  ...,
-  "apis": [
-    {
-      "name": "api-wordpress",
+  "apis": {
+    "api-wordpress": {
       "package": "@deity/falcon-wordpress-api",
       "config": {
         "host": "wordpress.deity.io",
         "protocol": "https",
         "apiPrefix": "/wp-json",
         "apiSuffix": "/wp/v2"
       }
     },
   },
```

- If you were using "endpoints" within your ApiDataSource class - you have to move them to a separate config
  section (read more about Endpoints [here](https://falcon.deity.io/docs/falcon-server/endpoints))
- `Events` enum object has been moved to `@deity/falcon-server-env` package:

```diff
- const { Events } = require('@deity/falcon-server');
+ const { Events } = require('@deity/falcon-server-env');
```

### Falcon-Client 0.2.0

- Rename `client/razzle.config.js` to `client/falcon-client.build.config.js`

```diff
- const { razzlePluginFalconClient } = require('@deity/falcon-client');

module.exports = {
-  plugins: [
-    razzlePluginFalconClient({
-      i18n: {
-        resourcePackages: ['@deity/falcon-i18n'],
-        filter: { lng: ['en'] }
-      }
-    })
-  ]
+  clearConsole: true,
+  useWebmanifest: true,
+  i18n: {
+    resourcePackages: ['@deity/falcon-i18n'],
+    filter: { lng: ['en'] }
+  }
};
```
