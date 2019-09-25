import React from 'react';
import { themed, Box } from '@deity/falcon-ui';

export const PropertyRowLayout = themed({
  tag: Box,
  defaultTheme: {
    propertyRowLayout: {
      display: 'grid',
      gridGap: 'sm',
      gridAutoFlow: 'column',
      gridTemplateColumns: '1fr 2fr',
      variants: {
        spaceBetween: {
          gridTemplateColumns: '1fr auto'
        }
      }
    }
  }
});
