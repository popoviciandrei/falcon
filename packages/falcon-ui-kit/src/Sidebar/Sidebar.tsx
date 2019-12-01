import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar as FalconSidebar, Portal, Backdrop, Icon, Box } from '@deity/falcon-ui';

export type SidebarProps = {
  isOpen: boolean;
  side: SidebarSide;
  close: Function;
};
export const Sidebar: React.SFC<SidebarProps> = ({ close, isOpen, side, children }) => {
  const position = sidebarSideToPosition(side);

  return (
    <>
      <FalconSidebar as={Portal} visible={isOpen} side={side}>
        <Box position="relative" flex={1}>
          <Icon src="close" stroke="black" position="absolute" {...position} onClick={() => close && close()} />
          {children}
        </Box>
      </FalconSidebar>
      <Backdrop as={Portal} visible={isOpen} onClick={() => close && close()} />
    </>
  );
};
Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  side: PropTypes.oneOf(['left', 'right'])
};
Sidebar.defaultProps = {
  side: 'right'
};

export type SidebarSide = 'left' | 'right';
const sidebarSideToPosition = (side: SidebarSide) => {
  if (side === 'left' || side === 'right') {
    return {
      top: 4,
      right: 0
    };
  }

  throw new Error(`Unsupported Sidebar position !`);
};
