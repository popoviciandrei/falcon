import React from 'react';
import { Box, themed } from '@deity/falcon-ui';

export type FixCenteredLayoutProps = {
  maxWidth?: string | number;
  children?: React.ReactNode;
};

export const FixCenteredLayout = themed<FixCenteredLayoutProps>({
  tag: Box,
  defaultProps: {
    maxWidth: '70%'
  },
  defaultTheme: {
    fixCenteredLayout: {
      display: 'grid',
      gridGap: 'md',
      css: ({ maxWidth }) => ({
        maxWidth,
        width: '100%',
        margin: '0 auto'
      })
    }
  }
});
