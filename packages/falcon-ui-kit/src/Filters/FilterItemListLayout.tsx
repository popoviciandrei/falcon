import React from 'react';
import { List, themed } from '@deity/falcon-ui';

export const FilterItemListLayout = themed({
  tag: List,
  defaultTheme: {
    filterItemListLayout: {
      css: {
        listStyle: 'none'
      }
    }
  }
});
