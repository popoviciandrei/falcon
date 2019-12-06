import React from 'react';
import loadable from '@loadable/component';
import { Loader } from '@deity/falcon-ui-kit';

/**
 * loadable define code splitting point with lazy `import`, it needs to be exported as `default` and imported via `loadable` name to be compatible with SSR
 * @see https://github.com/smooth-code/loadable-components/issues/100#issuecomment-441192303
 * @param {() => Promise<any>} component module which should be lazy imported
 * @param {any} fallback component which is rendered while script is downloading, default is `Loader` from `@deity/falcon-ui-kit`
 * @returns {any} content of lazy imported module
 */
export default (component, fallback = <Loader />) => loadable(component, { fallback });
