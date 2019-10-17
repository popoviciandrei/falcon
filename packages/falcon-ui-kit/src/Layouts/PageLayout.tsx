import React from 'react';
import { themed, Box } from '@deity/falcon-ui';

export const PageLayout = themed({
  tag: Box,
  defaultTheme: {
    pageLayout: {
      display: 'grid',
      gridGap: 'md',
      py: 'lg'
    }
  }
});
