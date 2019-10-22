import React, { ReactNode } from 'react';
import { Box, themed } from '@deity/falcon-ui';

export const FixCenteredLayout = themed<{ maxWidth?: string | number; children?: ReactNode }, {}>({
  tag: Box,
  defaultProps: {
    maxWidth: '70%'
  },
  defaultTheme: {
    fixCenteredLayout: {
      css: ({ maxWidth }) => ({
        maxWidth,
        width: '100%',
        margin: '0 auto'
      })
    }
  }
});
