import React from 'react';
import { Sidebar as SidebarLayout, Portal, Backdrop, Icon, Box } from '@deity/falcon-ui';

export type SidebarProps = {
  isOpen: boolean;
  side: 'left' | 'right';
  close: Function;
};

export const Sidebar: React.SFC<SidebarProps> = ({ close, isOpen, side, children }) => {
  const position = {
    top: 0,
    ...(side === 'left' ? { left: 0 } : { right: 0 })
  };

  return (
    <React.Fragment>
      <SidebarLayout as={Portal} visible={isOpen} side={side}>
        <Box position="relative" flex={1}>
          <Icon src="close" stroke="black" position="absolute" {...position} onClick={() => close && close()} />
          {children}
        </Box>
      </SidebarLayout>
      <Backdrop as={Portal} visible={isOpen} onClick={() => close && close()} />
    </React.Fragment>
  );
};
