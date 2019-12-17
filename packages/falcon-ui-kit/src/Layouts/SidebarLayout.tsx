import React from 'react';
import { themed, Box, H3, FlexLayout, Icon } from '@deity/falcon-ui';

const SidebarLayoutInnerDOM: React.SFC<SidebarLayoutProps> = ({ title, onClose, children, ...rest }) => (
  <Box {...rest}>
    <FlexLayout>
      <Box flex={1}>{!!title && <H3>{title}</H3>}</Box>
      <Icon src="close" stroke="black" onClick={onClose} />
    </FlexLayout>
    <SidebarContentLayout>{children}</SidebarContentLayout>
  </Box>
);

export type SidebarLayoutProps = {
  title?: string;
  onClose?: (...args: any) => void;
};
export const SidebarLayout = themed<SidebarLayoutProps, any>({
  tag: SidebarLayoutInnerDOM,
  defaultTheme: {
    sidebarLayout: {
      display: 'grid',
      gridRowGap: 'md',
      gridTemplate: 'auto 1fr / 100%',
      css: {
        width: '100%',
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
