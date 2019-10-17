import React from 'react';
import { Box, themed } from '@deity/falcon-ui';
import { toGridTemplate } from '../helpers';

export const HeaderBarArea = {
  logo: 'logo',
  signIn: 'signIn',
  cart: 'cart',
  search: 'search'
};

export const HeaderBarLayout = themed({
  tag: Box,
  defaultTheme: {
    headerBarLayout: {
      display: 'grid',
      py: 'sm',
      gridGap: 'sm',
      // prettier-ignore
      gridTemplate: toGridTemplate([
        ['auto',            '1fr',                'auto',               'auto'             ],
        [HeaderBarArea.logo, HeaderBarArea.search, HeaderBarArea.signIn, HeaderBarArea.cart]
      ]),
      css: {
        alignItems: 'center'
      }
    }
  }
});
