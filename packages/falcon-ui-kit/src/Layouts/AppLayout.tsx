import React from 'react';
import { Box, themed } from '@deity/falcon-ui';

export const AppLayout = themed({
  tag: Box,

  defaultTheme: {
    appLayout: {
      px: {
        xs: 'sm',
        md: 'md'
      },
      css: {
        maxWidth: 1480,
        width: '100%',
        margin: '0 auto'
      }
    }
  }
});
