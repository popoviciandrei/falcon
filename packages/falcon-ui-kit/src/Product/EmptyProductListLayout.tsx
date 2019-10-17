import React from 'react';
import { themed, Box } from '@deity/falcon-ui';

export const EmptyProductListLayout = themed({
  tag: Box,
  defaultTheme: {
    emptyProductListLayout: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      p: 'sm'
    }
  }
});
