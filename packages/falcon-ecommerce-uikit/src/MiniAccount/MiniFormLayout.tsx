import React from 'react';
import { DefaultThemeProps, Box, H3 } from '@deity/falcon-ui';
import { FixCenteredLayout } from '../FixCenteredLayout';

const miniFormLayout: DefaultThemeProps = {
  miniFormLayout: {
    display: 'grid',
    gridRowGap: 'md'
  }
};

export const MiniFormLayout: React.SFC<{ title?: string }> = ({ title, children }) => (
  <Box defaultTheme={miniFormLayout}>
    {title && <H3>{title}</H3>}
    <FixCenteredLayout maxWidth="70%">{children}</FixCenteredLayout>
  </Box>
);
