import React from 'react';
import { themed, List } from '@deity/falcon-ui';

export const ProductListLayout = themed({
  tag: List,
  defaultTheme: {
    productListLayout: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
      gridAutoRows: '280px',
      gridGap: 'sm',
      m: 'none',
      p: 'none',
      css: {
        listStyle: 'none'
      }
    }
  }
});
