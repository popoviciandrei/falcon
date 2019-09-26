import React from 'react';
import { themed, Box, H3 } from '@deity/falcon-ui';

const SidebarLayoutInnerDOM: React.SFC<SidebarLayoutProps> = ({ title, children, ...rest }) => (
  <Box {...rest}>
    {title && <H3>{title}</H3>}
    <SidebarContentLayout>{children}</SidebarContentLayout>
  </Box>
);

export type SidebarLayoutProps = {
  title?: string;
};
export const SidebarLayout = themed<SidebarLayoutProps, any>({
  tag: SidebarLayoutInnerDOM,
  defaultTheme: {
    sidebarLayout: {
      display: 'grid',
      gridRowGap: 'md',
      gridTemplate: 'auto 1fr / 100%',
      css: {
        height: '100%'
      }
    }
  }
});

export const SidebarContentLayout = themed({
  tag: Box,
  defaultProps: {
    maxWidth: '70%'
  },
  defaultTheme: {
    sidebarContentLayout: {
      css: ({ maxWidth }) => ({
        maxWidth,
        width: '100%',
        margin: '0 auto'
      })
    }
  }
});
